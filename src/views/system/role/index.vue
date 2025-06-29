<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限标识"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="角色状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜索</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="roleList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" width="100" />
        <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
        <el-table-column label="权限标识" prop="roleKey" :show-overflow-tooltip="true" />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" width="250">
          <template #default="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)">
              <el-icon><Edit /></el-icon>修改
            </el-button>
            <el-button type="primary" link @click="handlePermission(scope.row)">
              <el-icon><Setting /></el-icon>权限
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 角色信息对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限标识" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" :min="1" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" v-model="permDialog.visible" width="600px" append-to-body>
      <el-form :model="permForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="permForm.roleName" disabled />
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="permTree"
            :data="permissionOptions"
            show-checkbox
            node-key="id"
            :props="{ label: 'label', children: 'children' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitPermForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Search, Refresh, Plus, Edit, Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 列表查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: '',
  roleKey: '',
  status: ''
});

// 表单参数
const form = reactive({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 1,
  remark: ''
});

// 权限表单
const permForm = reactive({
  roleId: '',
  roleName: '',
  permIds: []
});

// 表单验证规则
const rules = {
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ],
  roleKey: [
    { required: true, message: '权限标识不能为空', trigger: 'blur' }
  ],
  roleSort: [
    { required: true, message: '角色顺序不能为空', trigger: 'blur' }
  ]
};

// 对话框状态
const dialog = reactive({
  visible: false,
  title: ''
});

// 权限对话框状态
const permDialog = reactive({
  visible: false
});

// 权限树选项
const permissionOptions = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      {
        id: 101,
        label: '用户管理',
        children: [
          { id: 10101, label: '用户查询' },
          { id: 10102, label: '用户新增' },
          { id: 10103, label: '用户修改' },
          { id: 10104, label: '用户删除' }
        ]
      },
      {
        id: 102,
        label: '角色管理',
        children: [
          { id: 10201, label: '角色查询' },
          { id: 10202, label: '角色新增' },
          { id: 10203, label: '角色修改' },
          { id: 10204, label: '角色删除' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '系统监控',
    children: [
      {
        id: 201,
        label: '在线用户',
        children: [
          { id: 20101, label: '在线查询' },
          { id: 20102, label: '批量强退' }
        ]
      },
      {
        id: 202,
        label: '日志管理',
        children: [
          { id: 20201, label: '操作日志' },
          { id: 20202, label: '登录日志' }
        ]
      }
    ]
  }
]);

// 表格数据
const loading = ref(false);
const roleList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const queryForm = ref(null);
const formRef = ref(null);
const permTree = ref(null);

// 初始化方法
onMounted(() => {
  getList();
});

// 获取角色列表数据
const getList = () => {
  loading.value = true;
  setTimeout(() => {
    // 模拟API调用
    roleList.value = [
      {
        roleId: 1,
        roleName: '超级管理员',
        roleKey: 'admin',
        roleSort: 1,
        status: 1,
        createTime: '2023-01-01'
      },
      {
        roleId: 2,
        roleName: '普通用户',
        roleKey: 'common',
        roleSort: 2,
        status: 1,
        createTime: '2023-01-02'
      },
      {
        roleId: 3,
        roleName: '访客',
        roleKey: 'visitor',
        roleSort: 3,
        status: 0,
        createTime: '2023-01-03'
      }
    ];
    total.value = 3;
    loading.value = false;
  }, 500);
};

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryForm.value.resetFields();
  handleQuery();
};

// 选择项变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getList();
};

// 分页页码变化
const handleCurrentChange = (page) => {
  queryParams.pageNum = page;
  getList();
};

// 状态变化
const handleStatusChange = (row) => {
  ElMessage.success(`修改状态成功：${row.status === 1 ? '启用' : '禁用'}`);
};

// 新增角色
const handleAdd = () => {
  resetForm();
  dialog.visible = true;
  dialog.title = "添加角色";
};

// 修改角色
const handleUpdate = (row) => {
  resetForm();
  // 模拟API调用，获取角色详情
  Object.assign(form, row);
  dialog.visible = true;
  dialog.title = "修改角色";
};

// 删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除角色"${row.roleName}"吗？`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    ElMessage.success("删除成功");
    getList();
  }).catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  const roleNames = selectedRows.value.map(item => item.roleName).join(",");
  ElMessageBox.confirm(`确认删除选中的${selectedRows.value.length}个角色吗？`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    ElMessage.success("批量删除成功");
    getList();
  }).catch(() => {});
};

// 重置表单
const resetForm = () => {
  form.roleId = undefined;
  form.roleName = '';
  form.roleKey = '';
  form.roleSort = 0;
  form.status = 1;
  form.remark = '';
  
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    
    // 模拟API调用
    if (form.roleId) {
      ElMessage.success("修改成功");
    } else {
      ElMessage.success("添加成功");
    }
    
    dialog.visible = false;
    getList();
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

// 分配权限
const handlePermission = (row) => {
  permForm.roleId = row.roleId;
  permForm.roleName = row.roleName;
  // 模拟获取角色权限
  permTree.value?.setCheckedKeys([101, 102]);
  permDialog.visible = true;
};

// 提交权限
const submitPermForm = () => {
  const checkedKeys = permTree.value.getCheckedKeys();
  const halfCheckedKeys = permTree.value.getHalfCheckedKeys();
  const allKeys = [...checkedKeys, ...halfCheckedKeys];
  
  ElMessage.success("分配权限成功");
  permDialog.visible = false;
};
</script>

<style lang="scss" scoped>
.app-container {
  .search-wrapper {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: flex-start;
      
    .el-button {
      margin-right: 10px;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 
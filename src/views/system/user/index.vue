<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜索</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button @click="handleExport"><el-icon><Download /></el-icon>导出</el-button>
        </div>
      </template>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户编号" prop="userId" width="100" />
        <el-table-column label="用户名称" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickname" :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" prop="phone" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center">
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
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)">
              <el-icon><Edit /></el-icon>修改
            </el-button>
            <el-button type="primary" link @click="handleSetRole(scope.row)">
              <el-icon><Setting /></el-icon>角色
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
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
    
    <!-- 用户信息对话框 -->
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
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名称" :disabled="form.userId !== undefined" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.userId">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
            <el-option label="未知" value="2" />
          </el-select>
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
    
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" v-model="roleDialog.visible" width="500px" append-to-body>
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="roleForm.username" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleForm.roleIds">
            <el-checkbox
              v-for="role in roleOptions"
              :key="role.roleId"
              :label="role.roleId"
            >{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Search, Refresh, Plus, Delete, Download, Edit, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isValidEmail, isValidPhone } from '@/utils/validate'

// 列表查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  phone: '',
  status: ''
});

// 日期范围
const dateRange = ref([]);

// 表单参数
const form = reactive({
  userId: undefined,
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  sex: '1',
  status: 1,
  remark: ''
});

// 角色表单
const roleForm = reactive({
  userId: '',
  username: '',
  roleIds: []
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度必须在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { 
      validator: (rule, value, callback) => {
        if (value && !isValidEmail(value)) {
          callback(new Error('请输入正确的邮箱地址'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value && !isValidPhone(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

// 对话框状态
const dialog = reactive({
  visible: false,
  title: ''
});

// 角色对话框状态
const roleDialog = reactive({
  visible: false
});

// 角色选项
const roleOptions = ref([
  { roleId: 1, roleName: '管理员' },
  { roleId: 2, roleName: '普通用户' },
  { roleId: 3, roleName: '访客' }
]);

// 表格数据
const loading = ref(false);
const userList = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const queryForm = ref(null);
const formRef = ref(null);

// 初始化方法
onMounted(() => {
  getList();
});

// 获取用户列表数据
const getList = () => {
  loading.value = true;
  setTimeout(() => {
    // 模拟API调用
    userList.value = [
      {
        userId: 1,
        username: 'admin',
        nickname: '管理员',
        phone: '13800138000',
        status: 1,
        createTime: '2023-01-01'
      },
      {
        userId: 2,
        username: 'zhangsan',
        nickname: '张三',
        phone: '13800138001',
        status: 1,
        createTime: '2023-01-02'
      },
      {
        userId: 3,
        username: 'lisi',
        nickname: '李四',
        phone: '13800138002',
        status: 0,
        createTime: '2023-01-03'
      },
      {
        userId: 4,
        username: 'wangwu',
        nickname: '王五',
        phone: '13800138003',
        status: 1,
        createTime: '2023-01-04'
      }
    ];
    total.value = 4;
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
  dateRange.value = [];
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

// 新增用户
const handleAdd = () => {
  resetForm();
  dialog.visible = true;
  dialog.title = "添加用户";
};

// 修改用户
const handleUpdate = (row) => {
  resetForm();
  // 模拟API调用，获取用户详情
  Object.assign(form, row);
  dialog.visible = true;
  dialog.title = "修改用户";
};

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户"${row.username}"吗？`, "系统提示", {
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
  const usernames = selectedRows.value.map(item => item.username).join(",");
  ElMessageBox.confirm(`确认删除选中的${selectedRows.value.length}个用户吗？`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    ElMessage.success("批量删除成功");
    getList();
  }).catch(() => {});
};

// 导出
const handleExport = () => {
  ElMessage.success("导出成功");
};

// 重置表单
const resetForm = () => {
  form.userId = undefined;
  form.username = '';
  form.nickname = '';
  form.password = '';
  form.phone = '';
  form.email = '';
  form.sex = '1';
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
    if (form.userId) {
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

// 分配角色
const handleSetRole = (row) => {
  roleForm.userId = row.userId;
  roleForm.username = row.username;
  // 模拟获取用户角色数据
  roleForm.roleIds = [1];
  roleDialog.visible = true;
};

// 提交角色
const submitRoleForm = () => {
  ElMessage.success("分配角色成功");
  roleDialog.visible = false;
};
</script>

<style lang="scss" scoped>
.app-container {
  .search-wrapper {
    margin-bottom: 20px;
  }
  
  .table-wrapper {
    .card-header {
      display: flex;
      justify-content: flex-start;
      
      .el-button {
        margin-right: 10px;
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 
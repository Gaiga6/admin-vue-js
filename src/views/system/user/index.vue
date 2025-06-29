<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item :label="$t('user.username')">
          <el-input
            v-model="queryParams.username"
            :placeholder="$t('user.username')"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item :label="$t('user.phone')">
          <el-input
            v-model="queryParams.phone"
            :placeholder="$t('user.phone')"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item :label="$t('user.status')">
          <el-select v-model="queryParams.status" :placeholder="$t('user.status')" clearable>
            <el-option :label="$t('user.statusNormal')" value="1" />
            <el-option :label="$t('user.statusDisabled')" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            {{ $t('user.addUser') }}
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            {{ $t('user.batchDelete') }}
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            {{ $t('common.export') }}
          </el-button>
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
        <el-table-column :label="$t('user.userId')" prop="userId" width="100" />
        <el-table-column :label="$t('user.username')" prop="username" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('user.nickname')" prop="nickname" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('user.phone')" prop="phone" :show-overflow-tooltip="true" />
        <el-table-column :label="$t('user.status')" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === '1' ? $t('user.statusNormal') : $t('user.statusDisabled') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.createTime')" align="center" prop="createTime" />
        <el-table-column :label="$t('user.actions')" align="center" width="220">
          <template #default="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)">
              <el-icon><Edit /></el-icon>
              {{ $t('user.editUser') }}
            </el-button>
            <el-button type="primary" link @click="handleSetRole(scope.row)">
              <el-icon><Setting /></el-icon>
              {{ $t('user.setRole') }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>
              {{ $t('user.deleteUser') }}
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
        <el-form-item :label="$t('user.username')" prop="username">
          <el-input v-model="form.username" :placeholder="$t('user.username')" :disabled="form.userId !== undefined" />
        </el-form-item>
        <el-form-item :label="$t('user.nickname')" prop="nickname">
          <el-input v-model="form.nickname" :placeholder="$t('user.nickname')" />
        </el-form-item>
        <el-form-item :label="$t('user.phone')" prop="phone">
          <el-input v-model="form.phone" :placeholder="$t('user.phone')" maxlength="11" />
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="email">
          <el-input v-model="form.email" :placeholder="$t('user.email')" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('user.password')" prop="password" v-if="!form.userId">
          <el-input v-model="form.password" :placeholder="$t('user.password')" type="password" />
        </el-form-item>
        <el-form-item :label="$t('user.confirmPassword')" prop="confirmPassword" v-if="!form.userId">
          <el-input v-model="form.confirmPassword" :placeholder="$t('user.confirmPassword')" type="password" />
        </el-form-item>
        <el-form-item :label="$t('user.sex')">
          <el-select v-model="form.sex" :placeholder="$t('user.sex')">
            <el-option :label="$t('user.male')" value="1" />
            <el-option :label="$t('user.female')" value="0" />
            <el-option :label="$t('user.unknown')" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">{{ $t('user.statusNormal') }}</el-radio>
            <el-radio :value="0">{{ $t('user.statusDisabled') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('user.remark')">
          <el-input v-model="form.remark" :placeholder="$t('user.remark')" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('common.save') }}</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" v-model="roleDialog.visible" width="500px" append-to-body>
      <el-form :model="roleForm" label-width="80px">
        <el-form-item :label="$t('user.username')">
          <el-input v-model="roleForm.username" disabled />
        </el-form-item>
        <el-form-item :label="$t('user.role')">
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
          <el-button @click="roleDialog.visible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitRoleForm">{{ $t('common.save') }}</el-button>
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
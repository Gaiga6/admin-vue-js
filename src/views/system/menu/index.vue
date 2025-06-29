<template>
  <div class="app-container">
    <!-- 搜索工具栏 -->
    <el-card shadow="never" class="search-wrapper">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <div class="card-header">
          <el-button 
            type="primary" 
            @click="handleAdd"
            v-permission="'system:menu:create'"
          >
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button 
            @click="handleExpandAll"
          >
            {{ isExpandAll ? '折叠' : '展开' }}
          </el-button>
        </div>
      </template>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" />
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <el-icon v-if="scope.row.icon">
              <component :is="scope.row.icon" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" align="center" width="80" />
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              @click="handleAdd(scope.row)"
              v-permission="'system:menu:create'"
            >
              <el-icon><Plus /></el-icon>新增
            </el-button>
            <el-button 
              type="primary" 
              link 
              @click="handleUpdate(scope.row)"
              v-permission="'system:menu:edit'"
            >
              <el-icon><Edit /></el-icon>修改
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleDelete(scope.row)"
              v-permission="'system:menu:delete'"
            >
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="700px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                v-model="form.parentId"
                :data="treeSelectData"
                :props="{ value: 'id', label: 'menuName', children: 'children' }"
                value-key="id"
                placeholder="请选择上级菜单"
                check-strictly
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标识" prop="perms" v-if="form.menuType !== 'M'">
              <el-input v-model="form.perms" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" :min="0" :max="999" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon" v-if="form.menuType !== 'F'">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
              >
                <template #reference>
                  <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                    <template #prefix>
                      <el-icon v-if="form.icon">
                        <component :is="form.icon" />
                      </el-icon>
                      <el-icon v-else><Picture /></el-icon>
                    </template>
                  </el-input>
                </template>
                <!-- 图标选择器 -->
                <div class="icon-selector">
                  <div class="icon-item" v-for="iconName in iconList" :key="iconName" @click="selectIcon(iconName)">
                    <el-icon>
                      <component :is="iconName" />
                    </el-icon>
                    <span>{{ iconName }}</span>
                  </div>
                </div>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path" v-if="form.menuType !== 'F'">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component" v-if="form.menuType === 'C'">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Refresh, Plus, Edit, Delete, Picture } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 加载状态
const loading = ref(false);
// 展开状态
const isExpandAll = ref(true);
// 菜单表格数据
const menuList = ref([]);
// 树选择数据
const treeSelectData = ref([]);
// 查询参数
const queryParams = reactive({
  menuName: '',
  status: ''
});
// 表单参数
const form = reactive({
  id: undefined,
  parentId: 0,
  menuType: 'M',
  menuName: '',
  path: '',
  component: '',
  perms: '',
  icon: '',
  orderNum: 0,
  status: '0'
});
// 表单校验规则
const rules = {
  menuName: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' }
  ],
  menuType: [
    { required: true, message: '菜单类型不能为空', trigger: 'change' }
  ]
};
// 对话框状态
const dialog = reactive({
  visible: false,
  title: ''
});
// 表单引用
const formRef = ref(null);
// 查询表单引用
const queryForm = ref(null);
// 可用图标列表
const iconList = computed(() => {
  return Object.keys(ElementPlusIconsVue).filter(key => !key.includes('El'));
});

// 初始化方法
onMounted(() => {
  getList();
});

// 获取菜单列表
const getList = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    // 菜单数据示例
    menuList.value = [
      {
        id: 1,
        menuName: '系统管理',
        icon: 'Setting',
        orderNum: 0,
        perms: '',
        component: '',
        status: '0',
        path: '/system',
        menuType: 'M',
        children: [
          {
            id: 100,
            menuName: '用户管理',
            icon: 'User',
            orderNum: 1,
            perms: 'system:user:list',
            component: 'system/user/index',
            status: '0',
            path: 'user',
            menuType: 'C',
            children: [
              {
                id: 1001,
                menuName: '用户查询',
                icon: null,
                orderNum: 1,
                perms: 'system:user:query',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1002,
                menuName: '用户新增',
                icon: null,
                orderNum: 2,
                perms: 'system:user:create',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1003,
                menuName: '用户编辑',
                icon: null,
                orderNum: 3,
                perms: 'system:user:edit',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1004,
                menuName: '用户删除',
                icon: null,
                orderNum: 4,
                perms: 'system:user:delete',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              }
            ]
          },
          {
            id: 101,
            menuName: '角色管理',
            icon: 'UserFilled',
            orderNum: 2,
            perms: 'system:role:list',
            component: 'system/role/index',
            status: '0',
            path: 'role',
            menuType: 'C',
            children: [
              {
                id: 1011,
                menuName: '角色查询',
                icon: null,
                orderNum: 1,
                perms: 'system:role:query',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1012,
                menuName: '角色新增',
                icon: null,
                orderNum: 2,
                perms: 'system:role:create',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1013,
                menuName: '角色编辑',
                icon: null,
                orderNum: 3,
                perms: 'system:role:edit',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1014,
                menuName: '角色删除',
                icon: null,
                orderNum: 4,
                perms: 'system:role:delete',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              }
            ]
          },
          {
            id: 102,
            menuName: '菜单管理',
            icon: 'Menu',
            orderNum: 3,
            perms: 'system:menu:list',
            component: 'system/menu/index',
            status: '0',
            path: 'menu',
            menuType: 'C',
            children: [
              {
                id: 1021,
                menuName: '菜单查询',
                icon: null,
                orderNum: 1,
                perms: 'system:menu:query',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1022,
                menuName: '菜单新增',
                icon: null,
                orderNum: 2,
                perms: 'system:menu:create',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1023,
                menuName: '菜单编辑',
                icon: null,
                orderNum: 3,
                perms: 'system:menu:edit',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              },
              {
                id: 1024,
                menuName: '菜单删除',
                icon: null,
                orderNum: 4,
                perms: 'system:menu:delete',
                component: '',
                status: '0',
                path: '',
                menuType: 'F'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        menuName: '仪表盘',
        icon: 'Odometer',
        orderNum: 1,
        perms: '',
        component: '',
        status: '0',
        path: '/admin',
        menuType: 'M',
        children: [
          {
            id: 201,
            menuName: '数据概览',
            icon: 'TrendCharts',
            orderNum: 1,
            perms: '',
            component: 'dashboard/index',
            status: '0',
            path: 'dashboard',
            menuType: 'C'
          }
        ]
      }
    ];
    
    // 设置树选择数据
    const rootMenu = { id: 0, menuName: '主目录', children: [] };
    rootMenu.children = [...menuList.value];
    treeSelectData.value = [rootMenu];
    
    loading.value = false;
  }, 300);
};

// 查询操作
const handleQuery = () => {
  getList();
};

// 重置查询
const resetQuery = () => {
  queryForm.value.resetFields();
  handleQuery();
};

// 展开/折叠操作
const handleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
};

// 新增菜单
const handleAdd = (row) => {
  resetForm();
  
  if (row) {
    // 添加子菜单
    form.parentId = row.id;
    
    if (row.menuType === 'M') {
      // 如果父级是目录，则默认新增为菜单类型
      form.menuType = 'C';
    } else if (row.menuType === 'C') {
      // 如果父级是菜单，则默认新增为按钮类型
      form.menuType = 'F';
    }
  } else {
    // 添加顶级菜单
    form.parentId = 0;
    form.menuType = 'M';
  }
  
  dialog.visible = true;
  dialog.title = '添加菜单';
};

// 修改菜单
const handleUpdate = (row) => {
  resetForm();
  
  Object.assign(form, row);
  
  dialog.visible = true;
  dialog.title = '修改菜单';
};

// 删除菜单
const handleDelete = (row) => {
  // 有子菜单时不允许删除
  if (row.children && row.children.length > 0) {
    ElMessage.warning('存在子菜单，不允许删除');
    return;
  }
  
  ElMessageBox.confirm(`确认删除菜单"${row.menuName}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    ElMessage.success('删除成功');
    getList();
  }).catch(() => {});
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    
    // 模拟API调用
    if (form.id) {
      ElMessage.success('修改成功');
    } else {
      // 模拟自动生成ID
      form.id = Math.floor(Math.random() * 10000);
      ElMessage.success('添加成功');
    }
    
    dialog.visible = false;
    getList();
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 选择图标
const selectIcon = (iconName) => {
  form.icon = iconName;
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.parentId = 0;
  form.menuType = 'M';
  form.menuName = '';
  form.path = '';
  form.component = '';
  form.perms = '';
  form.icon = '';
  form.orderNum = 0;
  form.status = '0';
  
  if (formRef.value) {
    formRef.value.resetFields();
  }
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
      margin-bottom: 10px;
      
      .el-button {
        margin-right: 10px;
      }
    }
  }
  
  .icon-selector {
    height: 250px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 10px;
    padding: 10px;
    
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      cursor: pointer;
      border-radius: 4px;
      
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
      
      .el-icon {
        font-size: 20px;
        margin-bottom: 5px;
      }
      
      span {
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style> 
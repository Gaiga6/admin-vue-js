import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 默认静态路由，所有用户都可访问的路由
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    name: 'Home',
    meta: { title: '首页', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    meta: { hidden: true }
  }
]

export const usePermissionStore = defineStore('permission', () => {
  // 路由状态
  const routes = ref([])
  const dynamicRoutes = ref([])
  const buttons = ref([])
  const dataScope = ref('ALL') // 数据权限范围：ALL(全部), DEPT(本部门), SELF(本人)等
  
  // 获取所有路由
  const getRoutes = computed(() => [...constantRoutes, ...routes.value])
  
  // 根据角色生成可访问路由
  const generateRoutes = async (roles) => {
    try {
      // 这里模拟从后端获取路由的过程
      // 实际项目中应通过API请求获取用户的权限路由
      const asyncRoutes = await loadAsyncRoutes()
      
      let accessedRoutes
      if (roles.includes('admin')) {
        // 管理员拥有所有权限
        accessedRoutes = asyncRoutes
      } else {
        // 根据角色过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      
      // 更新状态
      routes.value = accessedRoutes
      dynamicRoutes.value = accessedRoutes
      return accessedRoutes
    } catch (error) {
      console.error('获取路由权限失败:', error)
      return []
    }
  }
  
  // 设置按钮权限
  const setButtonPermissions = (permissionList) => {
    buttons.value = permissionList
  }
  
  // 设置数据权限范围
  const setDataScope = (scope) => {
    dataScope.value = scope
  }
  
  // 重置所有权限
  const resetPermission = () => {
    routes.value = []
    dynamicRoutes.value = []
    buttons.value = []
    dataScope.value = 'ALL'
  }
  
  return {
    routes,
    dynamicRoutes,
    buttons,
    dataScope,
    getRoutes,
    generateRoutes,
    setButtonPermissions,
    setDataScope,
    resetPermission
  }
})

// 模拟获取异步路由
function loadAsyncRoutes() {
  return Promise.resolve([
    {
      path: '/admin',
      component: 'Layout',
      redirect: '/admin/dashboard',
      meta: { title: '系统首页', icon: 'Odometer', roles: ['admin', 'editor'] },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: 'dashboard/index',
          meta: { title: '仪表盘', icon: 'Odometer', roles: ['admin', 'editor'] }
        }
      ]
    },
    {
      path: '/system',
      component: 'Layout',
      redirect: '/system/user',
      meta: { title: '系统管理', icon: 'Setting', roles: ['admin'] },
      children: [
        {
          path: 'user',
          name: 'User',
          component: 'system/user/index',
          meta: { title: '用户管理', icon: 'User', roles: ['admin'] }
        },
        {
          path: 'role',
          name: 'Role',
          component: 'system/role/index',
          meta: { title: '角色管理', icon: 'UserFilled', roles: ['admin'] }
        },
        {
          path: 'menu',
          name: 'Menu',
          component: 'system/menu/index',
          meta: { title: '菜单管理', icon: 'Menu', roles: ['admin'] }
        }
      ]
    }
  ])
}

// 根据角色过滤路由
function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 判断是否有路由权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true // 如果路由没有设置roles，默认所有人可访问
  }
} 
import router from './index'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { ElMessage } from 'element-plus'
import { createRouter } from './index'

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 将重置路由函数挂载到全局，以便其他地方调用
window.resetRouter = resetRouter

const whiteList = ['/login', '/', '/404'] // 不需要登录的白名单页面

/**
 * 动态导入组件
 * @param {string} component 组件路径
 * @returns {Promise} 组件
 */
function loadComponent(component) {
  // Layout组件特殊处理
  if (component === 'Layout') {
    return import('@/layout/index.vue')
  }
  
  // 使用组件映射表
  const componentMap = {
    'dashboard/index': () => import('@/views/dashboard/index.vue'),
    'system/user/index': () => import('@/views/system/user/index.vue'),
    'system/role/index': () => import('@/views/system/role/index.vue'),
    'system/menu/index': () => import('@/views/system/menu/index.vue'),
    'login/index': () => import('@/views/login/index.vue'),
    'error-page/404': () => import('@/views/error-page/404.vue')
  }
  
  // 如果组件在映射表中，使用预定义的导入
  if (componentMap[component]) {
    return componentMap[component]()
  }
  
  // 如果不在映射表中，尝试使用动态导入（但这种方式在Vite中可能不稳定）
  console.warn(`Component ${component} not found in component map, trying dynamic import`)
  return import(`@/views/${component}.vue`)
}

/**
 * 动态创建路由
 * @param {Array} routes 路由配置
 */
function createRoutes(routes) {
  return routes.map(route => {
    const newRoute = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: route.meta,
      component: () => loadComponent(route.component)
    }
    // 处理子路由
    if (route.children && route.children.length > 0) {
      newRoute.children = createRoutes(route.children)
    }
    return newRoute
  })
}

// 路由守卫
router.beforeEach(async(to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  // 获取token
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/admin/dashboard' })
    } else {
      // 已登录但还没有获取过用户信息
      if (userStore.roles.length === 0) {
        try {
          // 获取用户信息
          const { roles, permissions } = await userStore.getUserInfo()
          
          // 根据角色生成可访问路由
          const accessRoutes = await permissionStore.generateRoutes(roles)
          
          // 设置按钮权限
          permissionStore.setButtonPermissions(permissions)
          
          // 动态添加路由（只添加不存在的路由）
          const realRoutes = createRoutes(accessRoutes)
          realRoutes.forEach(route => {
            // 检查路由是否已经存在
            const existingRoute = router.getRoutes().find(r => r.path === route.path)
            if (!existingRoute) {
              router.addRoute(route)
            }
          })
          
          // 设置replace为true，不会向history添加新记录
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，重置token并跳转到登录页
          await userStore.logout()
          ElMessage.error(error.message || '出现错误，请重新登录')
          next(`/login?redirect=${encodeURIComponent(to.path)}`)
        }
      } else {
        next()
      }
    }
  } else {
    // 未登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单中的页面直接跳转
      next()
    } else {
      // 不在白名单中，重定向到登录页面
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
    }
  }
})

export default router 
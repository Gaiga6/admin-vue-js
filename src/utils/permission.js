/**
 * 解析路由角色权限，将字符串数组转换为对象
 * @param {Array} routeRecords 路由记录
 */
export function transformRoutePermission(routeRecords) {
  const routes = []
  
  routeRecords.forEach(route => {
    // 创建新对象，避免修改原对象
    const newRoute = { ...route }
    
    // 处理meta
    if (newRoute.meta) {
      newRoute.meta = { ...newRoute.meta }
      
      // 处理meta.roles
      if (Array.isArray(newRoute.meta.roles)) {
        newRoute.meta.roleIds = newRoute.meta.roles.map(role => String(role))
      }
    }
    
    // 处理子路由
    if (newRoute.children && newRoute.children.length > 0) {
      newRoute.children = transformRoutePermission(newRoute.children)
    }
    
    routes.push(newRoute)
  })
  
  return routes
}

/**
 * 根据权限码组装树形结构
 * @param {Array} permissions 权限列表
 */
export function buildPermissionTree(permissions) {
  const permissionMap = {}
  const result = []
  
  // 先转换为映射表
  for (const permission of permissions) {
    permissionMap[permission.id] = {
      ...permission,
      children: []
    }
  }
  
  // 组装树形结构
  for (const id in permissionMap) {
    const permission = permissionMap[id]
    if (permission.parentId) {
      // 有父级，作为子节点添加
      if (permissionMap[permission.parentId]) {
        permissionMap[permission.parentId].children.push(permission)
      }
    } else {
      // 没有父级，作为根节点
      result.push(permission)
    }
  }
  
  return result
}

/**
 * 从按钮权限列表中找出菜单权限
 * @param {Array} permissions 权限列表
 * @param {String} type 权限类型，menu:菜单权限 button:按钮权限
 */
export function filterPermissionsByType(permissions, type) {
  return permissions.filter(p => p.type === type)
}

/**
 * 重置路由
 */
export function resetRouter() {
  // 实际项目中需要根据路由实现来重置路由
  // 这里只是一个示例，与实际框架集成时需要调整
  const router = window.router
  if (router) {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
  }
}

/**
 * 判断是否有权限
 * @param {Array} permissions 用户权限列表
 * @param {String|Array} permission 需要校验的权限
 */
export function hasPermission(permissions, permission) {
  if (!permission) return true
  
  if (Array.isArray(permission)) {
    return permission.some(p => permissions.includes(p))
  }
  
  return permissions.includes(permission)
} 
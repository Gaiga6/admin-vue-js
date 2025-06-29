import { useUserStore } from '@/stores/user'

/**
 * 按钮权限指令
 * @example v-permission="'system:user:add'"
 * @example v-permission="['system:user:add', 'system:user:edit']"
 */
export const permission = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value) {
      // 判断是否有权限
      const hasPermission = Array.isArray(value)
        ? userStore.hasAnyPermission(value) // 数组格式，拥有任意一个权限即可
        : userStore.hasPermission(value)    // 字符串格式，必须拥有该权限
      
      if (!hasPermission) {
        // 没有权限则移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('权限指令必须指定权限标识')
    }
  }
}

/**
 * 角色权限指令
 * @example v-role="'admin'"
 * @example v-role="['admin', 'editor']"
 */
export const role = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value) {
      // 判断是否有角色
      const hasRole = Array.isArray(value)
        ? value.some(role => userStore.hasRole(role)) // 数组格式，拥有任意一个角色即可
        : userStore.hasRole(value)                   // 字符串格式，必须拥有该角色
      
      if (!hasRole) {
        // 没有角色则移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('角色指令必须指定角色标识')
    }
  }
}

export default {
  permission,
  role
} 
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { resetRouter } from '@/router/permission'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const roles = ref([])
  const permissions = ref([])
  
  // 登录
  async function login(loginData) {
    try {
      // 模拟登录接口调用
      // 实际项目中应该调用真实的登录API
      const { username, password } = loginData
      
      // 模拟成功登录
      if (username && password) {
        const mockToken = 'mock_token_' + Math.random().toString(36).substr(2)
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        
        // 登录成功后获取用户信息
        await getUserInfo()
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }
  
  // 获取用户信息
  async function getUserInfo() {
    try {
      // 模拟获取用户信息API
      // 实际项目中应该调用真实的用户信息API
      const mockUserInfo = {
        userId: '1',
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        roles: ['admin'],
        permissions: [
          // 用户管理权限
          'system:user:list',
          'system:user:query',
          'system:user:create',
          'system:user:edit',
          'system:user:delete',
          // 角色管理权限
          'system:role:list',
          'system:role:query',
          'system:role:create',
          'system:role:edit',
          'system:role:delete',
          // 菜单管理权限
          'system:menu:list',
          'system:menu:query',
          'system:menu:create',
          'system:menu:edit',
          'system:menu:delete'
        ],
        dataScope: 'ALL' // 数据权限范围
      }
      
      userInfo.value = mockUserInfo
      roles.value = mockUserInfo.roles
      permissions.value = mockUserInfo.permissions
      
      return {
        roles: mockUserInfo.roles,
        permissions: mockUserInfo.permissions,
        dataScope: mockUserInfo.dataScope
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw new Error('获取用户信息失败')
    }
  }
  
  // 登出
  function logout() {
    token.value = ''
    userInfo.value = {}
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
    
    // 重置路由
    resetRouter()
    
    // 跳转到登录页
    router.push('/login')
  }
  
  // 重置token
  function resetToken() {
    token.value = ''
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
  }
  
  // 检查权限
  function hasPermission(permission) {
    if (!permission) return true
    return permissions.value.includes(permission)
  }
  
  // 检查是否拥有角色
  function hasRole(role) {
    if (!role) return true
    return roles.value.includes(role)
  }
  
  // 检查是否拥有任意一个权限
  function hasAnyPermission(permissionList) {
    if (!permissionList || permissionList.length === 0) return true
    return permissionList.some(permission => permissions.value.includes(permission))
  }
  
  // 检查是否拥有所有权限
  function hasAllPermissions(permissionList) {
    if (!permissionList || permissionList.length === 0) return true
    return permissionList.every(permission => permissions.value.includes(permission))
  }
  
  return {
    token,
    userInfo,
    roles,
    permissions,
    login,
    getUserInfo,
    logout,
    resetToken,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions
  }
}) 
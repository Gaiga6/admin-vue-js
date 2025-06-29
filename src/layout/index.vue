<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapse': !sidebarOpened }">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <img src="../assets/vue.svg" alt="Logo" class="logo" />
        <h1 v-if="sidebarOpened" class="title">后台管理系统</h1>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="!sidebarOpened"
          :unique-opened="true"
          :background-color="variables.menuBgColor"
          :text-color="variables.menuTextColor"
          :active-text-color="variables.menuActiveTextColor"
          router
        >
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            v-show="!route.meta?.hidden"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left-area">
          <el-icon class="menu-toggle" @click="toggleSidebar">
            <component :is="sidebarOpened ? 'Fold' : 'Expand'" />
          </el-icon>
          <breadcrumb />
        </div>
        
        <div class="right-menu">
          <div class="theme-switch" @click="toggleDarkMode">
            <el-icon v-if="isDark"><MoonNight /></el-icon>
            <el-icon v-else><Sunny /></el-icon>
          </div>
          
          <el-dropdown trigger="click">
            <div class="avatar-container">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ userInfo.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toProfile">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import SidebarItem from './components/SidebarItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import { MoonNight, Sunny, Fold, Expand } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 侧边栏状态
const sidebarOpened = ref(true)
const toggleSidebar = () => {
  sidebarOpened.value = !sidebarOpened.value
}

// 主题状态
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

// 用户状态
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 路由
const routes = computed(() => {
  return router.options.routes.filter(route => !route.meta?.hidden)
})

// 当前激活菜单
const activeMenu = computed(() => {
  return route.path
})

// CSS 变量
const variables = computed(() => {
  return {
    menuBgColor: 'var(--app-menu-bg-color)',
    menuTextColor: 'var(--app-menu-text-color)',
    menuActiveTextColor: 'var(--app-menu-active-text-color)'
  }
})

// 初始化主题
onMounted(() => {
  themeStore.initTheme()
})

// 个人中心
const toProfile = () => {
  // 跳转到个人中心页面
  // router.push('/profile')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  
  // 侧边栏
  .sidebar-container {
    width: 210px;
    height: 100%;
    background-color: var(--app-menu-bg-color);
    transition: width 0.3s;
    z-index: 1001;
    overflow: hidden;
    
    .logo-container {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      overflow: hidden;
      
      .logo {
        width: 28px;
        height: 28px;
        margin-right: 10px;
      }
      
      .title {
        color: var(--app-menu-active-text-color);
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
        margin: 0;
      }
    }
    
    .el-menu {
      border-right: none;
    }
  }
  
  // 主内容区
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--app-bg-color);
    
    // 顶部导航栏
    .navbar {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background-color: var(--app-container-bg-color);
      border-bottom: 1px solid var(--app-border-color-light);
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      
      .left-area {
        display: flex;
        align-items: center;
        
        .menu-toggle {
          font-size: 20px;
          cursor: pointer;
          margin-right: 16px;
          color: var(--app-text-color);
        }
      }
      
      .right-menu {
        display: flex;
        align-items: center;
        
        .theme-switch {
          cursor: pointer;
          margin-right: 20px;
          font-size: 20px;
          color: var(--app-text-color);
        }
        
        .avatar-container {
          cursor: pointer;
          display: flex;
          align-items: center;
          
          .username {
            margin-left: 8px;
            font-size: 14px;
            color: var(--app-text-color);
          }
        }
      }
    }
    
    // 内容区
    .app-main {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  }
  
  // 侧边栏折叠状态
  &.sidebar-collapse {
    .sidebar-container {
      width: 64px;
    }
  }
}
</style> 
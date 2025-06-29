<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapse': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <img src="../assets/vue.svg" alt="Logo" class="logo" />
        <h1 v-if="!sidebarCollapsed" class="title">后台管理系统</h1>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="sidebarCollapsed"
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
            <component :is="sidebarCollapsed ? 'Expand' : 'Fold'" />
          </el-icon>
          <breadcrumb v-if="breadcrumbEnabled" />
        </div>
        
        <div class="right-menu">
          <!-- 设置按钮 -->
          <div class="settings-btn" @click="showSettings" title="全局设置">
            <el-icon><Setting /></el-icon>
          </div>
          
          <!-- 主题切换 -->
          <div class="theme-switch" @click="toggleTheme" title="切换主题">
            <el-icon v-if="isDark"><MoonNight /></el-icon>
            <el-icon v-else><Sunny /></el-icon>
          </div>
          
          <!-- 全屏按钮 -->
          <div class="fullscreen-btn" @click="toggleFullscreen" title="全屏">
            <el-icon v-if="fullscreen"><Aim /></el-icon>
            <el-icon v-else><Expand /></el-icon>
          </div>
          
          <!-- 用户下拉菜单 -->
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
      
      <!-- 标签栏 -->
      <tags-view />
      
      <!-- 内容区域 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition :name="pageTransition" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
    
    <!-- 全局设置抽屉 -->
    <app-settings v-model:visible="settingsDrawerVisible" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import SidebarItem from './components/SidebarItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import AppSettings from '@/components/AppSettings/index.vue'
import { 
  MoonNight, 
  Sunny, 
  Fold, 
  Expand, 
  Setting, 
  Aim 
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import TagsView from '@/components/TagsView/index.vue'

const router = useRouter()
const route = useRoute()

// 应用状态
const appStore = useAppStore()
const { 
  sidebarCollapsed,
  isDark,
  breadcrumbEnabled,
  pageTransition,
  fullscreen
} = storeToRefs(appStore)

// 用户状态
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 设置抽屉显示状态
const settingsDrawerVisible = ref(false)

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

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 切换全屏
const toggleFullscreen = () => {
  appStore.toggleFullscreen()
}

// 显示设置抽屉
const showSettings = () => {
  settingsDrawerVisible.value = true
}

// 初始化应用设置
onMounted(() => {
  appStore.initTheme()
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
    width: var(--app-sidebar-width);
    height: 100%;
    background-color: var(--app-menu-bg-color);
    transition: width 0.3s;
    z-index: 1001;
    overflow: hidden;
    
    .logo-container {
      height: var(--app-header-height);
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
    background-color: var(--el-bg-color-page);
    
    // 顶部导航栏
    .navbar {
      height: var(--app-header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background-color: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-light);
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      
      .left-area {
        display: flex;
        align-items: center;
        
        .menu-toggle {
          font-size: 20px;
          cursor: pointer;
          margin-right: 16px;
          color: var(--el-text-color-primary);
          transition: color 0.3s;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
      
      .right-menu {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .settings-btn,
        .theme-switch,
        .fullscreen-btn {
          cursor: pointer;
          font-size: 20px;
          color: var(--el-text-color-primary);
          transition: color 0.3s;
          padding: 8px;
          border-radius: var(--el-border-radius-base);
          
          &:hover {
            color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
          }
        }
        
        .avatar-container {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: var(--el-border-radius-base);
          transition: background-color 0.3s;
          
          &:hover {
            background-color: var(--el-color-primary-light-9);
          }
          
          .username {
            margin-left: 8px;
            font-size: var(--el-font-size-base);
            color: var(--el-text-color-primary);
          }
        }
      }
    }
    
    // 内容区
    .app-main {
      flex: 1;
      padding: var(--el-padding-large);
      overflow-y: auto;
    }
  }
  
  // 侧边栏折叠状态
  &.sidebar-collapse {
    .sidebar-container {
      width: var(--app-sidebar-collapsed-width);
    }
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
}

// 紧凑模式
.compact {
  .navbar {
    height: 40px;
  }
  
  .sidebar-container .logo-container {
    height: 40px;
  }
  
  .app-main {
    padding: var(--el-padding-base);
  }
}

// 暗色主题适配
:deep(.dark) {
  .app-wrapper {
    .main-container {
      .navbar {
        background-color: var(--el-bg-color);
        border-bottom-color: var(--el-border-color);
      }
    }
  }
}
</style> 
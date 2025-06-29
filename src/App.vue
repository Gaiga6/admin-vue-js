<template>
  <div id="app" :class="appClasses">
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useAppStore } from './stores/app'

// App.vue 作为应用根组件，现在仅包含路由视图
// 所有路由相关内容将通过router-view动态加载

// 应用状态
const appStore = useAppStore()

// 应用类名
const appClasses = computed(() => {
  const classes = []
  
  // 暗色主题
  if (appStore.isDark) {
    classes.push('dark')
  }
  
  // 紧凑模式
  if (appStore.compactMode) {
    classes.push('compact')
  }
  
  return classes
})

// 监听主题变化，应用到根元素
watch(() => appStore.isDark, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })

// 监听紧凑模式变化，应用到根元素
watch(() => appStore.compactMode, (isCompact) => {
  if (isCompact) {
    document.documentElement.classList.add('compact')
  } else {
    document.documentElement.classList.remove('compact')
  }
}, { immediate: true })

// 初始化应用设置
onMounted(() => {
  appStore.initTheme()
})
</script>

<style lang="scss">
// 确保根元素样式正确应用
#app {
  height: 100%;
  width: 100%;
}

// 全局主题类
.dark {
  color-scheme: dark;
}

.compact {
  // 紧凑模式的全局样式
}
</style>
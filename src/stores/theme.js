import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 从本地存储中获取主题模式或默认为浅色模式
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  
  // 切换主题模式
  function toggleDarkMode() {
    isDark.value = !isDark.value
    
    // 保存到本地存储
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    
    // 更新 HTML 标签的 class
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 更新 Element Plus 主题
    updateElementPlusTheme()
  }
  
  // 初始化主题
  function initTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    updateElementPlusTheme()
  }
  
  // 更新 Element Plus 主题
  function updateElementPlusTheme() {
    // 可以通过加载不同的 Element Plus 主题样式来实现
    // 或者通过切换 CSS 变量来实现
  }
  
  return { isDark, toggleDarkMode, initTheme }
}) 
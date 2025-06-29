import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import themeManager from '@/utils/theme'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)
  
  // 主题相关
  const isDark = ref(false)
  const primaryColor = ref('#409eff')
  const compactMode = ref(false)
  
  // 布局设置
  const breadcrumbEnabled = ref(true)
  const tagsViewEnabled = ref(true)
  
  // 水印设置
  const watermark = ref({
    enabled: false,
    text: 'iFarm Admin',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.1)',
    rotate: -15
  })
  
  // 页面设置
  const pageTransition = ref('fade')
  const fullscreen = ref(false)
  
  // 语言设置
  const language = ref('zh-CN')
  
  // 计算属性
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  const isBreadcrumbEnabled = computed(() => breadcrumbEnabled.value)
  const isTagsViewEnabled = computed(() => tagsViewEnabled.value)
  const isWatermarkEnabled = computed(() => watermark.value.enabled)
  const watermarkConfig = computed(() => watermark.value)
  const currentPageTransition = computed(() => pageTransition.value)
  const isFullscreen = computed(() => fullscreen.value)
  const currentLanguage = computed(() => language.value)
  const isCompactMode = computed(() => compactMode.value)
  const currentPrimaryColor = computed(() => primaryColor.value)
  const isDarkMode = computed(() => isDark.value)

  // 侧边栏切换
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }

  // 面包屑开关
  const toggleBreadcrumb = () => {
    breadcrumbEnabled.value = !breadcrumbEnabled.value
  }

  // 标签栏开关
  const toggleTagsView = () => {
    tagsViewEnabled.value = !tagsViewEnabled.value
  }

  // 主题切换
  const toggleTheme = () => {
    isDark.value = !isDark.value
    themeManager.setDarkTheme(isDark.value)
  }

  // 设置主题色
  const setPrimaryColor = (color) => {
    primaryColor.value = color
    themeManager.setPrimaryColor(color)
  }

  // 紧凑模式切换
  const toggleCompactMode = () => {
    compactMode.value = !compactMode.value
    themeManager.setCompactMode(compactMode.value)
  }

  // 水印设置
  const setWatermark = (config) => {
    watermark.value = { ...watermark.value, ...config }
  }

  // 页面切换动画
  const setPageTransition = (transition) => {
    pageTransition.value = transition
  }

  // 全屏切换
  const toggleFullscreen = () => {
    fullscreen.value = !fullscreen.value
    if (fullscreen.value) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 设置语言
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('language', lang)
    // 更新i18n语言
    if (window.$i18n) {
      window.$i18n.global.locale.value = lang
    }
  }

  // 重置设置
  const resetSettings = () => {
    sidebarCollapsed.value = false
    isDark.value = false
    primaryColor.value = '#409eff'
    compactMode.value = false
    breadcrumbEnabled.value = true
    tagsViewEnabled.value = true
    watermark.value = {
      enabled: false,
      text: 'iFarm Admin',
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.1)',
      rotate: -15
    }
    pageTransition.value = 'fade'
    fullscreen.value = false
    language.value = 'zh-CN'
    
    // 重置主题
    themeManager.resetTheme()
  }

  // 初始化主题
  const initTheme = () => {
    // 从localStorage恢复设置
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        sidebarCollapsed.value = settings.sidebarCollapsed || false
        isDark.value = settings.isDark || false
        primaryColor.value = settings.primaryColor || '#409eff'
        compactMode.value = settings.compactMode || false
        breadcrumbEnabled.value = settings.breadcrumbEnabled !== false
        tagsViewEnabled.value = settings.tagsViewEnabled !== false
        watermark.value = { ...watermark.value, ...settings.watermark }
        pageTransition.value = settings.pageTransition || 'fade'
        language.value = settings.language || 'zh-CN'
        
        // 应用主题设置
        themeManager.setDarkTheme(isDark.value)
        themeManager.setPrimaryColor(primaryColor.value)
        themeManager.setCompactMode(compactMode.value)
      } catch (error) {
        console.error('Failed to load app settings:', error)
      }
    }
  }

  // 保存设置
  const saveSettings = () => {
    const settings = {
      sidebarCollapsed: sidebarCollapsed.value,
      isDark: isDark.value,
      primaryColor: primaryColor.value,
      compactMode: compactMode.value,
      breadcrumbEnabled: breadcrumbEnabled.value,
      tagsViewEnabled: tagsViewEnabled.value,
      watermark: watermark.value,
      pageTransition: pageTransition.value,
      language: language.value
    }
    localStorage.setItem('app-settings', JSON.stringify(settings))
  }

  // 监听设置变化，自动保存
  watch(
    [
      sidebarCollapsed,
      isDark,
      primaryColor,
      compactMode,
      breadcrumbEnabled,
      tagsViewEnabled,
      watermark,
      pageTransition,
      language
    ],
    () => {
      saveSettings()
    },
    { deep: true }
  )

  return {
    // 状态
    sidebarCollapsed,
    isDark,
    primaryColor,
    compactMode,
    breadcrumbEnabled,
    tagsViewEnabled,
    watermark,
    pageTransition,
    fullscreen,
    language,
    
    // 计算属性
    isSidebarCollapsed,
    isBreadcrumbEnabled,
    isTagsViewEnabled,
    isWatermarkEnabled,
    watermarkConfig,
    currentPageTransition,
    isFullscreen,
    currentLanguage,
    isCompactMode,
    currentPrimaryColor,
    isDarkMode,
    
    // 方法
    toggleSidebar,
    setSidebarCollapsed,
    toggleBreadcrumb,
    toggleTagsView,
    toggleTheme,
    setPrimaryColor,
    toggleCompactMode,
    setWatermark,
    setPageTransition,
    toggleFullscreen,
    setLanguage,
    resetSettings,
    initTheme,
    saveSettings
  }
}) 
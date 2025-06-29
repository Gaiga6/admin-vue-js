// 主题管理器
class ThemeManager {
  constructor() {
    this.root = document.documentElement
    this.defaultColors = {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399'
    }
  }

  // 设置主题色
  setPrimaryColor(color) {
    // 生成不同亮度的主题色
    const colors = this.generateColorPalette(color)
    
    // 设置CSS变量
    Object.keys(colors).forEach(key => {
      this.root.style.setProperty(`--el-color-primary-${key}`, colors[key])
    })
    
    // 设置主色调
    this.root.style.setProperty('--el-color-primary', color)
    
    // 更新Element Plus组件的主题色
    this.updateElementPlusTheme(color)
  }

  // 生成颜色调色板
  generateColorPalette(color) {
    const colors = {}
    const lightCount = 9
    const darkCount = 2
    
    // 生成浅色系列
    for (let i = 1; i <= lightCount; i++) {
      colors[`light-${i}`] = this.lighten(color, i / lightCount)
    }
    
    // 生成深色系列
    for (let i = 1; i <= darkCount; i++) {
      colors[`dark-${i}`] = this.darken(color, i / darkCount)
    }
    
    return colors
  }

  // 变亮颜色
  lighten(color, amount) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.min(255, r + (255 - r) * amount)
    const newG = Math.min(255, g + (255 - g) * amount)
    const newB = Math.min(255, b + (255 - b) * amount)
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
  }

  // 变暗颜色
  darken(color, amount) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.max(0, r * (1 - amount))
    const newG = Math.max(0, g * (1 - amount))
    const newB = Math.max(0, b * (1 - amount))
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
  }

  // 更新Element Plus主题
  updateElementPlusTheme(color) {
    // 更新Element Plus的全局配置
    if (window.ELEMENT_PLUS_CONFIG) {
      window.ELEMENT_PLUS_CONFIG.locale = {
        ...window.ELEMENT_PLUS_CONFIG.locale,
        primaryColor: color
      }
    }
    
    // 强制重新渲染
    this.forceRerender()
  }

  // 强制重新渲染
  forceRerender() {
    // 触发全局事件，通知组件重新渲染
    window.dispatchEvent(new CustomEvent('theme-change'))
    
    // 延迟执行，确保DOM更新完成
    setTimeout(() => {
      // 重新计算样式
      document.body.style.display = 'none'
      document.body.offsetHeight // 触发重排
      document.body.style.display = ''
    }, 10)
  }

  // 设置暗色主题
  setDarkTheme(isDark) {
    if (isDark) {
      this.root.classList.add('dark')
      // 设置暗色主题的CSS变量
      this.root.style.setProperty('--el-bg-color', '#141414')
      this.root.style.setProperty('--el-bg-color-page', '#0a0a0a')
      this.root.style.setProperty('--el-bg-color-overlay', '#1d1e1f')
      this.root.style.setProperty('--el-text-color-primary', '#ffffff')
      this.root.style.setProperty('--el-text-color-regular', '#e5eaf3')
      this.root.style.setProperty('--el-text-color-secondary', '#a3a6ad')
      this.root.style.setProperty('--el-text-color-placeholder', '#8d9095')
      this.root.style.setProperty('--el-text-color-disabled', '#6c6e72')
      this.root.style.setProperty('--el-border-color', '#4c4d4f')
      this.root.style.setProperty('--el-border-color-light', '#414243')
      this.root.style.setProperty('--el-border-color-lighter', '#363637')
      this.root.style.setProperty('--el-border-color-extra-light', '#2b2b2c')
      this.root.style.setProperty('--el-border-color-dark', '#58585b')
      this.root.style.setProperty('--el-border-color-darker', '#636466')
      this.root.style.setProperty('--app-menu-bg-color', '#1f2d3d')
      this.root.style.setProperty('--app-menu-text-color', '#bfcbd9')
    } else {
      this.root.classList.remove('dark')
      // 恢复亮色主题的CSS变量
      this.root.style.setProperty('--el-bg-color', '#ffffff')
      this.root.style.setProperty('--el-bg-color-page', '#f2f3f5')
      this.root.style.setProperty('--el-bg-color-overlay', '#ffffff')
      this.root.style.setProperty('--el-text-color-primary', '#303133')
      this.root.style.setProperty('--el-text-color-regular', '#606266')
      this.root.style.setProperty('--el-text-color-secondary', '#909399')
      this.root.style.setProperty('--el-text-color-placeholder', '#a8abb2')
      this.root.style.setProperty('--el-text-color-disabled', '#c0c4cc')
      this.root.style.setProperty('--el-border-color', '#dcdfe6')
      this.root.style.setProperty('--el-border-color-light', '#e4e7ed')
      this.root.style.setProperty('--el-border-color-lighter', '#ebeef5')
      this.root.style.setProperty('--el-border-color-extra-light', '#f2f6fc')
      this.root.style.setProperty('--el-border-color-dark', '#d4d7de')
      this.root.style.setProperty('--el-border-color-darker', '#cdd0d6')
      this.root.style.setProperty('--app-menu-bg-color', '#304156')
      this.root.style.setProperty('--app-menu-text-color', '#bfcbd9')
    }
    
    // 强制重新渲染
    this.forceRerender()
  }

  // 设置紧凑模式
  setCompactMode(isCompact) {
    if (isCompact) {
      this.root.classList.add('compact')
      this.root.style.setProperty('--el-border-radius-base', '2px')
      this.root.style.setProperty('--el-border-radius-small', '1px')
      this.root.style.setProperty('--el-font-size-base', '12px')
      this.root.style.setProperty('--el-font-size-small', '11px')
      this.root.style.setProperty('--el-font-size-extra-small', '10px')
      this.root.style.setProperty('--el-padding-base', '6px')
      this.root.style.setProperty('--el-padding-small', '4px')
      this.root.style.setProperty('--el-padding-large', '8px')
    } else {
      this.root.classList.remove('compact')
      this.root.style.setProperty('--el-border-radius-base', '4px')
      this.root.style.setProperty('--el-border-radius-small', '2px')
      this.root.style.setProperty('--el-font-size-base', '14px')
      this.root.style.setProperty('--el-font-size-small', '13px')
      this.root.style.setProperty('--el-font-size-extra-small', '12px')
      this.root.style.setProperty('--el-padding-base', '12px')
      this.root.style.setProperty('--el-padding-small', '8px')
      this.root.style.setProperty('--el-padding-large', '16px')
    }
    
    // 强制重新渲染
    this.forceRerender()
  }

  // 重置主题
  resetTheme() {
    this.setPrimaryColor(this.defaultColors.primary)
    this.setDarkTheme(false)
    this.setCompactMode(false)
  }

  // 获取当前主题配置
  getThemeConfig() {
    return {
      primaryColor: this.root.style.getPropertyValue('--el-color-primary') || this.defaultColors.primary,
      isDark: this.root.classList.contains('dark'),
      isCompact: this.root.classList.contains('compact')
    }
  }
}

// 创建全局主题管理器实例
const themeManager = new ThemeManager()

export default themeManager 
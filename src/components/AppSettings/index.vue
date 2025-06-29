<template>
  <el-drawer
    v-model="drawerVisible"
    :title="t('settings.title')"
    direction="rtl"
    size="400px"
    :before-close="handleClose"
  >
    <div class="settings-container">
      <!-- 主题设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <span class="section-icon">🎨</span>
          {{ t('settings.theme') }}
        </h3>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.themeMode') }}</span>
          <el-switch
            v-model="isDark"
            :active-text="t('settings.dark')"
            :inactive-text="t('settings.light')"
            @change="handleThemeChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.primaryColor') }}</span>
          <el-color-picker
            v-model="primaryColor"
            @change="handlePrimaryColorChange"
            show-alpha
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.compactMode') }}</span>
          <el-switch
            v-model="compactMode"
            @change="handleCompactModeChange"
          />
        </div>
      </div>

      <!-- 布局设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <span class="section-icon">📐</span>
          {{ t('settings.layout') }}
        </h3>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.sidebarCollapse') }}</span>
          <el-switch
            v-model="sidebarCollapsed"
            @change="handleSidebarChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.breadcrumb') }}</span>
          <el-switch
            v-model="breadcrumbEnabled"
            @change="handleBreadcrumbChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.tagsView') }}</span>
          <el-switch
            v-model="tagsViewEnabled"
            @change="handleTagsViewChange"
          />
        </div>
      </div>

      <!-- 水印设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <span class="section-icon">💧</span>
          {{ t('settings.watermark') }}
        </h3>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.watermarkEnabled') }}</span>
          <el-switch
            v-model="watermark.enabled"
            @change="handleWatermarkChange"
          />
        </div>
        <div v-if="watermark.enabled" class="watermark-settings">
          <div class="setting-item">
            <span class="setting-label">{{ t('settings.watermarkText') }}</span>
            <el-input
              v-model="watermark.text"
              :placeholder="t('settings.watermarkText')"
              @change="handleWatermarkChange"
            />
          </div>
          <div class="setting-item">
            <span class="setting-label">{{ t('settings.watermarkFontSize') }}</span>
            <el-slider
              v-model="watermark.fontSize"
              :min="12"
              :max="24"
              :step="1"
              @change="handleWatermarkChange"
            />
          </div>
          <div class="setting-item">
            <span class="setting-label">{{ t('settings.watermarkColor') }}</span>
            <el-color-picker
              v-model="watermark.color"
              @change="handleWatermarkChange"
              show-alpha
            />
          </div>
          <div class="setting-item">
            <span class="setting-label">{{ t('settings.watermarkRotate') }}</span>
            <el-slider
              v-model="watermark.rotate"
              :min="-45"
              :max="45"
              :step="5"
              @change="handleWatermarkChange"
            />
          </div>
        </div>
      </div>

      <!-- 页面设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <span class="section-icon">🖥️</span>
          {{ t('settings.page') }}
        </h3>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.pageTransition') }}</span>
          <el-select
            v-model="pageTransition"
            @change="handlePageTransitionChange"
          >
            <el-option :label="t('settings.fade')" value="fade" />
            <el-option :label="t('settings.slide')" value="slide" />
            <el-option :label="t('settings.zoom')" value="zoom" />
            <el-option :label="t('settings.none')" value="none" />
          </el-select>
        </div>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.fullscreen') }}</span>
          <el-button
            :icon="fullscreen ? 'Aim' : 'Expand'"
            @click="handleFullscreenChange"
          >
            {{ fullscreen ? t('settings.exitFullscreen') : t('settings.enterFullscreen') }}
          </el-button>
        </div>
      </div>

      <!-- 语言设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <span class="section-icon">🌐</span>
          {{ t('settings.language') }}
        </h3>
        <div class="setting-item">
          <span class="setting-label">{{ t('settings.languageName') }}</span>
          <el-select
            v-model="language"
            @change="handleLanguageChange"
          >
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="settings-actions">
        <el-button type="primary" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          {{ t('settings.resetSettings') }}
        </el-button>
        <el-button @click="handleClose">
          <el-icon><Close /></el-icon>
          {{ t('common.close') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Refresh,
  Close,
  Aim,
  Expand
} from '@element-plus/icons-vue'
import themeManager from '@/utils/theme'
import { useI18n } from 'vue-i18n'

// 国际化
const { t } = useI18n()

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emits
const emit = defineEmits(['update:visible'])

const appStore = useAppStore()

// 计算属性
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isDark = computed({
  get: () => appStore.isDark,
  set: (value) => {
    appStore.toggleTheme()
  }
})

const sidebarCollapsed = computed({
  get: () => appStore.sidebarCollapsed,
  set: (value) => appStore.setSidebarCollapsed(value)
})

const breadcrumbEnabled = computed({
  get: () => appStore.breadcrumbEnabled,
  set: (value) => appStore.toggleBreadcrumb()
})

const tagsViewEnabled = computed({
  get: () => appStore.tagsViewEnabled,
  set: (value) => appStore.toggleTagsView()
})

const pageTransition = computed({
  get: () => appStore.pageTransition,
  set: (value) => appStore.setPageTransition(value)
})

const primaryColor = computed({
  get: () => appStore.primaryColor,
  set: (value) => appStore.setPrimaryColor(value)
})

const compactMode = computed({
  get: () => appStore.compactMode,
  set: (value) => appStore.toggleCompactMode()
})

const language = computed({
  get: () => appStore.language,
  set: (value) => appStore.setLanguage(value)
})

const watermark = computed(() => appStore.watermark)
const fullscreen = computed(() => appStore.fullscreen)

// 事件处理
const handleThemeChange = () => {
  appStore.toggleTheme()
}

const handleSidebarChange = () => {
  appStore.setSidebarCollapsed(!appStore.sidebarCollapsed)
}

const handleBreadcrumbChange = () => {
  appStore.toggleBreadcrumb()
}

const handleTagsViewChange = () => {
  appStore.toggleTagsView()
}

const handlePageTransitionChange = (transition) => {
  appStore.setPageTransition(transition)
}

const handlePrimaryColorChange = (color) => {
  appStore.setPrimaryColor(color)
}

const handleCompactModeChange = () => {
  appStore.toggleCompactMode()
}

const handleLanguageChange = (lang) => {
  appStore.setLanguage(lang)
  // 重新加载页面以应用语言变化
  window.location.reload()
}

const handleWatermarkChange = () => {
  appStore.setWatermark(watermark.value)
}

const handleFullscreenChange = () => {
  appStore.toggleFullscreen()
}

const handleReset = () => {
  ElMessageBox.confirm(
    t('settings.resetConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    appStore.resetSettings()
    ElMessage.success(t('common.success'))
  }).catch(() => {
    // 用户取消
  })
}

const handleClose = () => {
  drawerVisible.value = false
  // 设置会自动保存，不需要手动调用
}

// 监听主题变化，实时预览
watch(isDark, (newValue) => {
  themeManager.setDarkTheme(newValue)
})

watch(primaryColor, (newValue) => {
  themeManager.setPrimaryColor(newValue)
})

watch(compactMode, (newValue) => {
  themeManager.setCompactMode(newValue)
})
</script>

<style lang="scss" scoped>
.settings-container {
  padding: var(--el-padding-large);
  
  .settings-section {
    margin-bottom: 30px;
    
    .section-title {
      display: flex;
      align-items: center;
      margin: 0 0 15px 0;
      font-size: var(--el-font-size-medium);
      font-weight: 600;
      color: var(--el-text-color-primary);
      
      .section-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      padding: 10px 0;
      
      .setting-label {
        font-size: var(--el-font-size-base);
        color: var(--el-text-color-regular);
      }
      
      .el-input,
      .el-select {
        width: 140px;
      }
      
      .el-slider {
        width: 140px;
      }
      
      .el-color-picker {
        .el-color-picker__trigger {
          width: 40px;
          height: 32px;
        }
      }
    }
    
    .watermark-settings {
      margin-left: 20px;
      padding-left: 15px;
      border-left: 2px solid var(--el-border-color-light);
    }
  }
  
  .settings-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}

// 暗色主题适配
:deep(.dark) {
  .settings-container {
    .settings-section {
      .section-title {
        color: var(--el-text-color-primary);
      }
      
      .setting-item {
        .setting-label {
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}

// 紧凑模式适配
:deep(.compact) {
  .settings-container {
    padding: var(--el-padding-base);
    
    .settings-section {
      margin-bottom: 20px;
      
      .section-title {
        font-size: var(--el-font-size-base);
        margin-bottom: 10px;
      }
      
      .setting-item {
        margin-bottom: 10px;
        padding: 6px 0;
        
        .setting-label {
          font-size: var(--el-font-size-small);
        }
        
        .el-input,
        .el-select {
          width: 120px;
        }
        
        .el-slider {
          width: 120px;
        }
      }
    }
    
    .settings-actions {
      margin-top: 20px;
      padding-top: 15px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .settings-container {
    .settings-section {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        
        .setting-label {
          margin-bottom: 8px;
        }
        
        .el-input,
        .el-select,
        .el-slider {
          width: 100%;
        }
      }
    }
    
    .settings-actions {
      flex-direction: column;
      gap: 10px;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style> 
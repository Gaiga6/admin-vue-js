import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // Element Plus暗黑模式
import './styles/index.scss' // 全局样式

import App from './App.vue'
import router from './router'
import './router/permission' // 引入权限控制
import pinia from './stores'
import { permission, role } from './directives/permission' // 引入权限指令
import i18n from './locales'

// 创建应用实例
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局挂载i18n实例
window.$i18n = i18n

// 根据当前语言设置Element Plus的语言
const currentLocale = i18n.global.locale.value
const elementLocale = currentLocale === 'zh-CN' ? zhCn : en

// 全局注册Element Plus，设置中文
app.use(ElementPlus, {
  locale: elementLocale,
  size: 'default'
})

// 注册自定义指令
app.directive('permission', permission)
app.directive('role', role)

// 使用路由和状态管理
app.use(router)
app.use(pinia)
app.use(i18n)

// 设置全局变量
window.router = router

// 挂载应用
app.mount('#app')

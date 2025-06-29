import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 全局CSS变量
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      // 开发环境代理配置
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // 环境变量默认值
  define: {
    'import.meta.env.VITE_APP_TITLE': JSON.stringify('后台管理系统'),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('/api')
  }
})

<template>
  <div class="not-found-container">
    <div class="content">
      <h1>404</h1>
      <h2>抱歉，您访问的页面不存在</h2>
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--app-bg-color);
  
  .content {
    text-align: center;
    
    h1 {
      font-size: 120px;
      color: var(--el-color-primary);
      margin: 0;
    }
    
    h2 {
      font-size: 24px;
      color: var(--app-text-color);
      margin: 20px 0 30px;
    }
  }
}
</style> 
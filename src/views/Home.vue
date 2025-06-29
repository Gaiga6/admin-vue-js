<template>
  <div class="home-container">
    <h1>iFarm Admin 后台管理系统</h1>
    <p>基于Vue 3 + Element Plus的后台管理系统基础框架</p>
    <el-button type="primary" @click="goToDashboard">进入系统</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #409EFF;
}

p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #606266;
}
</style> 
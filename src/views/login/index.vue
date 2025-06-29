<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
        <div class="theme-switch" @click="toggleDarkMode">
          <el-icon v-if="isDark"><MoonNight /></el-icon>
          <el-icon v-else><Sunny /></el-icon>
        </div>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            type="text"
            tabindex="1"
            auto-complete="on"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            :type="passwordVisible ? 'text' : 'password'"
            tabindex="2"
            auto-complete="off"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <a class="forget-link">忘记密码?</a>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          @click.prevent="handleLogin"
          class="login-button"
        >登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { User, Lock, MoonNight, Sunny } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

// 表单引用
const loginFormRef = ref(null)
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  remember: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 切换主题
const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

// 登录状态
const loading = ref(false)
const passwordVisible = ref(false)

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    const result = await userStore.login(loginForm)
    
    if (result) {
      ElMessage.success('登录成功')
      router.push({ path: '/' })
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error('登录失败，请检查表单填写')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--app-bg-color);
  overflow: hidden;
  
  .login-card {
    width: 400px;
    padding: 30px 35px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: var(--app-container-bg-color);
    
    .title-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      
      .title {
        margin: 0;
        font-size: 24px;
        color: var(--app-text-color);
      }
      
      .theme-switch {
        cursor: pointer;
        font-size: 20px;
        color: var(--app-text-color);
      }
    }
    
    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .forget-link {
        font-size: 14px;
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
    
    .login-button {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style> 
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000 // 请求超时时间 10s
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = localStorage.getItem('token')
    
    // 如果有token则附带在请求头中
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 假设约定的接口返回格式是 { code: 200, data: {}, message: '' }
    // 根据实际项目接口约定修改
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      
      // 处理特定错误码
      if (res.code === 401) {
        // token过期或未登录
        ElMessageBox.confirm('您的登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token')
          router.push('/login')
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res.data
    }
  },
  error => {
    console.error('响应错误:', error)
    
    // 处理HTTP状态码错误
    let message = '系统异常，请稍后重试'
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // 清除token并跳转登录页
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = '网络异常，请稍后重试'
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时，请稍后重试'
    }
    
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    
    return Promise.reject(error)
  }
)

export default service 
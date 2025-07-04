<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
          class="no-redirect"
        >
          {{ $t(item.meta?.title || 'common.noTitle') }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ $t(item.meta?.title || 'common.noTitle') }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])

// 获取面包屑
const getBreadcrumb = () => {
  // 存放面包屑
  const matched = route.matched.filter(
    (item) => item.meta && item.meta.title && !item.meta.hidden
  )
  
  // 如果是首页就直接返回
  if (matched[0] && matched[0].name !== 'Dashboard') {
    matched.unshift({
      path: '/admin/dashboard',
      meta: { title: '仪表盘' },
      redirect: undefined
    })
  }
  
  return matched
}

// 监听路由变化生成面包屑
watch(
  () => route.path,
  (path) => {
    breadcrumbs.value = getBreadcrumb()
  },
  { immediate: true }
)

// 处理面包屑点击
const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: var(--el-font-size-base);
  line-height: var(--app-header-height);
  
  .no-redirect {
    color: var(--el-text-color-secondary);
    cursor: text;
  }
  
  a {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}

/* 面包屑动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style> 
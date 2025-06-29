<template>
  <div v-if="tagsViewEnabled" class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <el-icon v-if="tag && tag.meta?.icon" class="tag-icon">
          <component :is="tag.meta.icon" />
        </el-icon>
        <span class="tag-title">{{ tag?.title || 'unknown' }}</span>
        <el-icon 
          v-if="!isAffix(tag)" 
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>
    
    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 标签栏显示状态
const tagsViewEnabled = computed(() => appStore.tagsViewEnabled)

// 已访问的视图
const visitedViews = ref([])

// 右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref(null)

// 判断是否为固定标签
const isAffix = (tag) => {
  return tag && tag.meta && tag.meta.affix
}

// 判断是否为当前激活标签
const isActive = (tag) => {
  return tag && tag.path === route.path
}

// 添加标签
const addTags = () => {
  const { name } = route
  if (name) {
    const view = {
      path: route.path,
      name: route.name,
      title: route.meta?.title || 'unknown',
      meta: route.meta,
      query: route.query,
      fullPath: route.fullPath
    }
    addView(view)
  }
}

// 添加视图
const addView = (view) => {
  if (visitedViews.value.some(v => v.path === view.path)) return
  if (view.meta && view.meta.title) {
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  }
}

// 关闭选中标签
const closeSelectedTag = (view) => {
  if (!view) return
  const index = visitedViews.value.findIndex(v => v.path === view.path)
  if (index > -1) {
    visitedViews.value.splice(index, 1)
    if (isActive(view)) {
      toLastView(visitedViews.value, view)
    }
  }
}

// 关闭其他标签
const closeOthersTags = () => {
  const currentTag = visitedViews.value.find(tag => tag.path === route.path)
  visitedViews.value = visitedViews.value.filter(tag => {
    return tag && tag.meta && tag.meta.affix || (currentTag && tag.path === currentTag.path)
  })
}

// 关闭所有标签
const closeAllTags = (view) => {
  const affixTags = visitedViews.value.filter(tag => tag && tag.meta && tag.meta.affix)
  visitedViews.value = affixTags
  if (affixTags.length > 0) {
    toLastView(visitedViews.value, view)
  }
}

// 跳转到最后一个标签
const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (view && view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

// 刷新选中标签
const refreshSelectedTag = (view) => {
  if (!view) return
  router.replace({
    path: '/redirect' + view.fullPath
  })
}

// 打开右键菜单
const openMenu = (tag, e) => {
  const menuMinWidth = 105
  const offsetLeft = e.clientX
  const offsetWidth = document.querySelector('.tags-view-container').offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const left = offsetLeft > maxLeft ? maxLeft : offsetLeft
  top.value = e.clientY
  left.value = left
  visible.value = true
  selectedTag.value = tag
}

// 关闭右键菜单
const closeMenu = () => {
  visible.value = false
}

// 监听路由变化
watch(route, () => {
  addTags()
})

// 监听点击事件，关闭右键菜单
const handleClick = () => {
  closeMenu()
}

onMounted(() => {
  addTags()
  document.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick)
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--app-tags-view-height);
  width: 100%;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--el-border-color-light);
      color: var(--el-text-color-primary);
      background: var(--el-bg-color);
      padding: 0 8px;
      font-size: var(--el-font-size-extra-small);
      margin-left: 5px;
      margin-top: 4px;
      text-decoration: none;
      border-radius: var(--el-border-radius-small);
      transition: all 0.3s;
      
      &:first-of-type {
        margin-left: 15px;
      }
      
      &:last-of-type {
        margin-right: 15px;
      }
      
      &.active {
        background-color: var(--el-color-primary);
        color: #fff;
        border-color: var(--el-color-primary);
        
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
      }
      
      .tag-icon {
        margin-right: 4px;
        font-size: var(--el-font-size-extra-small);
      }
      
      .tag-title {
        margin-right: 4px;
      }
      
      .close-icon {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s;
        transform-origin: center;
        
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }
        
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
      
      &:hover {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-7);
      }
    }
  }
  
  .contextmenu {
    margin: 0;
    background: var(--el-bg-color);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: var(--el-border-radius-base);
    font-size: var(--el-font-size-extra-small);
    font-weight: 400;
    color: var(--el-text-color-primary);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      
      &:hover {
        background: var(--el-border-color-extra-light);
      }
    }
  }
}

// 紧凑模式
.compact .tags-view-container {
  height: 28px;
  
  .tags-view-wrapper .tags-view-item {
    height: 22px;
    line-height: 22px;
    font-size: 11px;
    margin-top: 3px;
    
    .tag-icon {
      font-size: 11px;
    }
    
    .close-icon {
      width: 14px;
      height: 14px;
    }
  }
}

// 暗色主题
.dark .tags-view-container {
  background: var(--el-bg-color);
  border-bottom-color: var(--el-border-color);
  
  .tags-view-wrapper .tags-view-item {
    background: var(--el-bg-color-page);
    border-color: var(--el-border-color);
    color: var(--el-text-color-regular);
    
    &:hover {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-7);
    }
    
    .close-icon:hover {
      background-color: var(--el-color-primary);
    }
  }
  
  .contextmenu {
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color);
    
    li:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
</style> 
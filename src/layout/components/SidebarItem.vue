<template>
  <div v-if="!item.meta?.hidden">
    <!-- 只有一个可显示子路由或没有子路由的情况 -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <el-icon v-if="onlyOneChild.meta && onlyOneChild.meta.icon">
            <component :is="onlyOneChild.meta.icon"></component>
          </el-icon>
          <template #title>{{ onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </template>
    
    <!-- 有多个子路由的情况 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isExternal } from '@/utils/validate'
import AppLink from './AppLink.vue'
import path from 'path-browserify'

const props = defineProps({
  // 路由对象
  item: {
    type: Object,
    required: true
  },
  // 是否是嵌套的菜单
  isNest: {
    type: Boolean,
    default: false
  },
  // 基础路径
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref(null)

/**
 * 判断是否只有一个显示的子路由
 */
const hasOneShowingChild = (children = [], parent) => {
  if (!children) {
    children = []
  }
  
  const showingChildren = children.filter(item => {
    if (item.meta?.hidden) {
      return false
    } else {
      // 递归设置 onlyOneChild
      onlyOneChild.value = item
      return true
    }
  })
  
  // 当只有一个子路由时，默认显示该子路由
  if (showingChildren.length === 1) {
    return true
  }
  
  // 当没有子路由时，使用父路由作为显示
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  
  return false
}

/**
 * 解析路径
 */
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}
</script> 
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

// 根据是否是外部链接决定使用 a 标签还是 router-link
const type = computed(() => {
  return isExternal(props.to) ? 'a' : 'router-link'
})

// 动态设置属性
const linkProps = (to) => {
  if (isExternal(to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: to
  }
}
</script> 
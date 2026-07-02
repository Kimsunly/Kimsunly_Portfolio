<script setup lang="ts">
import type { HeadingLevel } from '@/types/ui'

withDefaults(defineProps<{
  level?: HeadingLevel
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  as?: string
}>(), {
  level: 'h2',
  tag: 'div',
})

const levelClasses: Record<HeadingLevel, string> = {
  'display-hero': 'text-display-hero font-bold',
  'display': 'text-display font-bold',
  'h1': 'text-h1 font-bold',
  'h2': 'text-h2 font-semibold',
  'h3': 'text-h3 font-semibold',
  'h4': 'text-h4 font-medium',
}
</script>

<template>
  <component
    :is="as || tag"
    :class="['text-text-primary', levelClasses[level]]"
  >
    <slot />
  </component>
</template>

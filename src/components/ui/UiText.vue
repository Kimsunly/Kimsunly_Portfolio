<script setup lang="ts">
import type { TextSize } from '@/types/ui'

withDefaults(defineProps<{
  size?: TextSize
  muted?: boolean
  tag?: string
}>(), {
  size: 'body',
  muted: false,
  tag: 'p',
})

const sizeClasses: Record<TextSize, string> = {
  'body-lg': 'text-body-lg',
  'body': 'text-body',
  'small': 'text-small',
  'caption': 'text-caption',
}
</script>

<template>
  <component
    :is="tag"
    :class="[sizeClasses[size], muted ? 'text-text-muted' : 'text-text-secondary']"
  >
    <slot />
  </component>
</template>

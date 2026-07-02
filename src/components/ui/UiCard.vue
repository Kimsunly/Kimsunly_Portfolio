<script setup lang="ts">
withDefaults(defineProps<{
  hover?: boolean
  padded?: boolean
  borderAccent?: boolean
  tag?: string
}>(), {
  hover: false,
  padded: true,
  borderAccent: false,
  tag: 'div',
})

const baseClasses = 'border border-border rounded-card bg-surface transition-all duration-150'

const hoverClasses = 'hover:border-primary/30 cursor-pointer'

const paddedClasses = 'p-24'

const accentClasses = 'border-l-2 border-l-primary'
</script>

<template>
  <component
    :is="tag"
    :class="[
      baseClasses,
      hover ? hoverClasses : '',
      padded ? paddedClasses : '',
      borderAccent ? accentClasses : '',
    ]"
  >
    <slot />
  </component>
</template>

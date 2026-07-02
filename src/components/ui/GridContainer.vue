<script setup lang="ts">
withDefaults(defineProps<{
  columns?: 4 | 8 | 12
  gap?: number
  tag?: string
}>(), {
  columns: 12,
  tag: 'div',
})

const columnClasses: Record<number, string> = {
  4: 'grid-cols-4',
  8: 'grid-cols-8',
  12: 'grid-cols-12',
}

const gapClasses: Record<number, string> = {
  4: 'gap-4',
  8: 'gap-8',
  16: 'gap-16',
  20: 'gap-5',
  24: 'gap-24',
  32: 'gap-8',
  40: 'gap-10',
  48: 'gap-12',
}
</script>

<template>
  <component
    :is="tag"
    :class="[
      'grid',
      columnClasses[columns],
      gapClasses[gap] || 'gap-8',
    ]"
  >
    <slot />
  </component>
</template>

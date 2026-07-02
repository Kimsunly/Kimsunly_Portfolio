<script setup lang="ts">
withDefaults(defineProps<{
  tag?: string
  id?: string
  spaced?: boolean
  narrow?: boolean
  grid?: boolean
}>(), {
  tag: 'section',
  spaced: true,
  narrow: false,
  grid: false,
})

const sectionSpacing = 'py-40 md:py-30 sm:py-24'
const containerWidth = 'mx-auto px-8'
</script>

<template>
  <component
    :is="tag"
    :id="id"
    :class="[spaced ? sectionSpacing : '']"
  >
    <div
      :class="[
        containerWidth,
        narrow ? 'max-w-medium' : 'max-w-maximum',
        grid ? '' : '',
      ]"
    >
      <slot />
    </div>
  </component>
</template>

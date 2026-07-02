<script setup lang="ts">
withDefaults(defineProps<{
  learning?: boolean
}>(), {
  learning: false,
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center h-24 px-16 text-tech-label uppercase tracking-[0.12em] font-medium border rounded-badge transition-all duration-150',
      learning
        ? 'border-primary/30 text-primary bg-primary/5'
        : 'border-border text-text-muted hover:border-text-muted hover:text-text-secondary',
    ]"
  >
    <slot />
    <span
      v-if="learning"
      class="ml-2 text-[10px] uppercase tracking-[0.12em] text-primary/60"
    >
      Learning
    </span>
  </span>
</template>

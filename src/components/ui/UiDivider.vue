<script setup lang="ts">
withDefaults(defineProps<{
  muted?: boolean
  label?: string
}>(), {
  muted: false,
})
</script>

<template>
  <div class="flex items-center gap-4" role="separator" aria-orientation="horizontal">
    <div
      :class="[
        'h-px flex-1',
        muted ? 'bg-border/50' : 'bg-border',
      ]"
    />
    <span
      v-if="label"
      class="font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted shrink-0"
    >
      {{ label }}
    </span>
    <div
      v-if="label"
      :class="[
        'h-px flex-1',
        muted ? 'bg-border/50' : 'bg-border',
      ]"
    />
  </div>
</template>

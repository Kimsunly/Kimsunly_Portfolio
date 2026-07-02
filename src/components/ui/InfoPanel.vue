<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  bordered?: boolean
  accent?: boolean
}>(), {
  bordered: true,
  accent: false,
})
</script>

<template>
  <div
    :class="[
      'rounded-panel p-24 bg-surface',
      bordered ? 'border border-border' : '',
      accent ? 'border-primary/20' : '',
    ]"
    role="region"
    :aria-label="label"
  >
    <span
      v-if="label"
      class="block font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted mb-4"
    >
      {{ label }}
    </span>
    <div class="space-y-3">
      <slot />
    </div>
  </div>
</template>

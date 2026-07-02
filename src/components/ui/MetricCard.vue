<script setup lang="ts">
withDefaults(defineProps<{
  value: string
  label: string
  accent?: boolean
}>(), {
  accent: false,
})
</script>

<template>
  <div
    :class="[
      'border rounded-card p-24',
      accent ? 'border-primary/20 bg-primary/5' : 'border-border bg-surface',
    ]"
  >
    <span class="block text-h2 font-bold text-text-primary">{{ value }}</span>
    <span class="block text-small text-text-muted mt-1">{{ label }}</span>
  </div>
</template>

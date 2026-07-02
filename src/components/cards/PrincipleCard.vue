<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  index?: number
}>(), {
  index: 0,
})
</script>

<template>
  <div
    class="group relative border border-border rounded-card p-24 bg-surface transition-all duration-150 hover:border-primary h-full"
  >
    <div class="flex items-start gap-4">
      <span class="font-mono text-tech-label uppercase tracking-[0.12em] text-primary/60 mt-0.5 shrink-0">
        /{{ String(index + 1).padStart(2, '0') }}
      </span>
      <div>
        <h3 class="text-h4 font-semibold text-text-primary">
          {{ title }}
        </h3>
        <p class="text-body text-text-muted mt-3 leading-[160%]">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

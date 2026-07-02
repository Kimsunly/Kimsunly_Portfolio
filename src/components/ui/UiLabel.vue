<script setup lang="ts">
import type { LabelVariant } from '@/types/ui'

withDefaults(defineProps<{
  variant?: LabelVariant
}>(), {
  variant: 'section',
})

const variantClasses: Record<LabelVariant, string> = {
  section: 'font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted',
  tech: 'font-mono text-tech-label uppercase tracking-[0.08em] text-text-muted',
  status: 'font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary',
  uppercase: 'text-small uppercase tracking-[0.08em] font-medium text-text-muted',
}
</script>

<template>
  <span :class="[variantClasses[variant]]">
    <slot />
  </span>
</template>

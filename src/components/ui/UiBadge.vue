<script setup lang="ts">
import type { BadgeVariant } from '@/types/ui'

withDefaults(defineProps<{
  variant?: BadgeVariant
}>(), {
  variant: 'default',
})

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-border text-text-muted',
  success: 'border-success/30 text-success',
  warning: 'border-warning/30 text-warning',
  error: 'border-error/30 text-error',
  info: 'border-info/30 text-info',
  learning: 'border-primary/30 text-primary',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center h-24 px-16 text-tech-label uppercase tracking-[0.12em] font-medium border rounded-badge',
      variantClasses[variant],
    ]"
  >
    <slot />
  </span>
</template>

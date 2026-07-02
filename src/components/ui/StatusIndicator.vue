<script setup lang="ts">
withDefaults(defineProps<{
  status?: 'online' | 'available' | 'busy' | 'away' | 'offline'
  label?: string
  pulse?: boolean
}>(), {
  status: 'online',
  pulse: true,
})

const statusColors: Record<string, string> = {
  online: 'bg-success',
  available: 'bg-success',
  busy: 'bg-warning',
  away: 'bg-warning',
  offline: 'bg-text-muted',
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <span
      :class="[
        'relative inline-flex h-2 w-2 rounded-full',
        statusColors[status],
        pulse ? 'before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-40 before:bg-current' : '',
      ]"
      aria-hidden="true"
    />
    <span
      v-if="label"
      class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary"
    >
      {{ label }}
    </span>
  </div>
</template>

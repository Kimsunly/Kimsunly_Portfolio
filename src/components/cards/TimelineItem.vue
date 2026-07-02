<script setup lang="ts">
withDefaults(defineProps<{
  year: string
  title: string
  description: string
  active?: boolean
  future?: boolean
  scrolled?: boolean
}>(), {
  active: false,
  future: false,
  scrolled: false,
})
</script>

<template>
  <div class="relative flex gap-6 pb-12 last:pb-0">
    <div class="flex flex-col items-center shrink-0">
      <div
        :class="[
          'w-4 h-4 rounded-full border-2 transition-all duration-150',
          future
            ? 'border-border bg-surface'
            : (active || scrolled)
              ? 'border-primary bg-primary'
              : 'border-border bg-surface',
        ]"
        aria-hidden="true"
      />
      <div
        v-if="!future"
        class="w-[2px] flex-1 bg-border mt-2"
        aria-hidden="true"
      />
    </div>

    <div class="pb-8 flex-1 min-w-0">
      <span
        :class="[
          'font-mono text-tech-label uppercase tracking-[0.12em]',
          future ? 'text-text-muted' : 'text-primary/60',
        ]"
      >
        {{ year }}
      </span>
      <h4
        :class="[
          'text-body font-semibold mt-1',
          future ? 'text-text-muted' : 'text-text-primary',
        ]"
      >
        {{ title }}
      </h4>
      <p class="text-small text-text-muted mt-2 leading-[160%]">
        {{ description }}
      </p>
    </div>
  </div>
</template>

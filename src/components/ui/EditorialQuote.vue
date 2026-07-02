<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  position?: 'left' | 'right' | 'center'
}>(), {
  position: 'center',
})

const positionClasses: Record<string, string> = {
  left: 'text-left pl-4 border-l-2 border-primary/30',
  center: 'text-center',
  right: 'text-right pr-4 border-r-2 border-primary/30',
}
</script>

<template>
  <blockquote
    :class="[
      'font-mono text-body text-text-muted italic max-w-[480px] py-4 my-8',
      positionClasses[position],
    ]"
  >
    &ldquo;{{ text }}&rdquo;
  </blockquote>
</template>

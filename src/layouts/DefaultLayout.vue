<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMouse } from '@vueuse/core'
import AppNavigation from '@/components/navigation/AppNavigation.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CursorTrail from '@/components/ui/CursorTrail.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { reducedMotion } = useReducedMotion()
const { x, y } = useMouse()
const gridRef = ref<HTMLElement | null>(null)

const windowWidth = computed(() => window.innerWidth)
const windowHeight = computed(() => window.innerHeight)
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col relative">
    <div
      ref="gridRef"
      class="fixed inset-0 pointer-events-none z-background bg-grid"
      :style="!reducedMotion ? {
        transform: `translate(${(x - windowWidth / 2) * 0.01}px, ${(y - windowHeight / 2) * 0.01}px)`,
      } : {}"
      aria-hidden="true"
    />
    <CursorTrail />
    <AppNavigation />
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-overlay focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-button focus:text-small focus:font-medium">
      Skip to content
    </a>
    <main id="main-content" class="flex-1 pt-[72px]" role="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

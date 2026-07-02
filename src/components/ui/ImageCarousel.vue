<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  images: string[]
  alt?: string
  aspect?: string
}>(), {
  alt: 'Presentation photo',
  aspect: 'aspect-[16/9]',
})

const current = ref(0)
const total = computed(() => props.images.length)

function prev() { current.value = current.value > 0 ? current.value - 1 : total.value - 1 }
function next() { current.value = current.value < total.value - 1 ? current.value + 1 : 0 }
function go(i: number) { current.value = i }
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-panel border border-border bg-surface select-none" role="region" :aria-label="t('carousel.regionLabel')">
    <div
      class="flex transition-transform duration-400 ease-smooth"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <img
        v-for="(src, i) in images"
        :key="i"
        :src="src"
        :alt="`${alt} ${i + 1}`"
        class="w-full shrink-0 object-cover"
        :class="aspect"
        loading="lazy"
        draggable="false"
      />
    </div>

    <button
      v-if="total > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border text-text-secondary hover:text-text-primary hover:bg-background/80 transition-all duration-150"
      @click="prev"
      :aria-label="t('carousel.prev')"
    >
      <ChevronLeft :size="18" />
    </button>

    <button
      v-if="total > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border text-text-secondary hover:text-text-primary hover:bg-background/80 transition-all duration-150"
      @click="next"
      :aria-label="t('carousel.next')"
    >
      <ChevronRight :size="18" />
    </button>

    <div v-if="total > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <button
        v-for="i in total"
        :key="i"
        class="w-2 h-2 rounded-full transition-all duration-150"
        :class="current === i - 1 ? 'bg-primary w-5' : 'bg-border hover:bg-border-strong'"
        @click="go(i - 1)"
        :aria-label="t('carousel.goto', { i })"
      />
    </div>
  </div>
</template>

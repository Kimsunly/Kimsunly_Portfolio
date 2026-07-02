<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()

const { reducedMotion } = useReducedMotion()

const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const images = [
  '/presentation/1.1.jpg',
  '/presentation/1.2.jpg',
  '/presentation/2.1.jpg',
  '/presentation/2.2.jpg',
  '/presentation/3.jpg',
  '/presentation/4.jpg',
  '/presentation/5.jpg',
  '/presentation/6.jpg',
  '/presentation/7.jpg',
  '/presentation/8.jpg',
  '/presentation/9.jpg',
]

onMounted(() => {
  if (!sectionRef.value) return

  if (reducedMotion.value) {
    visible.value = true
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 },
  )

  observer.observe(sectionRef.value)
})
</script>

<template>
  <SectionContainer id="presentations" :spaced="true" narrow>
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('presentations.label') }}
      </UiLabel>

      <UiHeading
        level="h2"
        :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '100ms' : '0ms' }"
      >
        {{ t('presentations.heading') }}
      </UiHeading>

      <p
        :class="['mt-4 text-body-lg text-text-secondary leading-[160%] max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '200ms' : '0ms' }"
      >
        {{ t('presentations.description') }}
      </p>

      <div
        :class="['mt-8', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '300ms' : '0ms' }"
      >
        <ImageCarousel :images="images" :alt="t('presentations.alt')" />
      </div>
    </div>
  </SectionContainer>
</template>

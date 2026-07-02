<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import TimelineItem from '@/components/cards/TimelineItem.vue'
import TimelineParticles from '@/components/ui/TimelineParticles.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const scrollProgress = ref(0)

const milestones = [
  {
    year: '2024',
    title: 'Started Information Technology',
    description: 'at Royal University of Phnom Penh.',
  },
  {
    year: '2025',
    title: 'Completed Full Stack Web Development training',
    description: 'while building real-world software projects.',
  },
  {
    year: '2025',
    title: 'Led the development of VETIKA',
    description: 'a student community platform.',
  },
  {
    year: '2025-2026',
    title: 'Developed Smakjit',
    description: 'for university capstone.',
  },
  {
    year: '2026',
    title: 'Led backend development for ANTPAY',
    description: 'building over 25 REST APIs and deploying to Linux.',
    active: true,
  },
  {
    year: 'Future',
    title: 'Growing into a Backend Engineer',
    description: 'specializing in scalable systems, cloud infrastructure, and distributed architectures.',
    future: true,
  },
]

function updateProgress() {
  if (!timelineRef.value || reducedMotion.value) return
  const rect = timelineRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const total = rect.height + windowHeight
  const passed = windowHeight - rect.top
  scrollProgress.value = Math.min(1, Math.max(0, passed / total))
}

onMounted(() => {
  if (!sectionRef.value) return

  if (reducedMotion.value) {
    visible.value = true
    scrollProgress.value = 1
    return
  }

  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        sectionObserver.disconnect()
      }
    },
    { threshold: 0.2 },
  )
  sectionObserver.observe(sectionRef.value)

  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <SectionContainer id="journey" :spaced="true">
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('journey.label') }}
      </UiLabel>

      <UiHeading level="h2" :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
        {{ t('journey.heading') }}
      </UiHeading>

      <p :class="['text-body text-text-muted mt-4 max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
        {{ t('journey.description') }}
      </p>

      <EditorialQuote :text="t('journey.quote')" position="left" />

      <div ref="timelineRef" class="mt-12 max-w-[640px] relative">
        <div
          class="absolute left-[7px] top-0 bottom-0 w-[4px] bg-border/60 rounded-full"
          aria-hidden="true"
        />
        <div
          class="absolute left-[7px] top-0 bottom-0 w-[4px] bg-primary rounded-full origin-top transition-transform duration-150 ease-smooth"
          :style="{ transform: `scaleY(${scrollProgress})` }"
          aria-hidden="true"
        />
        <TimelineParticles :progress="scrollProgress" />

        <div
          v-for="(milestone, index) in milestones"
          :key="index"
          :class="[visible ? 'animate-reveal' : 'opacity-0']"
          :style="{ transitionDelay: visible ? `${400 + index * 100}ms` : '0ms' }"
        >
          <TimelineItem
            :year="milestone.year"
            :title="milestone.title"
            :description="milestone.description"
            :active="milestone.active || false"
            :future="milestone.future || false"
            :scrolled="scrollProgress > (index + 0.5) / milestones.length"
          />
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

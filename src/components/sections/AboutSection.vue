<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import TimelineParticles from '@/components/ui/TimelineParticles.vue'
import { BookOpen, Award, MapPin } from '@lucide/vue'

const { t } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const scrollProgress = ref(0)

const education = [
  {
    school: 'Royal University of Phnom Penh (RUPP)',
    url: 'https://www.rupp.edu.kh/',
    location: 'Phnom Penh, Cambodia',
    period: 'Feb 2024 — Present',
    degree: 'Bachelor of Information Technology and Engineering (ITE)',
    gpa: '3.8 / 4.0',
    details: [
      'Data Structures & Algorithms',
      'Database Design',
      'Advanced Programming Language',
      'Object-Oriented Analysis & Design',
      'Web Technologies & Cloud Computing',
      'Operating Systems',
      'Network Engineering',
      'Mobile Application Development',
    ],
  },
  {
    school: 'Ant Technology Training Center',
    url: 'https://www.facebook.com/anttrainning',
    location: 'Phnom Penh, Cambodia',
    period: 'Jun 2025 — Jul 2026',
    degree: 'Full-Stack Web Development Program',
    details: [
      'Web Development Fundamentals',
      'HTML/CSS & Bootstrap',
      'UI/UX Design',
      'C++ & OOP',
      'JavaScript & Vue.js',
      'MySQL, Node.js & Express & RESTful APIs',
      'Foundation of Cybersecurity',
    ],
  },
  {
    school: 'Paññāsāstra University of Cambodia — Institute of Foreign Languages',
    url: 'http://www.puc.edu.kh/',
    location: 'Phnom Penh, Cambodia',
    period: 'Sep 2024',
    degree: 'English Language Program — Grade 12 Graduate',
    details: [
      'Graduated with High Honors (Grade A all levels) in GESL (General English as a Second Language)',
    ],
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
  <SectionContainer id="about" :spaced="true">
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('about.label') }}
      </UiLabel>

      <UiHeading
        level="h2"
        :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '100ms' : '0ms' }"
      >
        {{ t('about.heading') }}
      </UiHeading>

      <div ref="timelineRef" class="relative mt-16" aria-label="Education timeline">
        <TimelineParticles :progress="scrollProgress" />
        <div
          class="absolute left-4 md:left-1/2 top-0 bottom-0 w-[4px] bg-border/60 md:-translate-x-1/2 rounded-full"
          aria-hidden="true"
        />
        <div
          class="absolute left-4 md:left-1/2 top-0 bottom-0 w-[4px] bg-primary md:-translate-x-1/2 origin-top rounded-full transition-transform duration-150 ease-smooth"
          :style="{ transform: `scaleY(${scrollProgress})` }"
          aria-hidden="true"
        />

        <div
          v-for="(item, i) in education"
          :key="i"
          class="flex items-start gap-6 pb-16 last:pb-0 relative"
          :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
        >
          <div
            class="flex-1 min-w-0 md:text-left"
            :class="i % 2 === 0 ? 'md:pr-32' : 'md:pl-32'"
          >
            <div
              class="border border-border rounded-panel p-24 bg-surface transition-all duration-500"
              :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            >
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-mono text-tech-label uppercase tracking-[0.12em] text-primary/60">
                  {{ item.period }}
                </span>
                <div v-if="item.gpa" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/5 border border-success/20 rounded-badge text-[11px] font-mono text-success font-semibold">
                  <Award :size="12" class="text-success" />
                  {{ t('about.gpa') }} {{ item.gpa }}
                </div>
              </div>
              <h3 class="text-h5 font-semibold mt-2 leading-[130%]">
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-text-primary hover:text-primary hover:underline transition-all duration-150"
                >
                  {{ item.school }}
                </a>
              </h3>
              <p class="text-small text-text-muted mt-1 flex items-center gap-1.5">
                <MapPin :size="12" class="text-text-muted/65 shrink-0" />
                {{ item.location }}
              </p>
              <p class="text-body text-text-secondary mt-3 font-medium flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                {{ item.degree }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="(detail, j) in item.details"
                  :key="j"
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-elevated/45 border border-border text-caption font-mono text-text-secondary rounded-badge hover:border-primary/45 transition-colors"
                >
                  <Award v-if="detail.includes('Honors')" :size="12" class="text-warning shrink-0" />
                  <BookOpen v-else :size="12" class="text-primary/60 shrink-0" />
                  <span>{{ detail }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="hidden md:flex flex-col items-center shrink-0 relative z-10">
            <div
              class="w-4 h-4 rounded-full border-2 transition-all duration-300"
              :class="scrollProgress > (i + 0.5) / education.length ? 'border-primary bg-primary' : 'border-border bg-surface'"
              aria-hidden="true"
            />
          </div>

          <div class="hidden md:block flex-1 min-w-0" />
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

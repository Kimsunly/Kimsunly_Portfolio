<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import { ExternalLink, Calendar, ChevronLeft, ChevronRight, Maximize2, X } from '@lucide/vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface CertificateEntry {
  title: string
  issuer: string
  date: string
  credentialId: string
  url: string
  image: string
  skills: string[]
}

const { t, tm } = useI18n()
const { reducedMotion } = useReducedMotion()

const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const entries = tm('certificates.entries') as CertificateEntry[]

// Cloned entries for seamless infinite sliding
const clonedEntries = computed(() => {
  if (entries.length === 0) return []
  const prefix = entries.slice(-3)
  const suffix = entries.slice(0, 3)
  return [...prefix, ...entries, ...suffix]
})

const currentIndex = ref(0)
const visibleCards = ref(3)
const disableTransition = ref(false)
let autoplayInterval: number | null = null

// Lightbox state for fullscreen image viewing
const lightboxActive = ref(false)
const lightboxImage = ref('')
const lightboxTitle = ref('')

const trackStyle = computed(() => {
  let pct = 100
  let px = 24
  if (visibleCards.value === 2) {
    pct = 50
    px = 12
  } else if (visibleCards.value === 3) {
    pct = 33.3333
    px = 8
  }
  const trackIndex = currentIndex.value + 3
  const totalPct = trackIndex * pct
  const totalPx = trackIndex * px
  return {
    transform: `translateX(calc(-${totalPct}% - ${totalPx}px))`
  }
})

function updateVisibleCards() {
  if (window.innerWidth < 768) {
    visibleCards.value = 1
  } else if (window.innerWidth < 1024) {
    visibleCards.value = 2
  } else {
    visibleCards.value = 3
  }
  if (currentIndex.value > entries.length - 1) {
    currentIndex.value = entries.length - 1
  }
}

function handleTransitionEnd() {
  if (currentIndex.value >= entries.length) {
    disableTransition.value = true
    currentIndex.value = 0
    const trackEl = sectionRef.value?.querySelector('.sliding-track') as HTMLElement
    if (trackEl) {
      const _ = trackEl.offsetHeight
    }
    setTimeout(() => {
      disableTransition.value = false
    }, 50)
  } else if (currentIndex.value <= -1) {
    disableTransition.value = true
    currentIndex.value = entries.length - 1
    const trackEl = sectionRef.value?.querySelector('.sliding-track') as HTMLElement
    if (trackEl) {
      const _ = trackEl.offsetHeight
    }
    setTimeout(() => {
      disableTransition.value = false
    }, 50)
  }
}

function startAutoplay() {
  stopAutoplay()
  if (reducedMotion.value || lightboxActive.value) return
  autoplayInterval = window.setInterval(() => {
    currentIndex.value++
  }, 4000)
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

function nextSlide() {
  if (disableTransition.value) return
  stopAutoplay()
  currentIndex.value++
  startAutoplay()
}

function prevSlide() {
  if (disableTransition.value) return
  stopAutoplay()
  currentIndex.value--
  startAutoplay()
}

function setSlide(idx: number) {
  if (disableTransition.value) return
  stopAutoplay()
  currentIndex.value = idx
  startAutoplay()
}

function openLightbox(img: string, title: string) {
  stopAutoplay()
  lightboxImage.value = img
  lightboxTitle.value = title
  lightboxActive.value = true
}

function closeLightbox() {
  lightboxActive.value = false
  startAutoplay()
}

onMounted(() => {
  updateVisibleCards()
  window.addEventListener('resize', updateVisibleCards)
  startAutoplay()

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
    { threshold: 0.1 },
  )

  observer.observe(sectionRef.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCards)
  stopAutoplay()
})
</script>

<template>
  <SectionContainer id="certificates" :spaced="true">
    <div ref="sectionRef">
      <!-- Section Headers -->
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('certificates.label') }}
      </UiLabel>

      <UiHeading
        level="h2"
        :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '100ms' : '0ms' }"
      >
        {{ t('certificates.heading') }}
      </UiHeading>

      <p
        :class="['mt-4 text-body-lg text-text-secondary leading-[160%] max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '200ms' : '0ms' }"
      >
        {{ t('certificates.description') }}
      </p>

      <!-- Certificates Slider Viewport -->
      <div 
        class="relative mt-12 w-full select-none"
        :class="[visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
        :style="{ transitionDelay: visible ? '300ms' : '0ms', transitionProperty: 'opacity, transform', transitionDuration: '500ms' }"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
      >
        <!-- Viewport Window -->
        <div class="overflow-hidden w-full px-1 py-4">
          <!-- Sliding Track -->
          <div 
            class="flex gap-6 sliding-track"
            :class="[disableTransition ? 'transition-none' : 'transition-transform duration-500 ease-out']"
            :style="trackStyle"
            @transitionend="handleTransitionEnd"
          >
            <div
              v-for="(entry, index) in clonedEntries"
              :key="index"
              class="group relative flex flex-col border border-border bg-surface rounded-card p-4 hover:border-primary/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/5 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
            >
              <!-- Interactive Image Container -->
              <div 
                class="relative overflow-hidden rounded bg-black/20 aspect-[1.414/1] border border-border/50 group-hover:border-primary/20 transition-all duration-300 cursor-pointer"
                @click="openLightbox(entry.image, entry.title)"
              >
                <img 
                  :src="entry.image" 
                  :alt="entry.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                
                <!-- Hover Details Overlay -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                  <span class="inline-flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 self-start uppercase">
                    <Calendar :size="10" />
                    {{ entry.date }}
                  </span>
                  
                  <div class="flex items-center gap-1 text-[11px] font-mono text-white/95 self-end bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                    <Maximize2 :size="10" />
                    {{ t('certificates.zoom') }}
                  </div>
                </div>
              </div>

              <!-- Certificate Text details underneath -->
              <div class="mt-4 flex-1 flex flex-col">
                <h3 class="text-small font-semibold text-text-primary group-hover:text-primary transition-colors duration-150 line-clamp-1 leading-[140%]">
                  {{ entry.title }}
                </h3>
                <p class="text-caption text-text-secondary mt-1 font-mono">
                  {{ entry.issuer }}
                </p>
                <p class="text-[11px] text-text-muted mt-0.5 font-mono">
                  ID: {{ entry.credentialId }}
                </p>
              </div>

              <!-- Action Bar -->
              <div class="flex gap-2 mt-4 pt-4 border-t border-border/40">
                <a
                  :href="entry.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-border bg-surface-elevated hover:bg-primary hover:border-primary hover:text-white rounded text-[11px] font-mono text-text-secondary transition-all duration-150"
                  @click.stop
                >
                  {{ t('certificates.verify') }}
                  <ExternalLink :size="11" />
                </a>
                <button
                  @click="openLightbox(entry.image, entry.title)"
                  class="flex items-center justify-center gap-1.5 py-2 px-3 border border-border bg-surface-elevated hover:border-primary/50 hover:bg-primary/5 rounded text-[11px] font-mono text-text-secondary hover:text-text-primary transition-all duration-150"
                >
                  <Maximize2 :size="11" />
                  {{ t('certificates.zoom') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="prevSlide"
          class="absolute left-2 sm:left-[-16px] lg:left-[-24px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
          aria-label="Previous certificates"
        >
          <ChevronLeft :size="18" />
        </button>
        <button
          @click="nextSlide"
          class="absolute right-2 sm:right-[-16px] lg:right-[-24px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
          aria-label="Next certificates"
        >
          <ChevronRight :size="18" />
        </button>

        <!-- Navigation Dots Indicator -->
        <div class="flex items-center justify-center gap-2 mt-4">
          <button
            v-for="idx in entries.length"
            :key="idx"
            @click="setSlide(idx - 1)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-150"
            :class="currentIndex === idx - 1 ? 'bg-primary w-5' : 'bg-border hover:bg-text-secondary'"
            :aria-label="`Go to certificate slide ${idx}`"
          />
        </div>
      </div>
    </div>

    <!-- Fullscreen Lightbox Modal -->
    <Teleport to="body">
      <div 
        v-if="lightboxActive"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300"
        @click="closeLightbox"
      >
        <!-- Close Button -->
        <button
          class="absolute top-6 right-6 text-white/75 hover:text-white hover:scale-105 active:scale-95 transition-all duration-150 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 cursor-pointer"
          @click="closeLightbox"
        >
          <X :size="24" />
        </button>

        <!-- Image Frame -->
        <div 
          class="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          @click.stop
        >
          <img 
            :src="lightboxImage" 
            :alt="lightboxTitle" 
            class="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
          />
          <h4 class="text-white text-body-lg font-semibold mt-4 text-center px-4">
            {{ lightboxTitle }}
          </h4>
        </div>
      </div>
    </Teleport>
  </SectionContainer>
</template>

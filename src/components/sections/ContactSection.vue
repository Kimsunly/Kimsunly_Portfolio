<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import UiButton from '@/components/ui/UiButton.vue'
import InfoPanel from '@/components/ui/InfoPanel.vue'
import { Mail, Globe, Send } from '@lucide/vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t, tm } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)

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
  <SectionContainer id="contact" :spaced="true">
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('contact.label') }}
      </UiLabel>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-4">
        <div :class="[visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
          <UiHeading level="h2" class="mt-4">
            {{ t('contact.heading') }}
          </UiHeading>

          <p class="text-body text-text-muted mt-6 leading-[160%] max-w-[480px]">
            {{ t('contact.description') }}
          </p>

          <p class="text-body text-text-muted mt-4 leading-[160%] max-w-[480px]">
            {{ t('contact.followUp') }}
          </p>

          <EditorialQuote :text="t('contact.quote')" position="left" />

          <div class="flex flex-col sm:flex-row items-start gap-4 mt-10">
            <UiButton variant="primary" arrow href="mailto:lykimsun@example.com">
              {{ t('contact.getInTouch') }}
            </UiButton>
            <UiButton variant="secondary" arrow href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf">
              {{ t('contact.downloadResume') }}
            </UiButton>
          </div>

          <div class="flex items-center gap-6 mt-16 flex-wrap">
            <a
              href="https://github.com/Kimsunly"
              class="flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide" width="16" height="16" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kimsunly/"
              class="flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <Globe :size="16" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href="https://t.me/Kimsun_Ly"
              class="flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <Send :size="16" aria-hidden="true" />
              Telegram
            </a>
            <a
              href="mailto:kimsunly49@gmail.com"
              class="flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              aria-label="Send email"
            >
              <Mail :size="16" aria-hidden="true" />
              Email
            </a>
          </div>
        </div>

        <div :class="[visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
          <InfoPanel :label="t('contact.availabilityLabel')" accent>
            <div class="flex items-center gap-3 mb-4">
              <span class="relative inline-flex h-3 w-3 rounded-full bg-success before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-40 before:bg-success" aria-hidden="true" />
              <span class="text-body font-medium text-success">{{ t('contact.available') }}</span>
            </div>
            <div class="space-y-2">
              <p class="text-small text-text-muted">
                <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('contact.responseTime') }} </span>
                {{ t('contact.responseValue') }}
              </p>
              <p class="text-small text-text-muted">
                <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('contact.preferredContact') }} </span>
                {{ t('contact.preferredValue') }}
              </p>
              <p class="text-small text-text-muted">
                <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('contact.openTo') }} </span>
                {{ t('contact.openValue') }}
              </p>
            </div>
          </InfoPanel>

          <div class="border border-border rounded-panel p-24 bg-surface mt-24">
            <span class="font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted block mb-4">
              {{ t('contact.valuesLabel') }}
            </span>
            <ul class="space-y-2">
              <li
                v-for="value in tm('contact.values')"
                :key="value"
                class="text-small text-text-secondary flex items-start gap-2"
              >
                <span class="text-primary/60 mt-0.5">-</span>
                {{ value }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

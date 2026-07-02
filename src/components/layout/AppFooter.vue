<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { GitBranch, Globe, Mail } from '@lucide/vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
const { reducedMotion } = useReducedMotion()
const currentYear = new Date().getFullYear()
const blinkVisible = ref(true)

const navLinks = [
  { label: t('nav.projects'), href: '#projects' },
  { label: t('nav.console'), href: '#console' },
  { label: t('nav.technology'), href: '#technology' },
  { label: t('nav.journey'), href: '#journey' },
  { label: t('nav.certificates'), href: '#certificates' },
  { label: t('nav.contact'), href: '#contact' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Kimsunly', icon: GitBranch },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kimsunly/', icon: Globe },
  { label: 'Email', href: 'mailto:kimsunly49@gmail.com', icon: Mail },
]

onMounted(() => {
  if (reducedMotion.value) return
  setInterval(() => {
    blinkVisible.value = !blinkVisible.value
  }, 7000)
})
</script>

<template>
  <footer class="border-t border-border" role="contentinfo">
    <div class="mx-auto max-w-maximum px-24 sm:px-16 md:px-32 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="md:col-span-2">
          <a
            href="#"
            class="font-mono text-body font-medium text-text-primary hover:text-primary transition-colors duration-150"
            aria-label="Home"
          >
            {{ t('footer.logo') }}
          </a>
          <p class="mt-4 text-h4 font-bold text-text-primary">
            {{ t('footer.tagline') }}
          </p>
          <p class="mt-4 text-small text-text-muted max-w-md">
            {{ t('footer.attribution') }}
            {{ t('footer.techStack') }}
          </p>
        </div>

        <div>
          <span class="block font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted mb-4">
            {{ t('footer.navHeading') }}
          </span>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.href">
              <a
                :href="link.href"
                class="text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              >
                {{ link.label }}
              </a>
            </li>
            <li>
              <a
                href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf"
                class="text-small text-text-muted hover:text-text-primary transition-colors duration-150"
              >
                {{ t('nav.resume') }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <span class="block font-mono text-tech-label uppercase tracking-[0.12em] text-text-muted mb-4">
            {{ t('footer.connectHeading') }}
          </span>
          <ul class="space-y-3">
            <li v-for="link in socialLinks" :key="link.label">
              <a
                :href="link.href"
                class="inline-flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors duration-150"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                <component :is="link.icon" :size="16" aria-hidden="true" />
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="relative inline-flex items-center gap-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-success transition-opacity duration-500" :class="blinkVisible ? 'opacity-100' : 'opacity-30'" aria-hidden="true" />
            <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-success">{{ t('footer.systemOnline') }}</span>
          </span>
          <span class="text-tech-label text-text-muted tracking-[0.08em] hidden sm:inline">
            {{ t('footer.connectionSecure') }}
          </span>
          <span class="text-tech-label text-text-muted tracking-[0.08em] hidden sm:inline">
            {{ t('footer.version') }}
          </span>
        </div>
        <p class="text-caption text-text-muted">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

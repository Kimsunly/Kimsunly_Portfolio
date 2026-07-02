<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowScroll, useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { Menu, X, Sun, Moon } from '@lucide/vue'
import UiButton from '@/components/ui/UiButton.vue'
import { colorMode } from '@/composables/useColorMode'
import { locale, toggleLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 50)
const mobileOpen = ref(false)
const visibleSection = ref('')

const links = computed(() => [
  { label: t('nav.projects'), href: '#projects', id: 'projects' },
  { label: t('nav.console'), href: '#console', id: 'console' },
  { label: t('nav.technology'), href: '#technology', id: 'technology' },
  { label: t('nav.journey'), href: '#journey', id: 'journey' },
  { label: t('nav.certificates'), href: '#certificates', id: 'certificates' },
  { label: t('nav.contact'), href: '#contact', id: 'contact' },
])

onMounted(() => {
  for (const link of links.value) {
    const el = document.getElementById(link.id)
    if (!el) continue
    useIntersectionObserver(
      el,
      ([entry]) => {
        if (entry.isIntersecting) {
          visibleSection.value = link.id
        }
      },
      { threshold: 0.3 },
    )
  }
})

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-navigation transition-all duration-standard ease-smooth',
      isScrolled
        ? 'bg-background/90 backdrop-blur-md border-b border-border'
        : 'bg-transparent',
    ]"
    role="banner"
  >
    <nav
      class="flex items-center justify-between h-[72px] mx-auto px-8 max-w-maximum"
      role="navigation"
      aria-label="Main navigation"
    >
      <a
        href="#"
        class="font-mono text-body font-medium text-text-primary hover:text-primary transition-all duration-150 hover:scale-[1.04]"
        aria-label="Home"
      >
        LK_
      </a>

      <div class="hidden md:flex items-center gap-24">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :class="[
            'relative text-small transition-colors duration-150 after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:bg-primary after:transition-all after:duration-150 hover:after:w-full',
            visibleSection === link.id ? 'text-primary after:w-full' : 'text-text-muted hover:text-text-primary',
          ]"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="hidden md:flex items-center gap-8">
        <button
          class="w-32 h-32 flex items-center justify-center rounded-button border border-border text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150"
          @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
          :aria-label="t('nav.switchTheme', { mode: colorMode === 'dark' ? 'light' : 'dark' })"
        >
          <Sun v-if="colorMode === 'dark'" :size="14" aria-hidden="true" />
          <Moon v-else :size="14" aria-hidden="true" />
        </button>
        <button
          class="w-32 h-32 flex items-center justify-center rounded-button border border-border text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150 font-mono text-caption font-medium"
          @click="toggleLocale"
          :aria-label="t('nav.switchLocale', { locale: locale === 'en' ? 'Khmer' : 'English' })"
        >
          {{ locale === 'en' ? 'EN' : 'KH' }}
        </button>
        <UiButton variant="secondary" size="sm" href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf">
          {{ t('nav.resume') }}
        </UiButton>
        <div class="flex items-center gap-2">
          <span class="relative inline-flex h-2 w-2 rounded-full bg-success before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-40 before:bg-success" aria-hidden="true" />
          <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-success">{{ t('nav.online') }}</span>
        </div>
      </div>

      <button
        class="md:hidden flex items-center justify-center w-10 h-10 text-text-secondary hover:text-text-primary transition-colors duration-150"
        @click="toggleMobile"
        :aria-label="mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')"
        :aria-expanded="mobileOpen"
      >
        <Menu v-if="!mobileOpen" :size="20" aria-hidden="true" />
        <X v-else :size="20" aria-hidden="true" />
      </button>
    </nav>

    <div
      v-if="mobileOpen"
      class="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-md z-dropdown"
      @click="closeMobile"
    >
      <div
        class="flex flex-col gap-6 p-8"
        role="dialog"
        :aria-label="t('nav.mobileNav')"
        @click.stop
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-h4 font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
          @click="closeMobile"
        >
          {{ link.label }}
        </a>
        <div class="mt-4 pt-4 border-t border-border space-y-4">
          <div class="flex items-center gap-3">
            <button
              class="w-10 h-10 flex items-center justify-center rounded-button border border-border text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150"
              @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
              :aria-label="t('nav.switchTheme', { mode: colorMode === 'dark' ? 'light' : 'dark' })"
            >
              <Sun v-if="colorMode === 'dark'" :size="16" aria-hidden="true" />
              <Moon v-else :size="16" aria-hidden="true" />
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-button border border-border text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150 font-mono text-small font-medium"
              @click="toggleLocale"
              :aria-label="t('nav.switchLocale', { locale: locale === 'en' ? 'Khmer' : 'English' })"
            >
              {{ locale === 'en' ? 'EN' : 'KH' }}
            </button>
          </div>
          <UiButton variant="secondary" href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf">
            {{ t('nav.resume') }}
          </UiButton>
        </div>
      </div>
    </div>
  </header>
</template>

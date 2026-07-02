<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
  { label: t('nav.technology'), href: '#technology', id: 'technology' },
  { label: t('nav.projects'), href: '#projects', id: 'projects' },
  { label: t('nav.console'), href: '#console', id: 'console' },
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

watch(mobileOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('overflow-hidden')
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
      class="flex items-center justify-between h-[72px] mx-auto px-24 sm:px-32 md:px-48 lg:px-64 max-w-maximum"
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
        :aria-label="t('nav.openMenu')"
        :aria-expanded="mobileOpen"
      >
        <Menu :size="20" aria-hidden="true" />
      </button>
    </nav>

    <!-- Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-dropdown"
        @click="closeMobile"
      />
    </Transition>

    <!-- Offcanvas Drawer -->
    <Transition name="slide">
      <div
        v-if="mobileOpen"
        class="md:hidden fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-surface border-l border-border/80 shadow-2xl z-modal p-24 flex flex-col justify-between"
        role="dialog"
        :aria-label="t('nav.mobileNav')"
        @click.stop
      >
        <div>
          <!-- Drawer Header with close button -->
          <div class="flex items-center justify-between pb-16 border-b border-border/60">
            <div class="flex items-center gap-2">
              <span class="font-mono text-body font-semibold text-text-primary">LK_</span>
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <button
              class="flex items-center justify-center w-8 h-8 rounded-button border border-border/60 text-text-secondary hover:text-text-primary hover:border-primary/40 hover:rotate-90 transition-all duration-300"
              @click="closeMobile"
              :aria-label="t('nav.closeMenu')"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Links List -->
          <div class="flex flex-col gap-3 py-24">
            <a
              v-for="(link, index) in links"
              :key="link.href"
              :href="link.href"
              :class="[
                'flex items-center justify-between text-body font-medium transition-all duration-150 py-2.5 px-3.5 rounded-button hover:bg-surface-elevated',
                visibleSection === link.id ? 'text-primary bg-primary-soft/40 border-l-2 border-primary pl-2.5' : 'text-text-secondary hover:text-text-primary'
              ]"
              @click="closeMobile"
            >
              <div class="flex items-center gap-3">
                <span class="font-mono text-caption text-primary/60">/0{{ index + 1 }}</span>
                <span>{{ link.label }}</span>
              </div>
              <span v-if="visibleSection === link.id" class="text-primary font-mono text-caption">●</span>
            </a>
          </div>
        </div>

        <!-- Footer Utilities (Theme, Locale, Resume, Online Status) -->
        <div class="pt-24 border-t border-border space-y-6">
          <!-- Status Banner -->
          <div class="flex items-center justify-between py-2 px-3 rounded-button bg-surface border border-border/40">
            <span class="font-mono text-[10px] text-text-muted">SYSTEM STATUS</span>
            <div class="flex items-center gap-2">
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-40 before:bg-success" aria-hidden="true" />
              <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-success">{{ t('nav.online') }}</span>
            </div>
          </div>

          <!-- Theme & Language Toggles -->
          <div class="grid grid-cols-2 gap-4">
            <button
              class="h-11 flex items-center justify-center gap-2 rounded-button border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all duration-150"
              @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
              :aria-label="t('nav.switchTheme', { mode: colorMode === 'dark' ? 'light' : 'dark' })"
            >
              <Sun v-if="colorMode === 'dark'" :size="14" aria-hidden="true" />
              <Moon v-else :size="14" aria-hidden="true" />
              <span class="font-mono text-caption uppercase">{{ colorMode === 'dark' ? 'LIGHT' : 'DARK' }}</span>
            </button>
            
            <button
              class="h-11 flex items-center justify-center gap-2 rounded-button border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all duration-150 font-mono text-caption font-medium"
              @click="toggleLocale"
              :aria-label="t('nav.switchLocale', { locale: locale === 'en' ? 'Khmer' : 'English' })"
            >
              <span>{{ locale === 'en' ? 'EN' : 'KH' }}</span>
              <span class="text-text-muted text-[10px]">[{{ locale === 'en' ? 'EN' : 'KH' }}]</span>
            </button>
          </div>

          <UiButton variant="secondary" class="w-full justify-center py-2.5" href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf">
            {{ t('nav.resume') }}
          </UiButton>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Fade Transition for Backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transition for Offcanvas Drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

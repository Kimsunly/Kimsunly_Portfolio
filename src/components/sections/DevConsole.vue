<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Activity, Send, Database, Terminal, Search, Key, Shield } from '@lucide/vue'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import SysMonitor from '@/components/dashboard/SysMonitor.vue'
import ApiPlayground from '@/components/dashboard/ApiPlayground.vue'
import SqlExplorer from '@/components/dashboard/SqlExplorer.vue'
import TerminalWidget from '@/components/dashboard/TerminalWidget.vue'
import SeoPreview from '@/components/dashboard/SeoPreview.vue'
import JwtDecoder from '@/components/dashboard/JwtDecoder.vue'
import PentestLab from '@/components/dashboard/PentestLab.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const activeTab = ref<'monitor' | 'playground' | 'sql' | 'terminal' | 'seo' | 'jwt' | 'pentest'>('monitor')

const tabs = [
  { id: 'monitor',   label: 'devConsole.tabs.monitor',   icon: Activity },
  { id: 'playground',label: 'devConsole.tabs.playground', icon: Send     },
  { id: 'sql',       label: 'devConsole.tabs.sql',        icon: Database  },
  { id: 'terminal',  label: 'devConsole.tabs.terminal',   icon: Terminal  },
  { id: 'seo',       label: 'devConsole.tabs.seo',        icon: Search    },
  { id: 'jwt',       label: 'devConsole.tabs.jwt',        icon: Key       },
  { id: 'pentest',   label: 'devConsole.tabs.pentest',    icon: Shield    },
] as const

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
    { threshold: 0.15 },
  )

  observer.observe(sectionRef.value)
})
</script>

<template>
  <SectionContainer id="console" :spaced="true">
    <div ref="sectionRef">
      <!-- Section Headers -->
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('devConsole.label') }}
      </UiLabel>

      <UiHeading level="h2" :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
        {{ t('devConsole.heading') }}
      </UiHeading>

      <p :class="['text-body text-text-muted mt-4 max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
        {{ t('devConsole.description') }}
      </p>

      <EditorialQuote :text="t('devConsole.quote')" position="right" />

      <!-- Interactive Console Container -->
      <div 
        :class="['mt-12 border border-border rounded-panel bg-surface overflow-hidden transition-all duration-500', visible ? 'animate-reveal' : 'opacity-0']"
        :style="{ transitionDelay: visible ? '300ms' : '0ms' }"
      >
        <!-- Tab Navigation Header -->
        <div class="flex border-b border-border bg-surface-elevated/40 overflow-x-auto scrollbar-none">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex items-center gap-3 px-6 py-4 font-mono text-small font-medium transition-all duration-150 border-b-2 whitespace-nowrap outline-none focus-visible:bg-surface"
            :class="[
              activeTab === tab.id
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface/20'
            ]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" :size="16" />
            <span>{{ t(tab.label) }}</span>
          </button>
        </div>

        <!-- Tab Content Window -->
        <div class="p-6 md:p-8 min-h-[460px] flex flex-col justify-stretch bg-surface/50">
          <KeepAlive>
            <component :is="
              activeTab === 'monitor'    ? SysMonitor    :
              activeTab === 'playground' ? ApiPlayground  :
              activeTab === 'sql'        ? SqlExplorer    :
              activeTab === 'seo'        ? SeoPreview     :
              activeTab === 'jwt'        ? JwtDecoder     :
              activeTab === 'pentest'    ? PentestLab     :
              TerminalWidget
            " />
          </KeepAlive>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

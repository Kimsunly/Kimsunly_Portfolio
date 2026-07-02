<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import PrincipleCard from '@/components/cards/PrincipleCard.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface PrincipleEntry {
  title: string
  description: string
}

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

const principles = computed(() => tm('principles.entries') as PrincipleEntry[])
</script>

<template>
  <SectionContainer id="principles" :spaced="true">
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('principles.label') }}
      </UiLabel>

      <UiHeading level="h2" :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
        {{ t('principles.heading') }}
      </UiHeading>

      <p :class="['text-body text-text-muted mt-4 max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
        {{ t('principles.description') }}
      </p>

      <EditorialQuote :text="t('principles.quote')" position="center" />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div
          v-for="(principle, index) in principles"
          :key="principle.title"
          :class="[visible ? 'animate-reveal' : 'opacity-0', 'flex']"
          :style="{ transitionDelay: visible ? `${300 + index * 80}ms` : '0ms' }"
        >
          <PrincipleCard
            :title="principle.title"
            :description="principle.description"
            :index="index"
          />
        </div>
      </div>
    </div>
  </SectionContainer>
</template>

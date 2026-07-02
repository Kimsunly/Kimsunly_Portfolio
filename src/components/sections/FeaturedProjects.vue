<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import ProjectCard from '@/components/cards/ProjectCard.vue'
import type { ProjectData } from '@/components/cards/ProjectCard.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { ChevronDown } from '@lucide/vue'

const { t, tm } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const showAll = ref(false)

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

const projectsList = computed(() => {
  return tm('projects.entries') as ProjectData[]
})

const featuredProject = computed(() => {
  return projectsList.value.find(p => p.featured) || projectsList.value[0]
})

const mainProjects = computed(() => {
  return projectsList.value.slice(1, 4)
})

const academicProjects = computed(() => {
  return projectsList.value.slice(4)
})
</script>

<template>
  <SectionContainer id="projects" :spaced="true">
    <div ref="sectionRef">
      <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
        {{ t('projects.label') }}
      </UiLabel>

      <UiHeading level="h2" :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
        {{ t('projects.heading') }}
      </UiHeading>

      <p :class="['text-body text-text-muted mt-4 max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
        {{ t('projects.description') }}
      </p>

      <EditorialQuote :text="t('projects.quote')" position="right" />

      <div class="mt-12 space-y-16">
        <!-- Featured Project (ANTPAY Case Study) -->
        <div
          v-if="featuredProject"
          :class="[visible ? 'animate-reveal' : 'opacity-0']"
          :style="{ transitionDelay: visible ? '300ms' : '0ms' }"
        >
          <ProjectCard :project="featuredProject" />
        </div>

        <!-- Main Grid (VETIKA, Smakjit, Smart Document Q&A) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(project, index) in mainProjects"
            :key="project.title"
            :class="[visible ? 'animate-reveal' : 'opacity-0']"
            :style="{ transitionDelay: visible ? `${400 + index * 80}ms` : '0ms' }"
          >
            <ProjectCard :project="project" />
          </div>
        </div>

        <!-- Toggle Button for Academic Coursework & Midterms -->
        <div v-if="academicProjects.length" class="flex justify-center mt-12">
          <button
            @click="showAll = !showAll"
            class="group inline-flex items-center gap-2 px-6 py-3 border border-border rounded-button bg-surface hover:border-primary/45 hover:text-primary transition-all duration-150 font-mono text-small cursor-pointer"
          >
            <span>{{ showAll ? t('projects.showLess') : t('projects.showMore') }}</span>
            <ChevronDown
              :size="14"
              :class="['transition-transform duration-200', showAll ? 'rotate-180' : '']"
            />
          </button>
        </div>

        <!-- Expandable Academic Projects Drawer -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-4 max-h-0"
          enter-to-class="transform opacity-100 translate-y-0 max-h-[1000px]"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="transform opacity-100 translate-y-0 max-h-[1000px]"
          leave-to-class="transform opacity-0 -translate-y-4 max-h-0"
        >
          <div v-if="showAll" class="overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div v-for="project in academicProjects" :key="project.title">
                <ProjectCard :project="project" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </SectionContainer>
</template>

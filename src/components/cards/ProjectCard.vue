<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, ExternalLink } from '@lucide/vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import TechBadge from '@/components/ui/TechBadge.vue'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'

const { t } = useI18n()

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectData {
  title: string
  organization: string
  period: string
  role: string
  category: string
  summary: string
  details: string[]
  stack: string[]
  images?: string[]
  featured?: boolean
  href?: string
  url?: string | ProjectLink[]
  github?: string | ProjectLink[]
}

withDefaults(defineProps<{
  project: ProjectData
}>(), {
  project: () => ({
    title: '',
    organization: '',
    period: '',
    role: '',
    category: '',
    summary: '',
    details: [],
    stack: [],
    featured: false,
  }),
})
</script>

<template>
  <article
    :class="[
      'h-full flex flex-col group relative border border-border rounded-card bg-surface transition-all duration-150 hover:border-primary/30',
      project.featured ? 'md:col-span-2 lg:col-span-2' : '',
    ]"
  >
    <div :class="['p-24 flex flex-col flex-1', project.featured ? 'md:flex-row md:gap-24' : '']">
      <div :class="[project.featured ? 'md:flex-1' : 'flex-1 flex flex-col']">
        <div class="flex items-center gap-3 mb-3">
          <UiBadge variant="default">{{ project.category }}</UiBadge>
          <span
            v-if="project.featured"
            class="font-mono text-tech-label uppercase tracking-[0.08em] text-primary"
          >
            {{ t('projectCard.featured') }}
          </span>
        </div>

        <h3 class="text-h3 font-semibold text-text-primary">
          {{ project.title }}
        </h3>

        <p class="text-small text-text-muted font-mono mt-2">
          {{ project.organization }} &middot; {{ project.period }}
        </p>

        <p class="text-small text-text-secondary font-medium mt-1">
          {{ project.role }}
        </p>

        <p class="text-body text-text-muted mt-4 leading-[160%]">
          {{ project.summary }}
        </p>

        <ul class="mt-4 space-y-2">
          <li
            v-for="(detail, i) in project.details"
            :key="i"
            class="text-small text-text-muted leading-[150%] pl-16 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/40"
          >
            {{ detail }}
          </li>
        </ul>

        <div class="flex flex-wrap gap-2 mt-6 mb-24">
          <TechBadge
            v-for="tech in project.stack"
            :key="tech"
          >
            {{ tech }}
          </TechBadge>
        </div>

        <div class="flex items-center gap-4 mt-auto pt-24 border-t border-border/20 flex-wrap">
          <!-- View Code (GitHub) -->
          <template v-if="Array.isArray(project.github)">
            <a
              v-for="link in project.github"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-small text-text-muted hover:text-primary transition-colors duration-150 font-medium cursor-pointer"
              @click.stop
            >
              <span>{{ link.label }}</span>
              <ArrowUpRight :size="14" class="transition-transform duration-150 hover:translate-x-0.5 hover:-translate-y-0.5" />
            </a>
          </template>
          <a
            v-else-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-small text-text-muted hover:text-primary transition-colors duration-150 font-medium cursor-pointer"
            @click.stop
          >
            <span>{{ t('projectCard.github') }}</span>
            <ArrowUpRight :size="14" class="transition-transform duration-150 hover:translate-x-0.5 hover:-translate-y-0.5" />
          </a>

          <!-- Live Hosting Link -->
          <template v-if="Array.isArray(project.url)">
            <a
              v-for="link in project.url"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-small text-primary/70 hover:text-primary transition-colors duration-150 font-medium cursor-pointer"
              @click.stop
            >
              <span>{{ link.label }}</span>
              <ExternalLink :size="12" />
            </a>
          </template>
          <a
            v-else-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-small text-primary/70 hover:text-primary transition-colors duration-150 font-medium cursor-pointer"
            @click.stop
          >
            <span>{{ t('projectCard.live') }}</span>
            <ExternalLink :size="12" />
          </a>

          <!-- Inactive Case Study Indicator (only when neither link exists) -->
          <div
            v-if="!project.github && !project.url"
            class="flex items-center gap-2 text-small text-text-muted group-hover:text-primary transition-colors duration-150"
          >
            <span>{{ t('projectCard.viewCaseStudy') }}</span>
            <ArrowUpRight :size="14" class="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      <div
        v-if="project.featured"
        class="w-full md:w-[480px] lg:w-[560px] shrink-0 mt-24 md:mt-0"
      >
        <ImageCarousel
          v-if="project.images?.length"
          :images="project.images"
          alt="ANTPAY UI screenshot"
          aspect="aspect-[4/3]"
        />
        <div
          v-else
          class="hidden md:flex h-full items-center justify-center border border-border rounded-card p-24"
          aria-hidden="true"
        >
          <div class="text-center">
            <div class="flex items-center justify-center gap-1.5 mb-3">
              <span class="w-2 h-2 rounded-full bg-error" />
              <span class="w-2 h-2 rounded-full bg-warning" />
              <span class="w-2 h-2 rounded-full bg-success" />
            </div>
            <div class="space-y-2">
              <div class="h-2 bg-border rounded w-24 mx-auto" />
              <div class="h-2 bg-border rounded w-16 mx-auto" />
              <div class="h-2 bg-surface-elevated rounded w-20 mx-auto" />
            </div>
            <p class="text-caption text-text-muted font-mono mt-4">{{ t('projectCard.projectPreview') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      aria-hidden="true"
    />
  </article>
</template>

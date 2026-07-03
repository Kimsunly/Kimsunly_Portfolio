<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Globe, Copy, CheckCircle, XCircle, FileText } from '@lucide/vue'

const title       = ref('Ly Kimsun | Backend-Focused Software Engineer | Node.js • Express • Vue.js')
const description = ref('Backend-focused software engineer specializing in Node.js, Express.js, REST APIs, database design, authentication, and scalable software systems.')
const site        = ref('lykimsun.dev')
const slug        = ref('')
const ogTitle     = ref('')
const robots      = ref('index, follow')
const copied      = ref(false)

const displayTitle = computed(() => ogTitle.value.trim() || title.value.trim() || 'Page Title')
const displayDesc  = computed(() => description.value.trim() || 'Meta description will appear here.')
const displayUrl   = computed(() => {
  const base = site.value.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com'
  const path = slug.value.trim() ? `/${slug.value.trim().replace(/\s+/g, '-').toLowerCase()}` : ''
  return `${base}${path}`
})
const displayBreadcrumb = computed(() => displayUrl.value.split('/').join(' › '))

const titleLen = computed(() => title.value.trim().length)
const descLen  = computed(() => description.value.trim().length)
const titleOk  = computed(() => titleLen.value >= 30 && titleLen.value <= 60)
const descOk   = computed(() => descLen.value  >= 70 && descLen.value  <= 160)
const slugOk   = computed(() => slug.value.trim().length > 0)
const keyOk    = computed(() => /node|backend|api|express/i.test(description.value))

const seoScore = computed(() => {
  let s = 0
  if (titleOk.value) s += 30; else if (titleLen.value > 0) s += 10
  if (descOk.value)  s += 35; else if (descLen.value  > 0) s += 12
  if (slugOk.value)  s += 20
  if (keyOk.value)   s += 15
  return s
})
const scoreColor = computed(() =>
  seoScore.value >= 80 ? '#22c55e' : seoScore.value >= 50 ? '#f59e0b' : '#ef4444'
)
const scoreLabel = computed(() =>
  seoScore.value >= 80 ? 'Excellent' : seoScore.value >= 50 ? 'Needs Work' : 'Poor'
)
const previewTitle = computed(() => {
  const t = title.value.trim() || 'Page Title'
  return t.length > 60 ? t.slice(0, 57) + '...' : t
})
const previewDesc = computed(() => {
  const d = description.value.trim() || 'Meta description will appear here...'
  return d.length > 155 ? d.slice(0, 152) + '...' : d
})

function copyMeta() {
  const meta = [
    `<title>${title.value}</title>`,
    `<meta name="description" content="${description.value}" />`,
    `<meta name="robots" content="${robots.value}" />`,
    ogTitle.value ? `<meta property="og:title" content="${ogTitle.value}" />` : '',
    `<link rel="canonical" href="https://${displayUrl.value}" />`,
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(meta).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function pillClass(len: number, min: number, max: number) {
  if (len === 0) return 'text-text-muted'
  if (len < min) return 'text-warning'
  if (len <= max) return 'text-success'
  return 'text-error'
}
</script>

<template>
  <div class="flex flex-col gap-5 w-full">

    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <Search :size="16" class="text-primary" />
        <span class="font-mono text-small text-primary font-semibold tracking-widest uppercase">SEO Preview Studio</span>
      </div>
      <button @click="copyMeta"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface font-mono text-xs text-text-muted hover:text-text-primary hover:border-primary transition-all duration-150">
        <Copy :size="13" />
        <span>{{ copied ? 'Copied!' : 'Copy HTML Tags' }}</span>
      </button>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- LEFT: Input fields -->
      <div class="flex flex-col gap-4">

        <!-- Page Title -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <FileText :size="12" /> Page Title
            </label>
            <span :class="['font-mono text-xs transition-colors', pillClass(titleLen, 30, 60)]">
              {{ titleLen }} / 60
            </span>
          </div>
          <input v-model="title" type="text" placeholder="Enter your page title…"
            class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors" />
          <div class="h-1 rounded-full bg-border overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300"
              :style="{ width: Math.min(titleLen / 60 * 100, 100) + '%', background: scoreColor }" />
          </div>
          <p class="text-xs text-text-muted">Aim for 30–60 characters for best results</p>
        </div>

        <!-- Meta Description -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest">Meta Description</label>
            <span :class="['font-mono text-xs transition-colors', pillClass(descLen, 70, 160)]">
              {{ descLen }} / 160
            </span>
          </div>
          <textarea v-model="description" rows="3" placeholder="Write a compelling description…"
            class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none" />
          <div class="h-1 rounded-full bg-border overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300"
              :style="{ width: Math.min(descLen / 160 * 100, 100) + '%', background: scoreColor }" />
          </div>
        </div>

        <!-- Domain + Slug -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest">Domain</label>
            <input v-model="site" type="text" placeholder="example.com"
              class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest">URL Slug</label>
            <input v-model="slug" type="text" placeholder="page-slug"
              class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <!-- OG Title + Robots -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest">OG Title</label>
            <input v-model="ogTitle" type="text" placeholder="(uses page title)"
              class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-xs text-text-muted uppercase tracking-widest">Robots</label>
            <select v-model="robots"
              class="w-full bg-surface border border-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-primary transition-colors">
              <option>index, follow</option>
              <option>noindex, follow</option>
              <option>index, nofollow</option>
              <option>noindex, nofollow</option>
            </select>
          </div>
        </div>

        <!-- SEO Score (bottom-left under inputs) -->
        <div class="border border-border rounded-xl p-4 bg-surface flex items-center gap-4">
          <div class="relative flex-shrink-0 w-14 h-14">
            <svg viewBox="0 0 52 52" width="56" height="56" class="-rotate-90">
              <circle cx="26" cy="26" r="22" fill="none" stroke="var(--color-border)" stroke-width="5" />
              <circle cx="26" cy="26" r="22" fill="none" :stroke="scoreColor" stroke-width="5"
                stroke-linecap="round"
                :stroke-dasharray="138.2"
                :stroke-dashoffset="138.2 - (seoScore / 100 * 138.2)"
                style="transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="font-mono text-xs font-bold" :style="{ color: scoreColor }">{{ seoScore }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-mono text-xs text-text-muted uppercase tracking-widest">SEO Score</span>
              <span class="font-mono text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                :style="{ color: scoreColor, borderColor: scoreColor + '60', background: scoreColor + '15' }">
                {{ scoreLabel }}
              </span>
            </div>
            <div class="grid grid-cols-1 gap-y-1">
              <div v-for="item in [
                { ok: titleOk, label: 'Title length (30–60 chars)' },
                { ok: descOk,  label: 'Description (70–160 chars)' },
                { ok: slugOk,  label: 'URL slug defined' },
                { ok: keyOk,   label: 'Keywords in description' },
              ]" :key="item.label" class="flex items-center gap-2">
                <CheckCircle v-if="item.ok" :size="12" class="text-success flex-shrink-0" />
                <XCircle     v-else         :size="12" class="text-error flex-shrink-0" />
                <span class="font-mono text-[11px]" :class="item.ok ? 'text-text-primary' : 'text-text-muted'">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Previews -->
      <div class="flex flex-col gap-4">

        <!-- Google SERP Card -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 font-mono text-xs text-text-muted uppercase tracking-widest">
            <Globe :size="12" class="text-primary" />
            Google SERP Preview
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">G</div>
              <span class="text-[11px] text-gray-500 truncate">{{ displayBreadcrumb }}</span>
            </div>
            <p class="text-blue-700 text-[15px] font-medium leading-snug hover:underline cursor-pointer line-clamp-1">
              {{ previewTitle }}
            </p>
            <p class="text-gray-600 text-xs leading-relaxed mt-1 line-clamp-2">{{ previewDesc }}</p>
          </div>
        </div>

        <!-- OG Social Preview — theme colors, no hardcoded purple gradient -->
        <div class="flex flex-col gap-2">
          <div class="font-mono text-xs text-text-muted uppercase tracking-widest">Social (OG) Preview</div>
          <div class="rounded-xl overflow-hidden border border-border bg-surface">
            <!-- Banner using theme primary -->
            <div class="h-14 bg-surface-elevated border-b border-border flex items-center px-4 gap-3">
              <div class="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Globe :size="14" class="text-primary" />
              </div>
              <span class="font-mono text-sm font-semibold text-text-primary truncate">
                {{ site.replace(/^https?:\/\//, '') || 'lykimsun.dev' }}
              </span>
            </div>
            <div class="p-3">
              <p class="font-mono text-[10px] text-text-muted uppercase tracking-wider">{{ site.replace(/^https?:\/\//, '') || 'lykimsun.dev' }}</p>
              <p class="text-text-primary font-semibold text-sm leading-snug mt-1 line-clamp-1">{{ displayTitle }}</p>
              <p class="text-text-muted text-xs leading-relaxed mt-1 line-clamp-2">{{ displayDesc }}</p>
            </div>
          </div>
        </div>

        <!-- Canonical URL preview -->
        <div class="flex flex-col gap-2">
          <div class="font-mono text-xs text-text-muted uppercase tracking-widest">Canonical URL</div>
          <div class="border border-border rounded-lg px-3 py-2.5 bg-surface flex items-center gap-2">
            <Globe :size="12" class="text-text-muted flex-shrink-0" />
            <span class="font-mono text-xs text-primary truncate">https://{{ displayUrl }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Key, Copy, AlertTriangle, CheckCircle, ChevronRight } from '@lucide/vue'

// Sample JWT for instant demo (signed with "your-jwt-secret")
const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTIzNDU2IiwibmFtZSI6Ikx5IEtpbXN1biIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MTQ5NjQwMCwiZXhwIjo5OTk5OTk5OTk5fQ.Tp7gKvYsAMX3o6L4N2p8EHrjCbOiQZwDfXue_FkUhsA'

const input = ref(SAMPLE_TOKEN)
const copiedField = ref<string | null>(null)

function base64UrlDecode(str: string): string {
  try {
    // Pad base64url to valid base64
    const padded = str.replace(/-/g, '+').replace(/_/g, '/')
    const pad = padded.length % 4
    const full = pad ? padded + '='.repeat(4 - pad) : padded
    return decodeURIComponent(
      atob(full).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
  } catch {
    return ''
  }
}

const parts = computed(() => input.value.trim().split('.'))

const isValidJwt = computed(() => parts.value.length === 3 && parts.value.every(p => p.length > 0))

const header = computed<Record<string, any> | null>(() => {
  if (!isValidJwt.value) return null
  try { return JSON.parse(base64UrlDecode(parts.value[0])) } catch { return null }
})

const payload = computed<Record<string, any> | null>(() => {
  if (!isValidJwt.value) return null
  try { return JSON.parse(base64UrlDecode(parts.value[1])) } catch { return null }
})

const expDate = computed(() => {
  if (!payload.value?.exp) return null
  return new Date(payload.value.exp * 1000)
})

const isExpired = computed(() => {
  if (!expDate.value) return false
  return expDate.value < new Date()
})

const iatDate = computed(() => {
  if (!payload.value?.iat) return null
  return new Date(payload.value.iat * 1000)
})

function formatDate(d: Date): string {
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function prettyJson(obj: Record<string, any>): string {
  return JSON.stringify(obj, null, 2)
}

function copyField(key: string, value: string) {
  navigator.clipboard.writeText(value).then(() => {
    copiedField.value = key
    setTimeout(() => { copiedField.value = null }, 1800)
  })
}

function loadSample() {
  input.value = SAMPLE_TOKEN
}

// Colorized token display
const coloredToken = computed(() => {
  if (!isValidJwt.value) return input.value
  const [h, p, s] = parts.value
  return `<span class="text-rose-400">${h}</span><span class="text-text-muted">.</span><span class="text-violet-400">${p}</span><span class="text-text-muted">.</span><span class="text-sky-400">${s}</span>`
})
</script>

<template>
  <div class="flex flex-col gap-5 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <Key :size="16" class="text-primary" />
        <span class="font-mono text-small text-primary font-semibold tracking-widest uppercase">JWT Decoder</span>
      </div>
      <button @click="loadSample"
        class="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text-muted hover:text-primary hover:border-primary transition-all duration-150">
        Load Sample Token
      </button>
    </div>

    <!-- Token Input -->
    <div class="flex flex-col gap-2">
      <label class="font-mono text-xs text-text-muted uppercase tracking-widest">Paste JWT Token</label>
      <textarea
        v-model="input"
        rows="3"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi…"
        class="w-full bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
      />
      <!-- Color-coded token preview -->
      <div v-if="isValidJwt" class="font-mono text-xs leading-relaxed break-all bg-surface/60 border border-border rounded-lg p-3">
        <span v-html="coloredToken" />
      </div>
      <div v-else-if="input.trim()" class="flex items-center gap-2 text-xs font-mono text-red-400">
        <AlertTriangle :size="13" /> Invalid JWT format (expected 3 dot-separated parts)
      </div>
    </div>

    <!-- Legend -->
    <div v-if="isValidJwt" class="flex flex-wrap gap-4">
      <span class="flex items-center gap-1.5 font-mono text-xs"><span class="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Header</span>
      <span class="flex items-center gap-1.5 font-mono text-xs"><span class="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block"></span> Payload</span>
      <span class="flex items-center gap-1.5 font-mono text-xs"><span class="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span> Signature</span>
    </div>

    <!-- Decoded Panels -->
    <div v-if="isValidJwt && header && payload" class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <!-- Header Panel -->
      <div class="flex flex-col gap-2 bg-surface border border-border rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-semibold text-rose-400 uppercase tracking-widest">Header</span>
          <button @click="copyField('header', prettyJson(header))"
            class="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-primary transition-colors">
            <Copy :size="11" />{{ copiedField === 'header' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="flex flex-col gap-1.5">
          <div v-for="(val, key) in header" :key="key" class="flex items-start justify-between gap-2 text-xs font-mono">
            <span class="text-text-muted">{{ key }}</span>
            <span class="text-text-primary font-medium text-right">{{ JSON.stringify(val) }}</span>
          </div>
        </div>
      </div>

      <!-- Payload Panel -->
      <div class="flex flex-col gap-2 bg-surface border border-border rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-semibold text-violet-400 uppercase tracking-widest">Payload</span>
          <button @click="copyField('payload', prettyJson(payload))"
            class="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-primary transition-colors">
            <Copy :size="11" />{{ copiedField === 'payload' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
          <div v-for="(val, key) in payload" :key="key" class="flex items-start justify-between gap-2 text-xs font-mono">
            <span class="text-text-muted flex-shrink-0">{{ key }}</span>
            <span class="text-text-primary font-medium text-right break-all">
              <template v-if="key === 'exp' && expDate">{{ formatDate(expDate) }}</template>
              <template v-else-if="key === 'iat' && iatDate">{{ formatDate(iatDate) }}</template>
              <template v-else>{{ JSON.stringify(val) }}</template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div v-if="isValidJwt" class="grid grid-cols-1 sm:grid-cols-3 gap-3">

      <!-- Expiry Status -->
      <div class="flex items-center gap-2.5 bg-surface border border-border rounded-xl p-3">
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', isExpired ? 'bg-red-500/15' : 'bg-green-500/15']">
          <CheckCircle v-if="!isExpired" :size="16" :class="isExpired ? 'text-red-400' : 'text-green-400'" />
          <AlertTriangle v-else :size="16" class="text-red-400" />
        </div>
        <div>
          <p class="font-mono text-xs text-text-muted uppercase tracking-widest">Status</p>
          <p :class="['font-mono text-sm font-semibold', isExpired ? 'text-red-400' : 'text-green-400']">
            {{ isExpired ? 'Expired' : 'Valid' }}
          </p>
        </div>
      </div>

      <!-- Algorithm -->
      <div class="flex items-center gap-2.5 bg-surface border border-border rounded-xl p-3">
        <div class="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center flex-shrink-0">
          <Key :size="16" class="text-rose-400" />
        </div>
        <div>
          <p class="font-mono text-xs text-text-muted uppercase tracking-widest">Algorithm</p>
          <p class="font-mono text-sm font-semibold text-text-primary">{{ header?.alg ?? '—' }}</p>
        </div>
      </div>

      <!-- Expires At -->
      <div class="flex items-center gap-2.5 bg-surface border border-border rounded-xl p-3">
        <div class="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center flex-shrink-0">
          <ChevronRight :size="16" class="text-sky-400" />
        </div>
        <div class="min-w-0">
          <p class="font-mono text-xs text-text-muted uppercase tracking-widest">Expires</p>
          <p class="font-mono text-xs font-semibold text-text-primary truncate">
            {{ expDate ? formatDate(expDate) : 'No expiry' }}
          </p>
        </div>
      </div>

    </div>

    <!-- Signature note -->
    <div v-if="isValidJwt" class="flex items-start gap-2 bg-sky-500/8 border border-sky-500/20 rounded-xl p-3 text-xs font-mono text-text-muted">
      <AlertTriangle :size="13" class="text-sky-400 mt-0.5 flex-shrink-0" />
      <span>Signature is displayed for reference only. Actual verification requires the secret key on the server side.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Key, Copy, AlertTriangle, CheckCircle } from '@lucide/vue'

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTIzNDU2IiwibmFtZSI6Ikx5IEtpbXN1biIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MTQ5NjQwMCwiZXhwIjo5OTk5OTk5OTk5fQ.Tp7gKvYsAMX3o6L4N2p8EHrjCbOiQZwDfXue_FkUhsA'

const token     = ref(SAMPLE)
const secret    = ref('your-jwt-secret')
const copiedKey = ref<string | null>(null)

function b64urlDecode(s: string): string {
  try {
    const p = s.replace(/-/g, '+').replace(/_/g, '/')
    const pad = p.length % 4
    const full = pad ? p + '='.repeat(4 - pad) : p
    return decodeURIComponent(
      atob(full).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
  } catch { return '' }
}

const parts = computed(() => token.value.trim().split('.'))
const valid  = computed(() => parts.value.length === 3 && parts.value.every(p => p.length > 0))

const header  = computed<Record<string, any> | null>(() => { try { return JSON.parse(b64urlDecode(parts.value[0])) } catch { return null } })
const payload = computed<Record<string, any> | null>(() => { try { return JSON.parse(b64urlDecode(parts.value[1])) } catch { return null } })

const expDate = computed(() => payload.value?.exp ? new Date(payload.value.exp * 1000) : null)
const iatDate = computed(() => payload.value?.iat ? new Date(payload.value.iat * 1000) : null)
const expired = computed(() => expDate.value ? expDate.value < new Date() : false)

function fmt(d: Date) {
  return d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function displayVal(key: string, val: any): string {
  if (key === 'exp' && expDate.value) return fmt(expDate.value)
  if (key === 'iat' && iatDate.value) return fmt(iatDate.value)
  return JSON.stringify(val)
}

function copy(key: string, text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 1800)
  })
}

// Coloured token — split at dots
const tokenParts = computed(() => {
  if (!valid.value) return null
  return { h: parts.value[0], p: parts.value[1], s: parts.value[2] }
})

// Pretty JSON for display
function pretty(obj: any) {
  return JSON.stringify(obj, null, 2)
}
</script>

<template>
  <div class="flex flex-col gap-0 w-full">

    <!-- ── Top: Encoded token input ────────────────────────────── -->
    <div class="flex items-center gap-2 mb-2">
      <Key :size="15" class="text-primary" />
      <span class="font-mono text-small text-primary font-semibold tracking-widest uppercase">JWT Decoder</span>
      <button @click="token = SAMPLE"
        class="ml-auto px-3 py-1 rounded border border-border font-mono text-xs text-text-muted hover:text-primary hover:border-primary transition-all duration-150">
        Sample Token
      </button>
    </div>

    <!-- Encoded input box -->
    <div class="border border-border rounded-xl overflow-hidden mb-4">
      <div class="px-4 py-2 bg-surface-elevated/30 border-b border-border font-mono text-xs text-text-muted uppercase tracking-widest">
        Encoded Token
      </div>
      <textarea
        v-model="token"
        rows="3"
        spellcheck="false"
        placeholder="Paste your JWT here…"
        class="w-full bg-surface px-4 py-3 font-mono text-xs leading-relaxed resize-none focus:outline-none"
        :class="valid ? 'text-text-primary' : 'text-red-400'"
      />
      <!-- Colour-coded token preview -->
      <div v-if="tokenParts" class="px-4 pb-3 font-mono text-[11px] leading-relaxed break-all">
        <span class="text-rose-400">{{ tokenParts.h }}</span><span class="text-text-muted/50">.</span><span class="text-violet-400">{{ tokenParts.p }}</span><span class="text-text-muted/50">.</span><span class="text-sky-400">{{ tokenParts.s }}</span>
      </div>
      <div v-else-if="token.trim() && !valid" class="flex items-center gap-2 px-4 pb-3 font-mono text-xs text-red-400">
        <AlertTriangle :size="12" /> Invalid JWT — needs 3 dot-separated base64url parts
      </div>
    </div>

    <!-- ── Three decoded columns ────────────────────────────────── -->
    <div v-if="valid && header && payload" class="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-xl overflow-hidden border border-border">

      <!-- HEADER column (rose) -->
      <div class="flex flex-col border-r border-border last:border-r-0">
        <div class="flex items-center justify-between px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20">
          <span class="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest">Header</span>
          <button @click="copy('header', pretty(header))"
            class="flex items-center gap-1.5 text-xs font-mono text-rose-300/70 hover:text-rose-300 transition-colors">
            <Copy :size="11" />{{ copiedKey === 'header' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <!-- JSON display -->
        <div class="flex-1 p-4 bg-rose-500/5 font-mono text-xs leading-relaxed">
          <div v-for="(val, key) in header" :key="key" class="flex justify-between gap-3 py-0.5">
            <span class="text-rose-300/80 flex-shrink-0">{{ key }}</span>
            <span class="text-text-primary text-right break-all">{{ JSON.stringify(val) }}</span>
          </div>
        </div>
        <!-- Algorithm badge -->
        <div class="px-4 py-2.5 border-t border-rose-500/20 bg-rose-500/5">
          <span class="font-mono text-xs text-text-muted">alg: </span>
          <span class="font-mono text-xs font-bold text-rose-400">{{ header?.alg ?? '—' }}</span>
        </div>
      </div>

      <!-- PAYLOAD column (violet) -->
      <div class="flex flex-col border-r border-border last:border-r-0">
        <div class="flex items-center justify-between px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/20">
          <span class="font-mono text-xs font-bold text-violet-400 uppercase tracking-widest">Payload</span>
          <button @click="copy('payload', pretty(payload))"
            class="flex items-center gap-1.5 text-xs font-mono text-violet-300/70 hover:text-violet-300 transition-colors">
            <Copy :size="11" />{{ copiedKey === 'payload' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <!-- JSON rows -->
        <div class="flex-1 p-4 bg-violet-500/5 font-mono text-xs leading-relaxed overflow-y-auto max-h-[200px]">
          <div v-for="(val, key) in payload" :key="key" class="flex justify-between gap-3 py-0.5">
            <span class="text-violet-300/80 flex-shrink-0">{{ key }}</span>
            <span class="text-text-primary text-right break-all">{{ displayVal(String(key), val) }}</span>
          </div>
        </div>
        <!-- Expiry status -->
        <div class="px-4 py-2.5 border-t border-violet-500/20 bg-violet-500/5 flex items-center gap-2">
          <CheckCircle v-if="!expired" :size="13" class="text-green-400 flex-shrink-0" />
          <AlertTriangle v-else         :size="13" class="text-red-400 flex-shrink-0" />
          <span :class="['font-mono text-xs font-bold', expired ? 'text-red-400' : 'text-green-400']">
            {{ expired ? 'Expired' : 'Valid' }}
          </span>
          <span v-if="expDate" class="font-mono text-xs text-text-muted truncate">· {{ fmt(expDate) }}</span>
        </div>
      </div>

      <!-- SIGNATURE column (sky) -->
      <div class="flex flex-col">
        <div class="flex items-center justify-between px-4 py-2.5 bg-sky-500/10 border-b border-sky-500/20">
          <span class="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest">Signature</span>
          <button @click="copy('sig', parts[2])"
            class="flex items-center gap-1.5 text-xs font-mono text-sky-300/70 hover:text-sky-300 transition-colors">
            <Copy :size="11" />{{ copiedKey === 'sig' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <!-- Signature formula -->
        <div class="flex-1 p-4 bg-sky-500/5 flex flex-col gap-3 font-mono text-xs">
          <div class="text-text-muted leading-relaxed text-[11px]">
            HMACSHA256(<br />
            &nbsp;&nbsp;<span class="text-rose-300">base64UrlEncode(header)</span><span class="text-text-muted">,</span><br />
            &nbsp;&nbsp;<span class="text-violet-300">base64UrlEncode(payload)</span><span class="text-text-muted">,</span><br />
            &nbsp;&nbsp;<span class="text-sky-300">your-secret</span><br />
            )
          </div>
          <!-- Secret input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-text-muted uppercase tracking-widest">Secret Key</label>
            <input
              v-model="secret"
              type="text"
              class="w-full bg-surface border border-sky-500/30 rounded px-2.5 py-1.5 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="your-jwt-secret"
            />
          </div>
          <div class="text-[11px] text-sky-400/60 leading-relaxed">
            Signature verified client-side for demo only. Real verification requires the server.
          </div>
        </div>
        <!-- Raw sig -->
        <div class="px-4 py-2.5 border-t border-sky-500/20 bg-sky-500/5">
          <p class="font-mono text-[10px] text-sky-400/70 break-all leading-relaxed line-clamp-2">{{ parts[2] }}</p>
        </div>
      </div>
    </div>

    <!-- Empty / invalid state -->
    <div v-if="!valid && !token.trim()" class="flex flex-col items-center justify-center py-10 gap-3">
      <Key :size="28" class="text-text-muted opacity-25" />
      <p class="font-mono text-xs text-text-muted text-center">Paste a JWT token above to decode it</p>
    </div>

  </div>
</template>

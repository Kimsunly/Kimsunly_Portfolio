<script setup lang="ts">
import { ref, computed } from 'vue'
import { Key, Copy, AlertTriangle, CheckCircle, ChevronRight } from '@lucide/vue'

// jwt.io sample token (HS256, far-future exp)
const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTIzNDU2IiwibmFtZSI6Ikx5IEtpbXN1biIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MTQ5NjQwMCwiZXhwIjo5OTk5OTk5OTk5fQ.Tp7gKvYsAMX3o6L4N2p8EHrjCbOiQZwDfXue_FkUhsA'

const rawToken = ref(SAMPLE)
const secret   = ref('your-256-bit-secret')
const copiedId = ref<string | null>(null)

// ── Utilities ─────────────────────────────────────────────────────────────────
function b64urlDecode(s: string): string {
  try {
    const p   = s.replace(/-/g, '+').replace(/_/g, '/')
    const pad = p.length % 4
    const str = atob(pad ? p + '='.repeat(4 - pad) : p)
    return decodeURIComponent(str.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
  } catch { return '' }
}
function copy(id: string, text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => { copiedId.value = null }, 1800)
  })
}
function fmtDate(epoch: number) {
  return new Date(epoch * 1000).toLocaleString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
function prettyJson(obj: any) { return JSON.stringify(obj, null, 2) }

// ── Parsed state ──────────────────────────────────────────────────────────────
const token = computed(() => rawToken.value.trim())
const parts = computed(() => token.value.split('.'))
const valid = computed(() => parts.value.length === 3 && parts.value.every(p => p.length > 0))

const header  = computed<Record<string, any> | null>(() => {
  try { return JSON.parse(b64urlDecode(parts.value[0])) } catch { return null }
})
const payload = computed<Record<string, any> | null>(() => {
  try { return JSON.parse(b64urlDecode(parts.value[1])) } catch { return null }
})
const expDate  = computed(() => payload.value?.exp  ? new Date(payload.value.exp  * 1000) : null)
const iatDate  = computed(() => payload.value?.iat  ? new Date(payload.value.iat  * 1000) : null)
const isExpired = computed(() => expDate.value ? expDate.value < new Date() : false)

function displayVal(key: string, val: any): string {
  if ((key === 'exp') && expDate.value) return fmtDate(payload.value!.exp)
  if ((key === 'iat') && iatDate.value) return fmtDate(payload.value!.iat)
  return JSON.stringify(val)
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full font-mono">

    <!-- ── Title row ──────────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <Key :size="15" class="text-primary" />
        <span class="text-small text-primary font-semibold tracking-widest uppercase">JWT Decoder</span>
        <span class="text-xs text-text-muted border border-border rounded px-2 py-0.5">RFC 7519</span>
      </div>
      <button @click="rawToken = SAMPLE"
        class="px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:border-primary hover:text-primary transition-all duration-150">
        Load Sample
      </button>
    </div>

    <!-- ── jwt.io two-panel layout: Encoded | Decoded ─────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border rounded-xl overflow-hidden min-h-[380px]">

      <!-- LEFT: Encoded token (dark panel) -->
      <div class="flex flex-col border-r border-border bg-surface">
        <!-- Panel header -->
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-elevated/50">
          <span class="text-xs font-semibold text-text-secondary uppercase tracking-widest">Encoded</span>
          <button @click="copy('encoded', token)"
            class="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
            <Copy :size="11" />{{ copiedId === 'encoded' ? 'Copied' : 'Copy' }}
          </button>
        </div>

        <!-- Raw textarea -->
        <textarea
          v-model="rawToken"
          rows="5"
          spellcheck="false"
          placeholder="Paste JWT token here…"
          class="flex-1 w-full bg-transparent px-4 pt-3 pb-2 text-xs leading-relaxed resize-none focus:outline-none text-text-primary"
        />

        <!-- Color-coded token preview -->
        <div v-if="valid" class="px-4 pb-4 text-[11px] leading-relaxed break-all">
          <!-- Header part — primary accent -->
          <span class="text-primary font-medium">{{ parts[0] }}</span>
          <span class="text-text-muted/40">.</span>
          <!-- Payload part — success accent -->
          <span class="text-success font-medium">{{ parts[1] }}</span>
          <span class="text-text-muted/40">.</span>
          <!-- Signature part — warning accent -->
          <span class="text-warning font-medium">{{ parts[2] }}</span>
        </div>
        <div v-else-if="rawToken.trim() && !valid"
          class="flex items-center gap-2 px-4 pb-4 text-xs text-error">
          <AlertTriangle :size="12" /> Invalid token format
        </div>

        <!-- Status bar -->
        <div v-if="valid && payload" class="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-surface-elevated/30">
          <CheckCircle v-if="!isExpired" :size="13" class="text-success flex-shrink-0" />
          <AlertTriangle v-else          :size="13" class="text-error flex-shrink-0" />
          <span :class="['text-xs font-semibold', isExpired ? 'text-error' : 'text-success']">
            {{ isExpired ? 'Expired' : 'Valid' }}
          </span>
          <ChevronRight :size="12" class="text-text-muted" />
          <span class="text-xs text-text-muted truncate">
            {{ header?.alg ?? '—' }} · exp {{ expDate ? fmtDate(payload.exp) : 'none' }}
          </span>
        </div>
      </div>

      <!-- RIGHT: Decoded (three stacked sections) -->
      <div class="flex flex-col divide-y divide-border bg-surface">

        <!-- HEADER section -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-elevated/50">
            <!-- colour pill: primary (purple) -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span class="text-xs font-semibold text-primary uppercase tracking-widest">Header</span>
              <span class="text-[10px] text-text-muted">Algorithm &amp; Token Type</span>
            </div>
            <button @click="copy('header', header ? prettyJson(header) : '')"
              class="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
              <Copy :size="11" />{{ copiedId === 'header' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <div class="px-4 py-3 text-xs leading-relaxed">
            <div v-if="header" v-for="(val, key) in header" :key="key"
              class="flex items-start justify-between gap-4 py-0.5">
              <span class="text-primary/80 flex-shrink-0">{{ key }}</span>
              <span class="text-text-primary text-right">{{ JSON.stringify(val) }}</span>
            </div>
            <span v-else class="text-text-muted italic">No header decoded</span>
          </div>
        </div>

        <!-- PAYLOAD section -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-elevated/50">
            <!-- colour pill: success (green) -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-success flex-shrink-0"></span>
              <span class="text-xs font-semibold text-success uppercase tracking-widest">Payload</span>
              <span class="text-[10px] text-text-muted">Data</span>
            </div>
            <button @click="copy('payload', payload ? prettyJson(payload) : '')"
              class="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
              <Copy :size="11" />{{ copiedId === 'payload' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <div class="px-4 py-3 text-xs leading-relaxed max-h-[160px] overflow-y-auto">
            <div v-if="payload" v-for="(val, key) in payload" :key="key"
              class="flex items-start justify-between gap-4 py-0.5">
              <span class="text-success/80 flex-shrink-0">{{ key }}</span>
              <span class="text-text-primary text-right">{{ displayVal(String(key), val) }}</span>
            </div>
            <span v-else class="text-text-muted italic">No payload decoded</span>
          </div>
        </div>

        <!-- SIGNATURE section -->
        <div class="flex flex-col flex-1">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-elevated/50">
            <!-- colour pill: warning (amber) -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-warning flex-shrink-0"></span>
              <span class="text-xs font-semibold text-warning uppercase tracking-widest">Signature</span>
              <span class="text-[10px] text-text-muted">Verify</span>
            </div>
            <button @click="copy('sig', parts[2] || '')"
              class="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
              <Copy :size="11" />{{ copiedId === 'sig' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <div class="px-4 py-3 flex flex-col gap-3 text-xs">
            <!-- Formula -->
            <div class="text-text-muted leading-loose text-[11px] bg-surface-elevated/40 rounded-lg px-3 py-2">
              HMACSHA256(<br />
              &nbsp;&nbsp;<span class="text-primary">base64UrlEncode(header)</span>,<br />
              &nbsp;&nbsp;<span class="text-success">base64UrlEncode(payload)</span>,<br />
              &nbsp;&nbsp;<span class="text-warning">{{ secret || 'your-secret' }}</span><br />
              )
            </div>
            <!-- Secret input -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] text-text-muted uppercase tracking-widest">Secret Key</label>
              <input v-model="secret" type="text" placeholder="your-256-bit-secret"
                class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors" />
            </div>
            <p class="text-[10px] text-text-muted leading-relaxed">
              Signature displayed for reference only. Real verification requires the server-side secret.
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!rawToken.trim()" class="flex flex-col items-center justify-center py-8 gap-3">
      <Key :size="28" class="text-text-muted opacity-30" />
      <p class="text-xs text-text-muted">Paste a JWT token above to decode it</p>
    </div>

  </div>
</template>

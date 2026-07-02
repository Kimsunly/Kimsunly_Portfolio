<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from '@lucide/vue'

const { t } = useI18n()

// Metrics refs
const cpuVal = ref(15)
const ramVal = ref(54.2)
const dbConnections = ref(6)
const redisHitRate = ref(98.4)
const activeRequests = ref(2)

// Live Log list
interface LogEntry {
  id: number
  time: string
  level: 'INFO' | 'WARN' | 'DEBUG' | 'ERROR'
  service: string
  message: string
  meta?: string
}

const logs = ref<LogEntry[]>([])
const logsContainer = ref<HTMLElement | null>(null)
let updateInterval: ReturnType<typeof setInterval> | null = null
let logInterval: ReturnType<typeof setInterval> | null = null
let errorTimeout: ReturnType<typeof setTimeout> | null = null
let logIdCounter = 0

// Preset services and logs for random generator
const services = ['Router', 'AuthService', 'MySQLPool', 'RedisCache', 'RateLimiter', 'PaymentService']
const templates = [
  { level: 'INFO', message: 'GET /api/v1/projects - 200 OK', meta: '18ms' },
  { level: 'INFO', message: 'GET /api/v1/profile - 200 OK', meta: '10ms' },
  { level: 'DEBUG', message: 'Connection released back to pool', meta: 'active: {db}' },
  { level: 'INFO', message: 'Redis cache hit for key: "tech_stack:pyramid"', meta: '0.4ms' },
  { level: 'WARN', message: 'Redis cache miss for "projects:featured" - fetching from DB', meta: '14ms' },
  { level: 'INFO', message: 'RateLimiter: requests: {req}/100 from IP 103.20.12.18', meta: 'clean' },
  { level: 'DEBUG', message: 'Garbage collection completed', meta: 'freed 12MB' },
  { level: 'INFO', message: 'Token verified successfully for user_id: {user}', meta: 'role: guest' },
] as const

function getFormattedTime() {
  const now = new Date()
  return now.toTimeString().split(' ')[0]
}

function appendLog(level: LogEntry['level'], service: string, message: string, meta?: string) {
  const newLog: LogEntry = {
    id: logIdCounter++,
    time: getFormattedTime(),
    level,
    service,
    message,
    meta,
  }
  logs.value.push(newLog)
  if (logs.value.length > 40) {
    logs.value.shift()
  }
  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
    }
  })
}

function generateRandomLog() {
  const tpl = templates[Math.floor(Math.random() * templates.length)]
  const service = services[Math.floor(Math.random() * services.length)]
  
  // Format variables inside templates
  let msg = tpl.message
    .replace('{db}', dbConnections.value.toString())
    .replace('{req}', activeRequests.value.toString())
    .replace('{user}', Math.floor(Math.random() * 500 + 1).toString())
    
  appendLog(tpl.level, service, msg, tpl.meta)
}

function updateMetrics() {
  // Bouncing metrics
  cpuVal.value = Math.max(8, Math.min(42, Math.round(cpuVal.value + (Math.random() - 0.5) * 8)))
  ramVal.value = Math.max(53.8, Math.min(54.9, Number((ramVal.value + (Math.random() - 0.5) * 0.15).toFixed(2))))
  dbConnections.value = Math.max(3, Math.min(12, dbConnections.value + (Math.random() > 0.6 ? 1 : Math.random() < 0.4 ? -1 : 0)))
  redisHitRate.value = Math.max(97.0, Math.min(99.8, Number((redisHitRate.value + (Math.random() - 0.5) * 0.3).toFixed(2))))
  activeRequests.value = Math.max(0, Math.min(8, activeRequests.value + (Math.random() > 0.65 ? 1 : Math.random() < 0.35 ? -1 : 0)))
}

const triggerErrorState = ref(false)

function triggerServerError() {
  if (triggerErrorState.value) return
  triggerErrorState.value = true
  
  // Spike metrics
  cpuVal.value = 92
  dbConnections.value = 19
  activeRequests.value = 15
  
  appendLog('ERROR', 'MySQLPool', 'Connection pool saturated - active: 19/20', 'CRITICAL')
  setTimeout(() => {
    appendLog('ERROR', 'Database', 'Connection timeout on query SELECT * FROM antpay_transactions', 'code: ETIMEDOUT (5000ms)')
  }, 400)
  
  // Gradually recover after 6s
  errorTimeout = setTimeout(() => {
    triggerErrorState.value = false
    appendLog('INFO', 'MySQLPool', 'Database connection pool reclaimed', 'recovered')
  }, 6000)
}

onMounted(() => {
  // Initialize with some log lines
  for (let i = 0; i < 6; i++) {
    generateRandomLog()
  }

  updateInterval = setInterval(() => {
    if (!triggerErrorState.value) {
      updateMetrics()
    } else {
      // Bouncing metrics near spiked levels during error
      cpuVal.value = Math.round(85 + Math.random() * 10)
      dbConnections.value = Math.round(17 + Math.random() * 3)
      activeRequests.value = Math.round(12 + Math.random() * 4)
    }
  }, 1500)

  logInterval = setInterval(() => {
    generateRandomLog()
  }, 3000 + Math.random() * 2000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  if (logInterval) clearInterval(logInterval)
  if (errorTimeout) clearTimeout(errorTimeout)
})
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <!-- Server Status Bar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-border bg-surface/20 rounded-panel p-16 sm:p-24">
      <div class="flex items-center gap-3">
        <span class="relative flex h-3 w-3">
          <span 
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="triggerErrorState ? 'bg-error' : 'bg-success'"
          ></span>
          <span 
            class="relative inline-flex rounded-full h-3 w-3"
            :class="triggerErrorState ? 'bg-error' : 'bg-success'"
          ></span>
        </span>
        <span class="font-mono text-small font-semibold tracking-wider text-text-primary">
          {{ triggerErrorState ? 'SERVER ALERT: SATURATED' : t('devConsole.monitor.serverStatus') }}
        </span>
      </div>
      
      <button
        @click="triggerServerError"
        :disabled="triggerErrorState"
        class="flex items-center gap-2 px-3 py-1.5 rounded-button text-caption font-mono font-medium border border-error/30 bg-error/5 hover:bg-error/15 text-error disabled:opacity-40 transition-all duration-150"
      >
        <AlertCircle :size="12" />
        {{ t('devConsole.monitor.errorButton') }}
      </button>
    </div>

    <!-- Metrics Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <!-- CPU -->
      <div class="border border-border rounded-card p-6 bg-surface-elevated/20">
        <span class="text-caption font-mono text-text-muted block mb-1">
          {{ t('devConsole.monitor.cpu') }}
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-h3 font-bold font-mono" :class="cpuVal > 80 ? 'text-error' : 'text-text-primary'">
            {{ cpuVal }}%
          </span>
        </div>
        <div class="h-1 bg-border/40 rounded-full mt-3 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500" 
            :class="cpuVal > 80 ? 'bg-error' : 'bg-primary'"
            :style="{ width: `${cpuVal}%` }"
          />
        </div>
      </div>

      <!-- RAM -->
      <div class="border border-border rounded-card p-6 bg-surface-elevated/20">
        <span class="text-caption font-mono text-text-muted block mb-1">
          {{ t('devConsole.monitor.ram') }}
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-h3 font-bold font-mono text-text-primary">
            {{ ramVal }}%
          </span>
          <span class="text-caption font-mono text-text-muted">
            {{ (ramVal * 0.16).toFixed(1) }}G/16G
          </span>
        </div>
        <div class="h-1 bg-border/40 rounded-full mt-3 overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-500" 
            :style="{ width: `${ramVal}%` }"
          />
        </div>
      </div>

      <!-- DB CONNECTIONS -->
      <div class="border border-border rounded-card p-6 bg-surface-elevated/20">
        <span class="text-caption font-mono text-text-muted block mb-1">
          {{ t('devConsole.monitor.dbPool') }}
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-h3 font-bold font-mono" :class="dbConnections >= 18 ? 'text-error' : 'text-text-primary'">
            {{ dbConnections }}
          </span>
          <span class="text-caption font-mono text-text-muted">/20 active</span>
        </div>
        <div class="h-1 bg-border/40 rounded-full mt-3 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500" 
            :class="dbConnections >= 18 ? 'bg-error' : 'bg-primary'"
            :style="{ width: `${(dbConnections / 20) * 100}%` }"
          />
        </div>
      </div>

      <!-- REDIS HIT RATE -->
      <div class="border border-border rounded-card p-6 bg-surface-elevated/20">
        <span class="text-caption font-mono text-text-muted block mb-1">
          {{ t('devConsole.monitor.cacheHit') }}
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-h3 font-bold font-mono text-text-primary">
            {{ redisHitRate }}%
          </span>
        </div>
        <div class="h-1 bg-border/40 rounded-full mt-3 overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-500" 
            :style="{ width: `${redisHitRate}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Live Event Log Ticker -->
    <div class="flex flex-col border border-border bg-surface-elevated/30 rounded-panel overflow-hidden">
      <div class="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-elevated/40">
        <span class="font-mono text-caption font-semibold tracking-wider text-text-secondary uppercase">
          {{ t('devConsole.monitor.logHeader') }}
        </span>
        <span class="font-mono text-[10px] text-text-muted">
          Active Sessions: {{ activeRequests }}
        </span>
      </div>

      <!-- Scrolling Logs Pane -->
      <div 
        ref="logsContainer"
        class="p-6 font-mono text-[13px] leading-relaxed h-[280px] overflow-y-auto space-y-1.5 scrollbar-none bg-surface/30 select-text selection:bg-primary/20"
      >
        <div 
          v-for="log in logs" 
          :key="log.id"
          class="flex flex-wrap gap-x-2 md:gap-x-4 border-b border-transparent hover:bg-surface-elevated/10 py-0.5 rounded px-1 transition-all duration-100"
        >
          <span class="text-text-muted shrink-0">{{ log.time }}</span>
          <span 
            class="font-bold shrink-0 text-center min-w-[50px] text-[11px] px-1 py-0.2 rounded"
            :class="[
              log.level === 'INFO' ? 'text-success bg-success/5' :
              log.level === 'WARN' ? 'text-warning bg-warning/5' :
              log.level === 'DEBUG' ? 'text-info bg-info/5' :
              'text-error bg-error/10 border border-error/20'
            ]"
          >
            {{ log.level }}
          </span>
          <span class="text-primary/80 font-medium shrink-0">[{{ log.service }}]</span>
          <span class="text-text-primary break-all flex-1">{{ log.message }}</span>
          <span v-if="log.meta" class="text-text-muted text-[11px] font-medium border border-border rounded px-1 ml-auto shrink-0 bg-surface/50">
            {{ log.meta }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

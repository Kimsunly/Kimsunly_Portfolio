<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Play, ShieldAlert, Key, ChevronDown } from '@lucide/vue'

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const options = [
  '/api/v1/profile',
  '/api/v1/projects',
  '/api/v1/admin/transactions',
  '/api/v1/contact'
] as const

function selectEndpoint(opt: typeof options[number]) {
  selectedEndpoint.value = opt
  isOpen.value = false
}

const clickOutside = (e: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', clickOutside)
})

const { t } = useI18n()

type MethodType = 'GET' | 'POST'
type EndpointType = '/api/v1/profile' | '/api/v1/projects' | '/api/v1/admin/transactions' | '/api/v1/contact'

const selectedEndpoint = ref<EndpointType>('/api/v1/profile')
const includeToken = ref(true)
const isSending = ref(false)

// Input form for POST /contact
const contactName = ref('KimsunLy')
const contactEmail = ref('kimsunly49@gmail.com')
const contactMessage = ref('Hello! I would love to collaborate on a full-stack project and system design.')

const method = computed<MethodType>(() => {
  return selectedEndpoint.value === '/api/v1/contact' ? 'POST' : 'GET'
})

// Output console values
const httpStatus = ref<number | null>(null)
const httpStatusText = ref('')
const latency = ref<number | null>(null)
const dbTime = ref<number | null>(null)
const responseHeaders = ref<Record<string, string>>({})
const responseBody = ref<string>('')

// Mock Data
const profileData = {
  status: 'success',
  data: {
    name: 'Ly Kimsun',
    role: 'Backend-Focused Software Engineer',
    location: 'Phnom Penh, Cambodia',
    email: 'lykimsun@example.com',
    github: 'github.com/lykimsun',
    degree: 'B.S. in Information Technology & Engineering (RUPP)'
  }
}

const projectsData = {
  status: 'success',
  results: 3,
  data: [
    {
      id: 1,
      title: 'ANTPAY',
      category: 'Payment Management System',
      role: 'Group Leader & Backend Developer',
      stack: ['Node.js', 'Express', 'MySQL', 'JWT', 'Nginx']
    },
    {
      id: 2,
      title: 'VETIKA',
      category: 'Student Community Platform',
      role: 'Group Leader & Frontend Developer',
      stack: ['Vue.js', 'Node.js', 'MySQL']
    },
    {
      id: 3,
      title: 'Smakjit',
      category: 'Volunteer Platform',
      role: 'Group Leader & Full-Stack Developer',
      stack: ['Next.js', 'Laravel', 'PHP', 'MySQL']
    }
  ]
}

const transactionsData = {
  status: 'success',
  auth: {
    user_id: 104,
    role: 'admin',
    scopes: ['read:transactions', 'write:invoices']
  },
  data: [
    { id: 'TXN_902', amount: 120.0, status: 'completed', gateway: 'ABA Pay', date: '2026-07-02' },
    { id: 'TXN_901', amount: 450.0, status: 'completed', gateway: 'Visa Card', date: '2026-07-01' },
    { id: 'TXN_900', amount: 35.0, status: 'failed', reason: 'Insufficient funds', gateway: 'ABA Pay', date: '2026-06-30' }
  ]
}

const unauthorizedData = {
  status: 'error',
  code: 'UNAUTHORIZED',
  message: 'Bearer access token is missing or expired. Authenticate to view this admin resource.'
}

async function sendRequest() {
  if (isSending.value) return
  isSending.value = true

  // Simulate latency
  const waitTime = Math.floor(Math.random() * 200 + 80) // 80ms - 280ms
  
  await new Promise(resolve => setTimeout(resolve, waitTime))

  latency.value = waitTime
  dbTime.value = Math.floor(waitTime * (0.15 + Math.random() * 0.1))

  // Set mock headers
  responseHeaders.value = {
    'Content-Type': 'application/json; charset=utf-8',
    'Connection': 'keep-alive',
    'X-Powered-By': 'Express',
    'X-Response-Time': `${waitTime}ms`
  }

  if (selectedEndpoint.value === '/api/v1/profile') {
    httpStatus.value = 200
    httpStatusText.value = 'OK'
    responseBody.value = JSON.stringify(profileData, null, 2)
    responseHeaders.value['Cache-Control'] = 'public, max-age=3600'
  } 
  else if (selectedEndpoint.value === '/api/v1/projects') {
    httpStatus.value = 200
    httpStatusText.value = 'OK'
    responseBody.value = JSON.stringify(projectsData, null, 2)
    responseHeaders.value['Cache-Control'] = 'public, max-age=600'
  } 
  else if (selectedEndpoint.value === '/api/v1/admin/transactions') {
    if (includeToken.value) {
      httpStatus.value = 200
      httpStatusText.value = 'OK'
      responseBody.value = JSON.stringify(transactionsData, null, 2)
      responseHeaders.value['Cache-Control'] = 'private, no-store'
    } else {
      httpStatus.value = 401
      httpStatusText.value = 'Unauthorized'
      responseBody.value = JSON.stringify(unauthorizedData, null, 2)
      responseHeaders.value['Cache-Control'] = 'no-cache'
    }
  } 
  else if (selectedEndpoint.value === '/api/v1/contact') {
    // Validation validation
    if (!contactName.value.trim() || !contactEmail.value.includes('@') || contactMessage.value.trim().length < 10) {
      httpStatus.value = 400
      httpStatusText.value = 'Bad Request'
      const errors: Record<string, string> = {}
      if (!contactName.value.trim()) errors.name = 'Name field is required'
      if (!contactEmail.value.includes('@')) errors.email = 'A valid email is required'
      if (contactMessage.value.trim().length < 10) errors.message = 'Message must be at least 10 characters long'
      
      responseBody.value = JSON.stringify({
        status: 'error',
        code: 'VALIDATION_FAILED',
        errors
      }, null, 2)
    } else {
      httpStatus.value = 201
      httpStatusText.value = 'Created'
      responseBody.value = JSON.stringify({
        status: 'success',
        message: 'Message delivered successfully to Ly Kimsun!',
        data: {
          message_id: `MSG_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          sender: contactName.value,
          email: contactEmail.value,
          body_length: contactMessage.value.length,
          received_at: new Date().toISOString()
        }
      }, null, 2)
    }
    responseHeaders.value['Cache-Control'] = 'no-cache'
  }

  isSending.value = false
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-text-primary">
    <!-- REST Configurator Panel (Left) -->
    <div class="lg:col-span-5 flex flex-col gap-5">
      <!-- Custom Selector Dropdown -->
      <div ref="selectRef" class="relative">
        <label class="block font-mono text-caption text-text-muted mb-2 uppercase tracking-wider">
          {{ t('devConsole.api.endpointLabel') }}
        </label>
        <button
          @click="isOpen = !isOpen"
          type="button"
          class="w-full flex items-center justify-between bg-surface-elevated border border-border hover:border-primary/50 text-small rounded-input px-4 py-3 font-mono cursor-pointer outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary select-none transition-all text-left"
        >
          <span class="flex items-center gap-3">
            <span 
              class="font-bold text-[10px] px-1.5 py-0.5 rounded leading-none border"
              :class="selectedEndpoint === '/api/v1/contact' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20'"
            >
              {{ selectedEndpoint === '/api/v1/contact' ? 'POST' : 'GET' }}
            </span>
            <span class="text-text-primary text-small">{{ selectedEndpoint }}</span>
          </span>
          <ChevronDown :size="16" class="text-text-muted transition-transform duration-150" :class="{ 'rotate-180': isOpen }" />
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isOpen"
            class="absolute left-0 z-dropdown mt-2 w-full bg-surface border border-border rounded-input shadow-lg overflow-hidden font-mono divide-y divide-border/20 backdrop-blur-md"
          >
            <button
              v-for="opt in options"
              :key="opt"
              @click="selectEndpoint(opt)"
              type="button"
              class="w-full flex items-center gap-3 text-left px-4 py-3 text-small hover:bg-surface-elevated transition-colors duration-150 outline-none"
              :class="{ 'text-primary bg-primary/5 font-semibold': selectedEndpoint === opt }"
            >
              <span 
                class="font-bold text-[10px] px-1.5 py-0.5 rounded leading-none border"
                :class="opt === '/api/v1/contact' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20'"
              >
                {{ opt === '/api/v1/contact' ? 'POST' : 'GET' }}
              </span>
              <span>{{ opt }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Auth config if Admin Route -->
      <div 
        v-if="selectedEndpoint === '/api/v1/admin/transactions'" 
        class="border border-border rounded-panel p-4 bg-surface-elevated/20 flex flex-col gap-3"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 font-mono text-caption text-text-secondary uppercase">
            <Key :size="14" class="text-primary" />
            Authorization
          </span>
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              v-model="includeToken" 
              class="sr-only peer"
            >
            <div class="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div class="font-mono text-[11px] text-text-muted bg-surface/40 p-2.5 rounded border border-border select-all overflow-x-auto whitespace-nowrap">
          <span class="text-primary/70">Authorization:</span> Bearer {{ includeToken ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...' : 'none' }}
        </div>
      </div>

      <!-- POST Input Form if /contact -->
      <div 
        v-if="selectedEndpoint === '/api/v1/contact'" 
        class="border border-border rounded-panel p-4 bg-surface-elevated/20 flex flex-col gap-4"
      >
        <span class="font-mono text-caption text-text-secondary uppercase tracking-wider block">
          Request Body (JSON)
        </span>
        <div class="space-y-3">
          <div>
            <label class="block font-mono text-[11px] text-text-muted mb-1">Name</label>
            <input 
              v-model="contactName" 
              type="text" 
              class="w-full bg-surface/50 border border-border text-small rounded px-3 py-1.5 font-mono focus:border-primary outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div>
            <label class="block font-mono text-[11px] text-text-muted mb-1">Email</label>
            <input 
              v-model="contactEmail" 
              type="email" 
              class="w-full bg-surface/50 border border-border text-small rounded px-3 py-1.5 font-mono focus:border-primary outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div>
            <label class="block font-mono text-[11px] text-text-muted mb-1">Message</label>
            <textarea 
              v-model="contactMessage" 
              rows="2"
              class="w-full bg-surface/50 border border-border text-small rounded px-3 py-1.5 font-mono focus:border-primary outline-none focus:ring-2 focus:ring-primary/10 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="sendRequest"
        :disabled="isSending"
        class="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] text-white py-3 px-6 rounded-button font-mono text-small font-semibold shadow-lg shadow-primary/25 disabled:opacity-40 transition-all duration-150"
      >
        <Play :size="14" class="fill-current" />
        {{ isSending ? t('devConsole.api.sending') : t('devConsole.api.sendButton') }}
      </button>
    </div>

    <!-- REST Console Response Panel (Right) -->
    <div class="lg:col-span-7 flex flex-col border border-border bg-surface-elevated/10 rounded-panel overflow-hidden">
      <!-- Response Status Bar -->
      <div class="flex flex-wrap items-center gap-4 px-4 py-2 border-b border-border bg-surface-elevated/40 justify-between font-mono text-caption text-text-secondary">
        <span>{{ t('devConsole.api.responseLabel') }}</span>
        <div class="flex items-center gap-4">
          <span v-if="httpStatus" class="flex items-center gap-2">
            Status: 
            <span 
              class="font-bold px-1.5 py-0.5 rounded text-[11px] border"
              :class="[
                httpStatus < 300 ? 'text-success bg-success/5 border-success/20' : 
                httpStatus < 400 ? 'text-info bg-info/5 border-info/20' :
                'text-error bg-error/5 border-error/20'
              ]"
            >
              {{ httpStatus }} {{ httpStatusText }}
            </span>
          </span>
          <span v-if="latency" class="text-text-muted">
            {{ t('devConsole.api.latency') }}: <span class="text-primary/90 font-bold">{{ latency }}ms</span>
          </span>
          <span v-if="dbTime" class="text-text-muted">
            {{ t('devConsole.api.dbTime') }}: <span class="text-primary/70 font-semibold">{{ dbTime }}ms</span>
          </span>
        </div>
      </div>

      <!-- JSON Response Display -->
      <div class="flex-1 flex flex-col min-h-[300px]">
        <!-- Placeholder -->
        <div 
          v-if="!httpStatus" 
          class="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted gap-3"
        >
          <ShieldAlert :size="28" class="text-text-muted/65" />
          <p class="font-mono text-small max-w-[280px]">
            Configure values and execute request payload above.
          </p>
        </div>

        <!-- Real output -->
        <div v-else class="flex-1 flex flex-col divide-y divide-border/40 font-mono text-[13px] bg-surface/10 select-text selection:bg-primary/20">
          <!-- Headers -->
          <div class="p-4 bg-surface-elevated/5 text-caption space-y-1 select-text">
            <div 
              v-for="(val, key) in responseHeaders" 
              :key="key"
              class="flex"
            >
              <span class="text-text-muted select-none min-w-[120px]">{{ key }}:</span>
              <span class="text-text-secondary select-text">{{ val }}</span>
            </div>
          </div>
          <!-- Body -->
          <pre class="flex-1 p-4 overflow-auto font-mono text-[13px] text-text-primary leading-relaxed bg-surface/30 select-text max-h-[300px]">{{ responseBody }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

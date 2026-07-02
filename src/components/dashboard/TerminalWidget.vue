<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface TerminalLine {
  id: number
  text: string
  type: 'input' | 'output' | 'error' | 'success' | 'system'
}

let lineIdCounter = 0
const history = ref<string[]>([])
const historyIndex = ref(-1)
const currentInput = ref('')
const terminalLines = ref<TerminalLine[]>([])
const terminalBody = ref<HTMLElement | null>(null)
const inputField = ref<HTMLInputElement | null>(null)

// Initialize
onMounted(() => {
  terminalLines.value.push({
    id: lineIdCounter++,
    text: t('devConsole.terminal.welcome'),
    type: 'system',
  })
})

function focusInput() {
  if (inputField.value) {
    inputField.value.focus()
  }
}

function handleCommand() {
  const cmd = currentInput.value.trim()
  if (!cmd) return

  // Add the user's input line
  terminalLines.value.push({
    id: lineIdCounter++,
    text: `visitor@kimsun-dev:~$ ${cmd}`,
    type: 'input',
  })

  // Save to history
  history.value.push(cmd)
  historyIndex.value = history.value.length
  currentInput.value = ''

  // Parse command
  const args = cmd.toLowerCase().split(' ')
  const primaryCmd = args[0]

  switch (primaryCmd) {
    case 'help':
      printHelp()
      break
    case 'bio':
      printBio()
      break
    case 'skills':
      printSkills()
      break
    case 'projects':
      printProjects()
      break
    case 'neofetch':
      printNeofetch()
      break
    case 'clear':
      terminalLines.value = []
      break
    case 'sudo':
      handleSudo(args.slice(1))
      break
    default:
      terminalLines.value.push({
        id: lineIdCounter++,
        text: t('devConsole.terminal.commandNotFound', { cmd: primaryCmd }),
        type: 'error',
      })
  }

  // Scroll to bottom
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

function handleHistoryKey(e: KeyboardEvent) {
  if (history.value.length === 0) return

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentInput.value = history.value[historyIndex.value]
    } else if (historyIndex.value === 0) {
      currentInput.value = history.value[0]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      currentInput.value = history.value[historyIndex.value]
    } else {
      historyIndex.value = history.value.length
      currentInput.value = ''
    }
  }
}

// Command output functions
function printHelp() {
  const helpLines = [
    'Available commands:',
    '  help       - Display list of supported commands',
    '  bio        - Read a brief introduction about me',
    '  skills     - View my primary technology stack',
    '  projects   - Show list of completed projects',
    '  neofetch   - Display system environment info',
    '  clear      - Clear the console output history',
    '  sudo [...] - Execute superuser command (e.g. sudo make coffee)',
  ]
  helpLines.forEach(l => {
    terminalLines.value.push({ id: lineIdCounter++, text: l, type: 'output' })
  })
}

function printBio() {
  const bioLines = [
    'Ly Kimsun - Backend-Focused Software Engineer',
    '------------------------------------------------',
    'Location: Phnom Penh, Cambodia',
    'Studies : Information Technology and Engineering (RUPP)',
    'Mission : Designing structured, maintainable backend infrastructures, building APIs,',
    '          and implementing security schemas like JWT and RBAC.'
  ]
  bioLines.forEach(l => {
    terminalLines.value.push({ id: lineIdCounter++, text: l, type: 'output' })
  })
}

function printSkills() {
  const skillsLines = [
    '+------------------------------------------------------+',
    '| LANGUAGES  : Python, TypeScript, JavaScript, SQL, C++|',
    '| FRAMEWORKS : Node.js, Express.js, Vue.js, Laravel    |',
    '| DATABASES  : MySQL, PostgreSQL, Redis                |',
    '| OPERATIONS : Docker, Nginx, PM2, Linux, Git, CI/CD   |',
    '+------------------------------------------------------+'
  ]
  skillsLines.forEach(l => {
    terminalLines.value.push({ id: lineIdCounter++, text: l, type: 'success' })
  })
}

function printProjects() {
  const projectLines = [
    'Completed & Active Projects:',
    '  1. ANTPAY - Payment Management System (Node, Express, MySQL)',
    '  2. VETIKA - Student Community Platform (Vue, Node, MySQL)',
    '  3. Smakjit - Volunteer Platform (Next.js, Laravel, MySQL)'
  ]
  projectLines.forEach(l => {
    terminalLines.value.push({ id: lineIdCounter++, text: l, type: 'output' })
  })
}

function printNeofetch() {
  const neo = [
    '        .---.         visitor@kimsun-dev',
    '       /     \\        ------------------',
    '      \\  (o)  /       OS: AntOS v1.0.0 (Vue + Vite)',
    '       `-----\'        Kernel: Vue 3.5.39 / TypeScript',
    '      /       \\       Uptime: Online since Feb 2024',
    '     |  \\___/  |      Shell: kimsun-sh',
    '     \\         /      Memory: 8.64 GB / 16.00 GB (54%)',
    '      `-------\'       CPU: Gemini Core (2 vCPUs @ 2026-07)',
    '                      Theme: Solarized Dark'
  ]
  neo.forEach(l => {
    terminalLines.value.push({ id: lineIdCounter++, text: l, type: 'output' })
  })
}

function handleSudo(args: string[]) {
  if (args.length === 0) {
    terminalLines.value.push({
      id: lineIdCounter++,
      text: 'usage: sudo [command]',
      type: 'error',
    })
    return
  }

  const action = args.join(' ')
  if (action === 'make coffee') {
    terminalLines.value.push({ id: lineIdCounter++, text: '[sudo] password for visitor: *********', type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: 'Password accepted.', type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: 'Executing: make coffee...', type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: 'Error: Coffee pot is empty. Please consult the nearest barista.', type: 'error' })
  } else {
    terminalLines.value.push({ id: lineIdCounter++, text: '[sudo] password for visitor: *********', type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: 'Password accepted.', type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: `Executing: ${action}...`, type: 'output' })
    terminalLines.value.push({ id: lineIdCounter++, text: 'Command executed successfully.', type: 'success' })
  }
}
</script>

<template>
  <div 
    @click="focusInput"
    class="flex-1 flex flex-col bg-black/90 border border-border rounded-panel text-green-400 font-mono text-[14px] leading-relaxed p-4 h-[380px] cursor-text overflow-hidden select-text selection:bg-green-400/20"
  >
    <!-- Terminal Output Panel -->
    <div 
      ref="terminalBody"
      class="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-2"
    >
      <div 
        v-for="line in terminalLines" 
        :key="line.id"
        class="whitespace-pre-wrap break-all"
        :class="[
          line.type === 'input' ? 'text-gray-300' :
          line.type === 'error' ? 'text-red-400 font-medium' :
          line.type === 'success' ? 'text-cyan-400' :
          line.type === 'system' ? 'text-purple-400 font-semibold' :
          'text-green-400'
        ]"
      >
        {{ line.text }}
      </div>
    </div>

    <!-- Terminal Input Line -->
    <div class="flex items-center gap-2 border-t border-border pt-3 mt-2 shrink-0 select-none">
      <span class="text-green-500 font-bold shrink-0">visitor@kimsun-dev:~$</span>
      <input
        ref="inputField"
        v-model="currentInput"
        @keydown.enter="handleCommand"
        @keydown="handleHistoryKey"
        type="text"
        spellcheck="false"
        class="flex-1 bg-transparent border-none text-green-400 font-mono text-[14px] outline-none caret-green-400 p-0 focus:ring-0"
        aria-label="Terminal command input"
      />
    </div>
  </div>
</template>

<style scoped>
/* Remove focus ring from terminal input on tailwind */
input:focus {
  outline: none;
  box-shadow: none;
}
</style>

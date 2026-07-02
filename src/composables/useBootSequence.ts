import { ref, onMounted } from 'vue'
import { i18n } from '@/i18n'
import { useReducedMotion } from './useReducedMotion'

const BOOT_COMPLETE_KEY = 'lk_portfolio_boot_complete'

function getBootLines(): string[] {
  const msg = i18n.global.getLocaleMessage(i18n.global.locale.value) as { boot?: { lines: string[] } }
  return msg?.boot?.lines ?? [
    'BOOT_SEQUENCE v1.0',
    'Initializing Modules...',
    'Loading Portfolio...',
    'Loading Components...',
    'Connecting...',
    'Loading Projects...',
    'Checking Dependencies...',
    'Authentication...',
    'Success.',
  ]
}

export function useBootSequence() {
  const { reducedMotion } = useReducedMotion()
  const visible = ref(false)
  const lines = ref<string[]>([])
  const progress = ref(0)
  const complete = ref(false)

  async function start() {
    visible.value = true

    if (reducedMotion.value) {
      visible.value = false
      complete.value = true
      return
    }

    const bootLines = getBootLines()

    for (let i = 0; i < bootLines.length; i++) {
      lines.value = [...lines.value, bootLines[i]]
      progress.value = ((i + 1) / bootLines.length) * 100
      await new Promise((r) => setTimeout(r, 120))
    }

    await new Promise((r) => setTimeout(r, 400))

    const overlay = document.getElementById('boot-overlay')
    if (overlay) {
      overlay.style.transition = 'opacity 0.4s ease-out'
      overlay.style.opacity = '0'
    }

    await new Promise((r) => setTimeout(r, 400))
    visible.value = false
    complete.value = true
    localStorage.setItem(BOOT_COMPLETE_KEY, 'true')
  }

  function shouldSkip(): boolean {
    return localStorage.getItem(BOOT_COMPLETE_KEY) === 'true'
  }

  onMounted(() => {
    if (!shouldSkip()) {
      start()
    } else {
      complete.value = true
    }
  })

  return { visible, lines, progress, complete }
}

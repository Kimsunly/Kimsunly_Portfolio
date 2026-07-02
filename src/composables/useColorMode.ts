import { ref, computed, watch } from 'vue'

type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-color-mode'

function getStored(): ColorMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'dark'
}

function storeMode(mode: ColorMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

function applyTheme(mode: ColorMode) {
  document.documentElement.setAttribute('data-theme', mode)
}

const _mode = ref<ColorMode>(getStored())

export const colorMode = computed({
  get: () => _mode.value,
  set: (val: ColorMode) => {
    _mode.value = val
  },
})

watch(_mode, (val) => {
  applyTheme(val)
  storeMode(val)
})

applyTheme(_mode.value)

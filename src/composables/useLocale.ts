import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { i18n } from '@/i18n'

const stored = useStorage<'en' | 'km'>('locale', 'en')

export const locale = computed({
  get: () => stored.value,
  set: (val: 'en' | 'km') => {
    stored.value = val
    i18n.global.locale.value = val
    document.documentElement.lang = val
    document.documentElement.dataset.font = val === 'km' ? 'khmer' : ''
  },
})

export function toggleLocale() {
  locale.value = locale.value === 'en' ? 'km' : 'en'
}

// sync initial value
i18n.global.locale.value = stored.value
document.documentElement.lang = stored.value
document.documentElement.dataset.font = stored.value === 'km' ? 'khmer' : ''

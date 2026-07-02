import { ref, onMounted } from 'vue'

const reducedMotion = ref(false)

export function useReducedMotion() {
  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = mq.matches
    mq.addEventListener('change', (e) => {
      reducedMotion.value = e.matches
    })
  })

  return { reducedMotion }
}

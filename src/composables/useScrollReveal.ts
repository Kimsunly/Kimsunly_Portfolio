import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export function useScrollReveal(
  target: Ref<Element | null | undefined>,
  options: {
    onReveal?: () => void
    once?: boolean
    margin?: string
  } = {},
) {
  const { reducedMotion } = useReducedMotion()
  const revealed = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return

    if (reducedMotion.value) {
      revealed.value = true
      options.onReveal?.()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed.value = true
            options.onReveal?.()
            if (options.once !== false) {
              observer?.unobserve(entry.target)
            }
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: options.margin || '-50px',
      },
    )

    observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { revealed }
}

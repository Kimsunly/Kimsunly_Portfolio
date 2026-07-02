import { ref } from 'vue'

export function useCountUp() {
  const count = ref(0)
  let animationId: number | null = null

  function start(from: number, to: number, duration = 800) {
    count.value = from
    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(from + (to - from) * eased)
      count.value = current

      if (progress < 1) {
        animationId = requestAnimationFrame(step)
      }
    }

    animationId = requestAnimationFrame(step)
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  return { count, start, stop }
}

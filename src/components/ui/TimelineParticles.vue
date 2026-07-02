<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = withDefaults(defineProps<{
  progress?: number
}>(), {
  progress: 0,
})

const { reducedMotion } = useReducedMotion()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0

interface Mote {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
  speed: number
}

const motes: Mote[] = []
const COUNT = 18

function init() {
  motes.length = 0
  for (let i = 0; i < COUNT; i++) {
    motes.push({
      x: (Math.random() - 0.5) * 120,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.02 - Math.random() * 0.06,
      size: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.4,
    })
  }
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)

  const activeCount = Math.floor(props.progress * COUNT)
  const centerX = w / 2

  for (let i = 0; i < COUNT; i++) {
    const m = motes[i]
    const isActive = i < activeCount

    m.x += m.vx + Math.sin(t * m.speed + m.phase) * 0.2
    m.y += m.vy
    m.vy -= 0.0003

    if (m.y < -10) {
      m.y = 105
      m.vy = -0.02 - Math.random() * 0.06
      m.x = (Math.random() - 0.5) * 120
    }

    const px = centerX + m.x
    const py = (h / 100) * m.y

    if (py < 0 || py > h) continue

    const alpha = isActive ? 0.5 + Math.sin(t * m.speed + m.phase) * 0.3 : 0.12
    const size = isActive ? m.size : m.size * 0.5

    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = isActive
      ? `rgba(124, 58, 237, ${alpha})`
      : `rgba(42, 42, 42, ${alpha})`
    ctx.fill()

    if (isActive && size > 2) {
      ctx.beginPath()
      ctx.arc(px - size * 0.6, py - size * 0.5, size * 0.35, 0, Math.PI * 2)
      ctx.arc(px + size * 0.6, py - size * 0.5, size * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 0.4})`
      ctx.fill()
    }
  }
}

function loop(ctx: CanvasRenderingContext2D, w: number, h: number) {
  animId = requestAnimationFrame(() => loop(ctx, w, h))
  if (props.progress === 0) return
  const t = performance.now() / 1000
  draw(ctx, w, h, t)
}

onMounted(() => {
  if (reducedMotion.value) return

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const parent = canvas.parentElement
  if (!parent) return

  const resize = () => {
    canvas.width = parent.offsetWidth
    canvas.height = parent.offsetHeight
  }
  resize()
  init()

  const ro = new ResizeObserver(resize)
  ro.observe(parent)

  loop(ctx, canvas.width, canvas.height)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    ro.disconnect()
  })
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
    :style="{ opacity: progress }"
    aria-hidden="true"
  />
</template>

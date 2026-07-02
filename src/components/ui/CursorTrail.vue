<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { reducedMotion } = useReducedMotion()

onMounted(() => {
  if (reducedMotion.value) return

  const canvas = document.createElement('canvas')
  canvas.className = 'fixed inset-0 pointer-events-none z-cursor'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  let w = window.innerWidth
  let h = window.innerHeight
  canvas.width = w
  canvas.height = h

  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let animId: number
  let active = false

  const onMove = (e: MouseEvent) => {
    target.x = e.clientX
    target.y = e.clientY
    if (!active) {
      active = true
      animate()
    }
  }
  document.addEventListener('mousemove', onMove)

  function animate() {
    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08

    ctx.clearRect(0, 0, w, h)

    const g = ctx.createRadialGradient(current.x, current.y, 0, current.x, current.y, 150)
    g.addColorStop(0, 'rgba(124,58,237,0.20)')
    g.addColorStop(0.3, 'rgba(124,58,237,0.10)')
    g.addColorStop(0.6, 'rgba(167,139,250,0.03)')
    g.addColorStop(1, 'rgba(124,58,237,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(current.x, current.y, 150, 0, Math.PI * 2)
    ctx.fill()

    const dx = target.x - current.x
    const dy = target.y - current.y
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      active = false
      return
    }

    animId = requestAnimationFrame(animate)
  }

  const resize = () => {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w
    canvas.height = h
  }
  window.addEventListener('resize', resize)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    document.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', resize)
    canvas.remove()
  })
})
</script>

<template><div style="display:none" aria-hidden="true" /></template>

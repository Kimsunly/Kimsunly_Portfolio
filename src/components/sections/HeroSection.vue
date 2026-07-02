<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui/UiButton.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import InfoPanel from '@/components/ui/InfoPanel.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t, tm } = useI18n()
const { reducedMotion } = useReducedMotion()

const labelRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const statementRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const buttonsRef = ref<HTMLElement | null>(null)
const statusPanelRef = ref<HTMLElement | null>(null)
const vizRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isHeroVisible = ref(true)
const heroSectionRef = ref<HTMLElement | null>(null)
const typedLabel = ref('')

let animFrameId: number | null = null
let threeCleanup: (() => void) | null = null
let observer: IntersectionObserver | null = null

async function initThree() {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const THREE = await import('three')
  
  const rect = canvas.getBoundingClientRect()
  const w = rect.width || 260
  const h = rect.height || 240
  
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.z = 13
  
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  const coreGroup = new THREE.Group()
  scene.add(coreGroup)
  
  // Central crystalline planet/asteroid
  const planetGeo = new THREE.IcosahedronGeometry(2.4, 1)
  const fillMat = new THREE.MeshBasicMaterial({ 
    color: 0x7C3AED, 
    transparent: true, 
    opacity: 0.08,
    depthWrite: false
  })
  const planetMesh = new THREE.Mesh(planetGeo, fillMat)
  coreGroup.add(planetMesh)
  
  const edgesGeo = new THREE.EdgesGeometry(planetGeo)
  const edgeMat = new THREE.LineBasicMaterial({ 
    color: 0x7C3AED, 
    transparent: true, 
    opacity: 0.6 
  })
  const planetWireframe = new THREE.LineSegments(edgesGeo, edgeMat)
  coreGroup.add(planetWireframe)
  
  // Outer rings
  const ringGeo = new THREE.RingGeometry(3.8, 3.83, 64)
  ringGeo.rotateX(Math.PI / 2.3)
  const ringMat = new THREE.LineBasicMaterial({
    color: 0x38BDF8,
    transparent: true,
    opacity: 0.25
  })
  const ring = new THREE.LineLoop(ringGeo, ringMat)
  coreGroup.add(ring)
  
  // Orbiting satellite/capsule
  const satelliteGeo = new THREE.ConeGeometry(0.2, 0.5, 4)
  satelliteGeo.rotateX(Math.PI / 2)
  const satelliteMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
    wireframe: true
  })
  const satellite = new THREE.Mesh(satelliteGeo, satelliteMat)
  coreGroup.add(satellite)
  
  // Cosmic dust particles
  const starCount = 45
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount * 3; i += 3) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    const dist = 4.2 + Math.random() * 4
    starPositions[i] = dist * Math.sin(phi) * Math.cos(theta)
    starPositions[i + 1] = dist * Math.sin(phi) * Math.sin(theta)
    starPositions[i + 2] = dist * Math.cos(phi)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0x7C3AED,
    size: 0.08,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  })
  const stars = new THREE.Points(starGeo, starMat)
  coreGroup.add(stars)
  
  let theta = 0
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }
  
  const onMouseDown = () => { isDragging = true }
  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const deltaMove = {
      x: x - previousMousePosition.x,
      y: y - previousMousePosition.y
    }
    
    if (isDragging) {
      coreGroup.rotation.y += deltaMove.x * 0.007
      coreGroup.rotation.x += deltaMove.y * 0.007
    }
    
    previousMousePosition = { x, y }
  }
  const onMouseUp = () => { isDragging = false }
  
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (width && height) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }
  })
  
  const parent = canvas.parentElement
  if (parent) resizeObserver.observe(parent)
  
  threeCleanup = () => {
    canvas.removeEventListener('mousedown', onMouseDown)
    canvas.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    resizeObserver.disconnect()
    scene.clear()
    renderer.dispose()
  }
  
  function animate() {
    animFrameId = requestAnimationFrame(animate)
    if (!isHeroVisible.value) return
    
    if (!isDragging && !reducedMotion.value) {
      coreGroup.rotation.y += 0.002
      planetWireframe.rotation.x += 0.0006
      planetWireframe.rotation.y += 0.001
    }
    
    if (!reducedMotion.value) {
      theta += 0.012
    }
    
    const radiusX = 3.8
    const radiusZ = 2.4
    satellite.position.x = radiusX * Math.cos(theta)
    satellite.position.z = radiusZ * Math.sin(theta)
    satellite.position.y = radiusZ * Math.sin(theta) * 0.35
    satellite.rotation.y = -theta + Math.PI / 2
    
    renderer.render(scene, camera)
  }
  
  animate()
}

onMounted(() => {
  initThree()

  if (heroSectionRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible.value = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(heroSectionRef.value)
  }

  if (reducedMotion.value) {
    reveal(titleRef.value, 0)
    reveal(subtitleRef.value, 0)
    reveal(statementRef.value, 0)
    reveal(descriptionRef.value, 0)
    reveal(buttonsRef.value, 0)
    reveal(statusPanelRef.value, 0)
    reveal(vizRef.value, 0)
    return
  }

  const labelText = t('hero.label')
  let charIndex = 0
  const typeInterval = setInterval(() => {
    if (charIndex < labelText.length) {
      typedLabel.value += labelText[charIndex]
      charIndex++
    } else {
      clearInterval(typeInterval)
    }
  }, 40)

  const delay = 200

  function reveal(el: HTMLElement | null, d: number) {
    setTimeout(() => {
      if (el) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
    }, d)
  }

  setTimeout(() => reveal(titleRef.value, 0), labelText.length * 40 + 100)
  reveal(subtitleRef.value, delay * 2)
  reveal(statementRef.value, delay * 3)
  reveal(descriptionRef.value, delay * 4)
  reveal(buttonsRef.value, delay * 5)
  reveal(statusPanelRef.value, delay * 6)
  reveal(vizRef.value, delay * 7)
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (threeCleanup) threeCleanup()
  if (observer) observer.disconnect()
})
</script>

<template>
  <section ref="heroSectionRef" class="relative overflow-hidden" aria-label="Hero">
    <div class="mx-auto max-w-maximum px-24 sm:px-16 md:px-32">
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-24 py-56 sm:py-64 md:py-80 lg:py-96">
        <div class="max-w-[640px]">
          <div ref="labelRef" class="transition-opacity duration-300">
            <UiLabel variant="section" class="mb-6 block">
              <span class="font-mono">{{ typedLabel }}<span v-if="typedLabel.length < t('hero.label').length" class="animate-pulse">_</span></span>
            </UiLabel>
          </div>

          <h1 ref="titleRef" class="text-display-hero font-bold text-text-primary leading-[110%] tracking-[-0.02em] transition-all duration-500" style="opacity: 0; transform: translateY(24px)">
            {{ t('hero.name') }}
          </h1>

          <p ref="subtitleRef" class="text-h4 font-medium text-text-secondary mt-16 transition-all duration-400" style="opacity: 0; transform: translateY(16px)">
            {{ t('hero.subtitle') }}
          </p>

          <p ref="statementRef" class="text-body-lg text-text-secondary mt-16 leading-[160%] max-w-[560px] transition-all duration-400" style="opacity: 0; transform: translateY(16px)">
            {{ t('hero.statement') }}
          </p>

          <p ref="descriptionRef" class="text-body text-text-muted mt-12 leading-[160%] max-w-[520px] transition-all duration-400" style="opacity: 0; transform: translateY(12px)">
            {{ t('hero.description') }}
          </p>

          <div ref="buttonsRef" class="flex items-center gap-4 mt-16 transition-all duration-400" style="opacity: 0; transform: translateY(16px)">
            <UiButton variant="primary" arrow href="#projects">
              {{ t('hero.exploreProjects') }}
            </UiButton>
            <UiButton variant="secondary" arrow href="/Ly-Kimsun-Backend-Software-Engineer-Resume.pdf">
              {{ t('hero.viewResume') }}
            </UiButton>
          </div>
        </div>

        <div ref="statusPanelRef" class="shrink-0 w-full lg:w-[560px] transition-all duration-400" style="opacity: 0; transform: translateY(12px)">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoPanel :label="t('hero.statusLabel')" accent class="sm:col-span-2">
              <div class="flex items-center gap-3">
                <span class="relative inline-flex h-2 w-2 rounded-full bg-success before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-40 before:bg-success" aria-hidden="true" />
                <span class="text-body font-medium text-success">{{ t('hero.available') }}</span>
              </div>
              <div class="space-y-1 mt-3">
                <p class="text-small text-text-muted">
                  <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('hero.looking') }} </span>
                  {{ t('hero.lookingValue') }}
                </p>
                <p class="text-small text-text-muted">
                  <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('hero.location') }} </span>
                  {{ t('hero.locationValue') }}
                </p>
                <p class="text-small text-text-muted">
                  <span class="font-mono text-tech-label uppercase tracking-[0.08em] text-text-secondary">{{ t('hero.focus') }} </span>
                  {{ t('hero.focusValue') }}
                </p>
              </div>
            </InfoPanel>

            <InfoPanel :label="t('hero.renderingLabel')">
              <ul class="space-y-2">
                <li
                  v-for="item in tm('hero.renderingItems')"
                  :key="item"
                  class="text-small text-text-muted font-mono tracking-[0.02em]"
                >
                  &gt; {{ item }}
                </li>
              </ul>
            </InfoPanel>

            <div ref="vizRef" class="relative border border-border rounded-panel bg-surface flex flex-col min-h-[220px] transition-all duration-500 overflow-hidden" style="opacity: 0; transform: scale(0.98)">
              <!-- 3D Canvas -->
              <canvas ref="canvasRef" class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
              
              <!-- Dashboard Indicators Overlay -->
              <div class="relative z-10 p-5 flex flex-col justify-between h-full min-h-[220px] pointer-events-none select-none">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <span class="relative flex h-1.5 w-1.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    Orbital Thread Monitor
                  </span>
                  <span class="font-mono text-[9px] text-text-muted bg-surface-elevated border border-border px-2.5 py-0.5 rounded">
                    LOD: HIGH
                  </span>
                </div>
                
                <div class="mt-auto">
                  <p class="text-[10px] text-text-muted font-mono bg-surface-elevated/70 backdrop-blur-sm border border-border rounded px-2 py-1 inline-block">
                    Interactive: Drag to orbit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

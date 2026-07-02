<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionContainer from '@/components/ui/SectionContainer.vue'
import UiLabel from '@/components/ui/UiLabel.vue'
import UiHeading from '@/components/ui/UiHeading.vue'
import EditorialQuote from '@/components/ui/EditorialQuote.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t } = useI18n()
const { reducedMotion } = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const visible = ref(false)
const isTechStackVisible = ref(false)
let sceneInitialized = false
const floatX = ref(0)
const floatY = ref(0)
const winW = ref(0)
const winH = ref(0)
let animCleanup: (() => void) | null = null

onMounted(() => {
  if (!sectionRef.value || !canvasRef.value) return

  winW.value = window.innerWidth
  winH.value = window.innerHeight

  const onMouse = (e: MouseEvent) => {
    floatX.value = (e.clientX / winW.value - 0.5) * 16
    floatY.value = (e.clientY / winH.value - 0.5) * 10
  }
  document.addEventListener('mousemove', onMouse)

  const observer = new IntersectionObserver(
    ([entry]) => {
      isTechStackVisible.value = entry.isIntersecting
      if (entry.isIntersecting) {
        visible.value = true
        if (!reducedMotion.value && !sceneInitialized) {
          sceneInitialized = true
          initScene()
        }
      }
    },
    { threshold: 0.05 },
  )

  observer.observe(sectionRef.value)

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouse)
    observer.disconnect()
    if (animCleanup) animCleanup()
  })
})

async function initScene() {
  const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
    import('three'),
    import('three/examples/jsm/postprocessing/EffectComposer.js'),
    import('three/examples/jsm/postprocessing/RenderPass.js'),
    import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
    import('three/examples/jsm/postprocessing/OutputPass.js'),
  ])

  const canvas = canvasRef.value!
  const parent = canvas.parentElement!
  let w = parent.clientWidth
  let h = parent.clientHeight

  const scene = new THREE.Scene()
  const world = new THREE.Group()
  scene.add(world)
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
  camera.position.set(0, 0, 150)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.1)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  function makeGlowTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas')
    c.width = 128; c.height = 128
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(124,58,237,0.35)')
    g.addColorStop(0.25, 'rgba(124,58,237,0.1)')
    g.addColorStop(1, 'rgba(124,58,237,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }

  function createGeoShape(
    geo: THREE.BufferGeometry,
    fillColor: number,
    fillAlpha: number,
    edgeColor: number,
    edgeAlpha: number,
  ) {
    const g = new THREE.Group()
    const fillMat = new THREE.MeshBasicMaterial({ color: fillColor, transparent: true, opacity: fillAlpha, depthWrite: false })
    g.add(new THREE.Mesh(geo, fillMat))
    const edges = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeAlpha, depthWrite: false })
    g.add(new THREE.LineSegments(edges, edgeMat))
    return g
  }

  const shapeDefs = [
    { geo: new THREE.TorusKnotGeometry(13, 4.5, 80, 12), fc: 0x7C3AED, fa: 0.06, ec: 0x7C3AED, ea: 0.75, rot: { x: 0.002, y: 0.006, z: 0.001 } },
    { geo: new THREE.DodecahedronGeometry(9), fc: 0xA78BFA, fa: 0.05, ec: 0xA78BFA, ea: 0.55, rot: { x: 0.004, y: -0.005, z: 0.002 },
      orbit: { rx: 48, rz: 48, sx: 0.12, sz: 0.15, ox: 0, oz: Math.PI / 3 },
      float: { speed: 0.3, amp: 8, base: 10 } },
    { geo: new THREE.IcosahedronGeometry(8), fc: 0x38BDF8, fa: 0.04, ec: 0x38BDF8, ea: 0.4, rot: { x: -0.003, y: 0.007, z: -0.001 },
      orbit: { rx: 55, rz: 55, sx: -0.09, sz: -0.11, ox: Math.PI * 2 / 3, oz: 0 },
      float: { speed: 0.2, amp: 6, base: -8 } },
    { geo: new THREE.OctahedronGeometry(7), fc: 0xF472B6, fa: 0.04, ec: 0xF472B6, ea: 0.35, rot: { x: 0.005, y: -0.003, z: 0.002 },
      orbit: { rx: 38, rz: 38, sx: 0.14, sz: 0.12, ox: Math.PI / 2, oz: Math.PI / 4 },
      float: { speed: 0.25, amp: 10, base: -5 } },
    { geo: new THREE.TorusGeometry(10, 3, 24, 48), fc: 0x6D28D9, fa: 0.05, ec: 0x6D28D9, ea: 0.4, rot: { x: 0.006, y: -0.004, z: 0.003 },
      orbit: { rx: 42, rz: 42, sx: -0.08, sz: -0.1, ox: Math.PI / 4, oz: Math.PI * 2 / 3 },
      float: { speed: 0.35, amp: 7, base: 6 } },
    { geo: new THREE.SphereGeometry(5, 16, 12), fc: 0xC4B5FD, fa: 0.06, ec: 0xC4B5FD, ea: 0.3, rot: { x: 0.001, y: 0.004, z: 0.001 },
      orbit: { rx: 60, rz: 60, sx: 0.1, sz: 0.08, ox: Math.PI * 1.5, oz: Math.PI * 0.5 },
      float: { speed: 0.4, amp: 5, base: 12 } },
  ]

  const shapeNodes = shapeDefs.map((d) => {
    const g = createGeoShape(d.geo, d.fc, d.fa, d.ec, d.ea)
    world.add(g)
    return { group: g, rot: d.rot, orbit: (d as any).orbit, float: (d as any).float }
  })

  const starCount = 400
  const starPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 800
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const starMat = new THREE.PointsMaterial({ color: 0x7C3AED, size: 0.35, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })
  const stars = new THREE.Points(starGeo, starMat)
  world.add(stars)

  const deepCount = 80
  const deepPos = new Float32Array(deepCount * 3)
  for (let i = 0; i < deepCount * 3; i++) deepPos[i] = (Math.random() - 0.5) * 1200
  const deepGeo = new THREE.BufferGeometry()
  deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPos, 3))
  const deepMat = new THREE.PointsMaterial({ color: 0x6D28D9, size: 1.5, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending })
  const deepStars = new THREE.Points(deepGeo, deepMat)
  world.add(deepStars)

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.4, depthWrite: false }))
  glow.scale.set(110, 110, 1)
  world.add(glow)

  const meshes = shapeNodes.map(s => s.group.children[0] as THREE.Mesh)
  const raycaster = new THREE.Raycaster()
  const pointerVec = new THREE.Vector2()
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const intersectPt = new THREE.Vector3()
  const dragOffset = new THREE.Vector3()

  let selected: (typeof shapeNodes)[0] | null = null
  let isDragging = false
  let hovered: (typeof shapeNodes)[0] | null = null

  const savedOrbit = new Map<(typeof shapeNodes)[0], (typeof shapeNodes)[0]['orbit']>()
  const savedFloat = new Map<(typeof shapeNodes)[0], (typeof shapeNodes)[0]['float']>()

  function getNDC(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
    }
  }

  function pickShape(ndc: { x: number; y: number }) {
    pointerVec.set(ndc.x, ndc.y)
    raycaster.setFromCamera(pointerVec, camera)
    const hits = raycaster.intersectObjects(meshes)
    if (hits.length > 0) {
      return shapeNodes.find(s => s.group.children[0] === hits[0].object) || null
    }
    return null
  }

  function onPointerDown(e: PointerEvent) {
    const ndc = getNDC(e.clientX, e.clientY)
    const hit = pickShape(ndc)
    if (hit) {
      selected = hit
      isDragging = true
      raycaster.ray.intersectPlane(dragPlane, intersectPt)
      dragOffset.copy(intersectPt).sub(selected.group.position)
      savedOrbit.set(selected, selected.orbit)
      selected.orbit = null
      savedFloat.set(selected, selected.float)
      selected.float = null
      canvas.style.cursor = 'grabbing'
      canvas.setPointerCapture(e.pointerId)
    }
  }

  function onPointerMove(e: PointerEvent) {
    const ndc = getNDC(e.clientX, e.clientY)

    if (isDragging && selected) {
      pointerVec.set(ndc.x, ndc.y)
      raycaster.setFromCamera(pointerVec, camera)
      raycaster.ray.intersectPlane(dragPlane, intersectPt)
      if (intersectPt) {
        selected.group.position.copy(intersectPt.clone().sub(dragOffset))
      }
      return
    }

    mouse.x = (e.clientX / w - 0.5) * 2
    mouse.y = -(e.clientY / h - 0.5) * 2

    const hit = pickShape(ndc)
    if (hit !== hovered) {
      hovered = hit
      canvas.style.cursor = hovered ? 'grab' : 'default'
    }
  }

  function onPointerUp() {
    if (selected) {
      savedOrbit.delete(selected)
      savedFloat.delete(selected)
    }
    selected = null
    isDragging = false
    canvas.style.cursor = hovered ? 'grab' : 'default'
  }

  const mouse = { x: 0, y: 0 }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerUp)
  canvas.style.cursor = 'default'

  let animId: number | null = null
  let time = 0

  function animate() {
    animId = requestAnimationFrame(animate)
    if (!isTechStackVisible.value) return
    time += 0.016

    world.position.x = Math.sin(time * 0.12) * 30

    for (const s of shapeNodes) {
      s.group.rotation.x += s.rot.x
      s.group.rotation.y += s.rot.y
      s.group.rotation.z += s.rot.z

      if (s.orbit) {
        const xa = time * s.orbit.sx + s.orbit.ox
        const za = time * s.orbit.sz + s.orbit.oz
        s.group.position.x = Math.cos(xa) * s.orbit.rx
        s.group.position.z = Math.sin(za) * s.orbit.rz
        if (s.float) s.group.position.y = s.float.base + Math.sin(time * s.float.speed) * s.float.amp
      }
    }

    camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)

    stars.rotation.y += 0.00015
    bloom.strength = 0.4 + Math.sin(time * 0.3) * 0.12

    composer.render()
  }

  animate()

  const resize = () => {
    w = parent.clientWidth
    h = parent.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    composer.setSize(w, h)
  }
  window.addEventListener('resize', resize)

  animCleanup = () => {
    if (animId) cancelAnimationFrame(animId)
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerUp)
    renderer.dispose()
    window.removeEventListener('resize', resize)
  }
}

interface TechItem {
  name: string
  slug: string
  color: string
  learning?: boolean
}

const pyramid: TechItem[][] = [
  [
    { name: 'Postman', slug: 'postman', color: '#FF6C37' },
    { name: 'Docker', slug: 'docker', color: '#2496ED' },
    { name: 'Linux', slug: 'linux', color: '#FCC624' },
    { name: 'Nginx', slug: 'nginx', color: '#009639' },
    { name: 'AWS', slug: 'amazonwebservices', color: '#FF9900', learning: true },
    { name: 'GitHub Actions', slug: 'githubactions', color: '#2088FF', learning: true },
    { name: 'Figma', slug: 'figma', color: '#F24E1E' },
  ],
  [
    { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1', learning: true },
    { name: 'MongoDB', slug: 'mongodb', color: '#47A248', learning: true },
    { name: 'Redis', slug: 'redis', color: '#DC382D', learning: true },
    { name: 'Git', slug: 'git', color: '#F05032' },
    { name: 'VS Code', slug: 'visualstudiocode', color: '#007ACC' },
  ],
  [
    { name: 'Python', slug: 'python', color: '#3776AB' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
    { name: 'MySQL', slug: 'mysql', color: '#4479A1' },
  ],
  [
    { name: 'Next.js', slug: 'nextdotjs', color: '#000000' },
    { name: 'Vue.js', slug: 'vuedotjs', color: '#4FC08D' },
    { name: 'Node.js', slug: 'nodedotjs', color: '#339933' },
    { name: 'Express.js', slug: 'express', color: '#000000' },
  ],
  [
    { name: 'Vitest', slug: 'vitest', color: '#6E9F18', learning: true },
    { name: 'NestJS', slug: 'nestjs', color: '#E0234E', learning: true },
    { name: 'React', slug: 'react', color: '#61DAFB', learning: true },
  ],
  [
    { name: 'GraphQL', slug: 'graphql', color: '#E535AB', learning: true },
    { name: 'Prisma', slug: 'prisma', color: '#2D3748', learning: true },
  ],
]

function iconUrl(slug: string, color: string) {
  return `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`
}

function iconOnError(e: Event) {
  const img = e.currentTarget as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <section
    id="technology"
    ref="sectionRef"
    class="relative overflow-hidden py-40 md:py-30 sm:py-24"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full touch-none"
      aria-hidden="true"
    />

    <div class="mx-auto px-8 max-w-maximum relative z-10 pointer-events-none">
      <div
        ref="contentRef"
        :style="visible && !reducedMotion ? {
          transform: `translate(${floatX}px, ${floatY}px)`,
          transition: 'transform 0.15s ease-out',
        } : {}"
      >
        <UiLabel variant="section" :class="[visible ? 'animate-reveal' : 'opacity-0']">
          {{ t('techStack.label') }}
        </UiLabel>

        <UiHeading level="h2" :class="['mt-4', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '100ms' : '0ms' }">
          {{ t('techStack.heading') }}
        </UiHeading>

        <p :class="['text-body text-text-muted mt-4 max-w-[640px]', visible ? 'animate-reveal' : 'opacity-0']" :style="{ transitionDelay: visible ? '200ms' : '0ms' }">
          {{ t('techStack.description') }}
        </p>

        <EditorialQuote :text="t('techStack.quote')" position="center" />

        <div class="flex flex-col items-center gap-4 mt-12">
          <div
            v-for="(row, ri) in pyramid"
            :key="ri"
            class="flex flex-wrap gap-4 justify-center"
          >
            <div
              v-for="tech in row"
              :key="tech.name"
              class="flex flex-col items-center gap-3 px-4 py-5 border border-border bg-surface rounded-card hover:border-primary/40 hover:bg-surface-elevated transition-all duration-150 min-w-[100px] pointer-events-auto"
            >
              <img
                :src="iconUrl(tech.slug, tech.color)"
                :alt="tech.name"
                class="w-9 h-9"
                loading="lazy"
                width="36"
                height="36"
                @error="iconOnError"
              />
              <span class="text-small text-text-muted font-medium text-center leading-snug">{{ tech.name }}</span>
              <span
                v-if="tech.learning"
                class="font-mono text-[10px] uppercase tracking-[0.08em] text-primary/60 border border-primary/20 rounded-badge px-2 py-0.5 leading-none"
              >
                {{ t('techStack.learning') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

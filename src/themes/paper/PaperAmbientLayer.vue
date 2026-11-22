<!-- 文件名: src/themes/paper/PaperAmbientLayer.vue -->
<!-- 纸境主题专属环境层：15秒无操作全屏手绘休眠壁纸（日常态 v-if 完全不挂载 DOM 与 Canvas，单次延时器零轮询唤醒，与主视图彻底解耦） -->
<template>
  <div
    v-if="isSleeping"
    class="paper-screensaver-layer fixed inset-0 z-[70] overflow-hidden bg-[#f4efe2]"
    @mousemove="handleWake"
    @mousedown="handleWake"
    @wheel.passive="handleWake"
  >
    <img
      :src="sceneryUrl"
      alt=""
      class="w-full h-full object-cover select-none pointer-events-none"
    />
    <canvas ref="sceneryCanvasRef" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import sceneryUrl from '../../assets/themes/paper_idle_scenery.jpg'

const props = defineProps<{
  activeView: string
  performanceMode: boolean
  isBusy?: boolean
}>()

const emit = defineEmits<{
  (e: 'sleep-change', sleeping: boolean): void
}>()

const IDLE_THRESHOLD_MS = 15000

const isSleeping = ref(false)
const sceneryCanvasRef = ref<HTMLCanvasElement | null>(null)

let isUnmounted = false
let idleTimeoutId: ReturnType<typeof setTimeout> | null = null
let lastActivityResetAt = 0
let sceneryRaf = 0
let lastSceneryDraw = 0
let winW = 0
let winH = 0
let dpr = 1

let cloudSprites: HTMLCanvasElement[] | null = null

function makeCloudSprite(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  if (!g) return c
  const puffs: Array<[number, number, number, string]> = [
    [w * 0.24, h * 0.58, h * 0.30, 'rgba(205, 218, 212, 0.38)'],
    [w * 0.50, h * 0.54, h * 0.36, 'rgba(205, 218, 212, 0.40)'],
    [w * 0.74, h * 0.60, h * 0.28, 'rgba(205, 218, 212, 0.36)'],
    [w * 0.28, h * 0.48, h * 0.28, 'rgba(250, 244, 224, 0.62)'],
    [w * 0.52, h * 0.40, h * 0.34, 'rgba(253, 248, 234, 0.68)'],
    [w * 0.70, h * 0.48, h * 0.26, 'rgba(248, 236, 204, 0.56)']
  ]
  for (const [cx, cy, r, col] of puffs) {
    const rg = g.createRadialGradient(cx, cy, r * 0.15, cx, cy, r)
    rg.addColorStop(0, col)
    rg.addColorStop(0.75, col.replace(/[\d.]+\)$/, '0.22)'))
    rg.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = rg
    g.beginPath()
    g.arc(cx, cy, r, 0, Math.PI * 2)
    g.fill()
  }
  return c
}

function ensureCloudSprites(): HTMLCanvasElement[] {
  if (!cloudSprites) {
    cloudSprites = [
      makeCloudSprite(340, 125),
      makeCloudSprite(250, 98),
      makeCloudSprite(400, 136)
    ]
  }
  return cloudSprites
}

const driftingClouds = [
  { x: -80, yRatio: 0.04, speed: 0.18, spriteIdx: 0, alpha: 0.56 },
  { x: 360, yRatio: 0.11, speed: 0.28, spriteIdx: 1, alpha: 0.46 },
  { x: 820, yRatio: 0.03, speed: 0.14, spriteIdx: 2, alpha: 0.52 },
  { x: 160, yRatio: 0.20, speed: 0.32, spriteIdx: 1, alpha: 0.40 },
  { x: 1020, yRatio: 0.16, speed: 0.22, spriteIdx: 0, alpha: 0.44 }
]

const petals = Array.from({ length: 14 }, (_, i) => ({
  x: Math.random() * 1440,
  y: Math.random() * 900,
  vx: 0.42 + Math.random() * 0.5,
  vy: 0.16 + Math.random() * 0.22,
  rot: Math.random() * Math.PI * 2,
  vrot: (Math.random() - 0.5) * 0.028,
  rx: 4.0 + Math.random() * 2.4,
  ry: 2.2 + Math.random() * 1.4,
  color: i % 3 === 0 ? 'rgba(252, 243, 219, 0.86)' : (i % 3 === 1 ? 'rgba(168, 186, 120, 0.78)' : 'rgba(166, 192, 179, 0.70)')
}))

function syncCanvasSizes() {
  winW = Math.max(1, window.innerWidth)
  winH = Math.max(1, window.innerHeight)
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const c = sceneryCanvasRef.value
  if (c) {
    c.width = Math.floor(winW * dpr)
    c.height = Math.floor(winH * dpr)
  }
}

function stopSceneryLoop() {
  if (sceneryRaf) {
    cancelAnimationFrame(sceneryRaf)
    sceneryRaf = 0
  }
}

function stepScenery(now: number) {
  if (!isSleeping.value || props.performanceMode || document.hidden) {
    sceneryRaf = 0
    return
  }
  sceneryRaf = requestAnimationFrame(stepScenery)
  if (now - lastSceneryDraw < 33) return
  lastSceneryDraw = now

  const c = sceneryCanvasRef.value
  const ctx = c?.getContext('2d')
  if (!c || !ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, winW, winH)

  const sprites = ensureCloudSprites()
  for (const cl of driftingClouds) {
    const sp = sprites[cl.spriteIdx]
    cl.x += cl.speed
    if (cl.x > winW + 40) cl.x = -sp.width - 40
    ctx.globalAlpha = cl.alpha
    ctx.drawImage(sp, cl.x, Math.round(winH * cl.yRatio))
  }
  ctx.globalAlpha = 1

  for (const p of petals) {
    p.x += p.vx
    p.y += p.vy + Math.sin(now * 0.0014 + p.x * 0.01) * 0.18
    p.rot += p.vrot
    if (p.x > winW + 20) p.x = -20
    if (p.y > winH + 20) {
      p.y = -15
      p.x = Math.random() * winW * 0.7
    }
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function clearIdleTimeout() {
  if (idleTimeoutId) {
    clearTimeout(idleTimeoutId)
    idleTimeoutId = null
  }
}

function hasBlockingOverlay(): boolean {
  return !!document.querySelector('.swal2-container, body > .fixed.inset-0')
}

function isSleepBlocked(): boolean {
  return (
    props.performanceMode ||
    props.activeView === 'hajimi_beat' ||
    (props.activeView === 'transmissions' && !!props.isBusy) ||
    document.hidden
  )
}

function scheduleIdleSleep(force = false) {
  if (isSleepBlocked() || isSleeping.value) {
    clearIdleTimeout()
    return
  }
  const now = performance.now()
  if (!force && idleTimeoutId && now - lastActivityResetAt < 600) {
    return
  }
  lastActivityResetAt = now
  clearIdleTimeout()
  idleTimeoutId = setTimeout(() => {
    idleTimeoutId = null
    enterSleep()
  }, IDLE_THRESHOLD_MS)
}

async function enterSleep() {
  if (isUnmounted || isSleepBlocked() || isSleeping.value) return
  if (hasBlockingOverlay()) {
    scheduleIdleSleep(true)
    return
  }
  isSleeping.value = true
  emit('sleep-change', true)
  await nextTick()
  if (isUnmounted || !isSleeping.value) return
  if (isSleepBlocked() || hasBlockingOverlay()) {
    handleWake()
    return
  }
  syncCanvasSizes()
  if (!sceneryRaf) {
    lastSceneryDraw = 0
    sceneryRaf = requestAnimationFrame(stepScenery)
  }
}

function handleWake() {
  if (isSleeping.value) {
    isSleeping.value = false
    stopSceneryLoop()
    const c = sceneryCanvasRef.value
    if (c) {
      c.width = 0
      c.height = 0
    }
    emit('sleep-change', false)
  }
  scheduleIdleSleep(true)
}

function onWindowMouseMove() {
  if (isSleeping.value) {
    handleWake()
    return
  }
  scheduleIdleSleep(false)
}

function onWindowKeyDown() {
  handleWake()
}

function onWindowResize() {
  if (isSleeping.value) {
    syncCanvasSizes()
  }
}

function onVisibilityChange() {
  if (document.hidden) {
    clearIdleTimeout()
    stopSceneryLoop()
  } else if (isSleeping.value && !props.performanceMode && !sceneryRaf) {
    syncCanvasSizes()
    sceneryRaf = requestAnimationFrame(stepScenery)
  } else {
    scheduleIdleSleep(true)
  }
}

watch(() => props.performanceMode, (perf) => {
  if (perf) {
    clearIdleTimeout()
    handleWake()
  } else {
    scheduleIdleSleep(true)
  }
})

watch(() => props.activeView, (view) => {
  if (view === 'hajimi_beat' || (view === 'transmissions' && props.isBusy)) {
    clearIdleTimeout()
    handleWake()
  } else {
    scheduleIdleSleep(true)
  }
})

watch(() => props.isBusy, (busy) => {
  if (props.activeView === 'transmissions') {
    if (busy) {
      clearIdleTimeout()
      handleWake()
    } else {
      scheduleIdleSleep(true)
    }
  }
})

onMounted(() => {
  isUnmounted = false
  window.addEventListener('mousemove', onWindowMouseMove, { passive: true })
  window.addEventListener('mousedown', handleWake, { passive: true })
  window.addEventListener('wheel', handleWake, { passive: true })
  window.addEventListener('keydown', onWindowKeyDown)
  window.addEventListener('resize', onWindowResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  scheduleIdleSleep(true)
})

onUnmounted(() => {
  isUnmounted = true
  clearIdleTimeout()
  window.removeEventListener('mousemove', onWindowMouseMove)
  window.removeEventListener('mousedown', handleWake)
  window.removeEventListener('wheel', handleWake)
  window.removeEventListener('keydown', onWindowKeyDown)
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)

  stopSceneryLoop()
  const c = sceneryCanvasRef.value
  if (c) {
    c.width = 0
    c.height = 0
  }
  if (cloudSprites) {
    for (const sp of cloudSprites) {
      sp.width = 0
      sp.height = 0
    }
    cloudSprites = null
  }
  if (isSleeping.value) {
    isSleeping.value = false
    emit('sleep-change', false)
  }
})
</script>

<style scoped>
.paper-screensaver-layer {
  animation: fadeIn 0.45s ease-out forwards;
}
</style>

<!-- 文件名: src/themes/anime/SakuraClickFx.vue -->
<!-- 初樱气泡主题 · 萌系鼠标点击樱花瓣与果冻气泡绽放特效层 (零常驻 rAF 开销、零内存泄漏) -->
<template>
  <div class="pointer-events-none fixed inset-0 z-[9990] overflow-hidden select-none" aria-hidden="true">
    <!-- 环境柔光微泡（纯 CSS 硬件合成层，营造甜美通透的二次元空气感） -->
    <div v-if="!performanceMode" class="absolute inset-0 pointer-events-none">
      <div class="sakura-ambient-orb orb-1"></div>
      <div class="sakura-ambient-orb orb-2"></div>
      <div class="sakura-ambient-orb orb-3"></div>
    </div>

    <!-- 鼠标点击绽放的花瓣与果冻小气泡 -->
    <div
      v-for="burst in bursts"
      :key="burst.id"
      class="absolute left-0 top-0"
      :style="{ transform: `translate3d(${burst.x}px, ${burst.y}px, 0)` }"
    >
      <!-- 点击中心果冻水波圈 -->
      <span class="sakura-ripple"></span>

      <!-- 飞散的花瓣与小气泡粒子 -->
      <span
        v-for="p in burst.particles"
        :key="p.id"
        class="sakura-particle"
        :style="{
          '--tx': `${p.tx}px`,
          '--ty': `${p.ty}px`,
          '--rot': `${p.rot}deg`,
          '--scale': p.scale,
          '--dur': `${p.dur}ms`
        }"
      >
        <!-- 樱花花瓣 SVG -->
        <svg
          v-if="p.kind === 'petal'"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          class="drop-shadow-[0_2px_4px_rgba(255,126,179,0.35)]"
        >
          <path
            d="M12 2C8.5 5.2 6 9.4 6 13.5C6 17.8 8.7 21 12 21C15.3 21 18 17.8 18 13.5C18 9.4 15.5 5.2 12 2ZM12 5.2C13.2 4.1 14.5 4.2 15.2 5.1"
            :fill="p.color"
          />
          <path
            d="M12 2C10.8 4.4 11.2 6.2 12 7.2C12.8 6.2 13.2 4.4 12 2Z"
            fill="#FFF5F9"
            opacity="0.75"
          />
        </svg>

        <!-- Q弹透明果冻气泡 -->
        <span
          v-else-if="p.kind === 'bubble'"
          class="sakura-mini-bubble"
          :style="{ borderColor: p.color }"
        ></span>

        <!-- 甜心小星芒 -->
        <svg
          v-else
          width="11"
          height="11"
          viewBox="0 0 24 24"
          :fill="p.color"
          class="drop-shadow-[0_1px_3px_rgba(255,140,188,0.45)]"
        >
          <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  performanceMode?: boolean
}>()

interface Particle {
  id: number
  kind: 'petal' | 'bubble' | 'sparkle'
  tx: number
  ty: number
  rot: number
  scale: number
  dur: number
  color: string
}

interface Burst {
  id: number
  x: number
  y: number
  particles: Particle[]
}

const bursts = ref<Burst[]>([])
const activeTimers = new Set<ReturnType<typeof setTimeout>>()
let nextBurstId = 1
const MAX_BURSTS = 6
const COLORS = ['#FF7EB3', '#FF99C8', '#FFB3D6', '#F472B6', '#FDA4AF']

function handleWindowMouseDown(e: MouseEvent) {
  if (props.performanceMode || document.hidden) return
  // 内置小游戏全屏游玩时不触发花瓣，避免遮挡准星
  if (document.querySelector('.paper-exempt-minigame')) return

  const id = nextBurstId++
  const count = 7
  const particles: Particle[] = []
  const baseAngle = Math.random() * Math.PI * 2

  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (i * Math.PI * 2) / count + (Math.random() - 0.5) * 0.45
    const dist = 22 + Math.random() * 28
    const kind: Particle['kind'] = i % 3 === 0 ? 'bubble' : (i % 3 === 1 ? 'petal' : 'sparkle')
    particles.push({
      id: i,
      kind,
      tx: Math.round(Math.cos(angle) * dist),
      ty: Math.round(Math.sin(angle) * dist - 6),
      rot: Math.round((Math.random() - 0.5) * 220),
      scale: Number((0.75 + Math.random() * 0.45).toFixed(2)),
      dur: Math.round(480 + Math.random() * 140),
      color: COLORS[i % COLORS.length]
    })
  }

  const next = bursts.value.length >= MAX_BURSTS
    ? [...bursts.value.slice(bursts.value.length - MAX_BURSTS + 1), { id, x: e.clientX, y: e.clientY, particles }]
    : [...bursts.value, { id, x: e.clientX, y: e.clientY, particles }]
  bursts.value = next

  const timer = setTimeout(() => {
    activeTimers.delete(timer)
    bursts.value = bursts.value.filter(b => b.id !== id)
  }, 640)
  activeTimers.add(timer)
}

onMounted(() => {
  window.addEventListener('mousedown', handleWindowMouseDown, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousedown', handleWindowMouseDown)
  activeTimers.forEach(t => clearTimeout(t))
  activeTimers.clear()
  bursts.value = []
})
</script>

<style scoped>
.sakura-ripple {
  position: absolute;
  left: -13px;
  top: -13px;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 133, 179, 0.55);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 182, 214, 0.2) 60%, transparent 100%);
  animation: sakuraRippleOut 460ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.sakura-particle {
  position: absolute;
  left: -7px;
  top: -7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  animation: sakuraParticleFly var(--dur, 540ms) cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.sakura-mini-bubble {
  width: 11px;
  height: 11px;
  border-radius: 9999px;
  border: 1.5px solid #FF85B3;
  background: radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.5) 28%, rgba(255, 172, 208, 0.25) 70%, rgba(255, 133, 179, 0.4) 100%);
  box-shadow: 0 2px 6px rgba(255, 126, 179, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.9);
}

@keyframes sakuraRippleOut {
  0% {
    transform: scale(0.25);
    opacity: 0.95;
  }
  100% {
    transform: scale(1.65);
    opacity: 0;
  }
}

@keyframes sakuraParticleFly {
  0% {
    transform: translate3d(0, 0, 0) scale(0.35) rotate(0deg);
    opacity: 1;
  }
  65% {
    opacity: 0.95;
  }
  100% {
    transform: translate3d(var(--tx, 20px), var(--ty, -20px), 0) scale(var(--scale, 1)) rotate(var(--rot, 90deg));
    opacity: 0;
  }
}

.sakura-ambient-orb {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 214, 232, 0.35) 55%, rgba(255, 170, 206, 0.12) 100%);
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(244, 140, 184, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.75);
}

.orb-1 {
  width: 64px;
  height: 64px;
  top: 76px;
  right: 48px;
  opacity: 0.45;
  animation: orbFloat 9s ease-in-out infinite;
}

.orb-2 {
  width: 38px;
  height: 38px;
  bottom: 64px;
  right: 120px;
  opacity: 0.4;
  animation: orbFloat 11s ease-in-out infinite reverse;
}

.orb-3 {
  width: 26px;
  height: 26px;
  top: 160px;
  left: 255px;
  opacity: 0.35;
  animation: orbFloat 8s ease-in-out 1.5s infinite;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -10px, 0) scale(1.04);
  }
}
</style>

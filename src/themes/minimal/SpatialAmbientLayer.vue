<!-- 文件名: src/themes/minimal/SpatialAmbientLayer.vue -->
<!-- 未来主题 (Future · 磁浮中枢极简深空光学层) -->
<template>
  <div
    ref="rootRef"
    class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    aria-hidden="true"
  >
    <!-- 1. 顶部极克制冷银微光天光 -->
    <div
      class="absolute inset-x-0 top-0 h-[42vh]"
      style="background: radial-gradient(ellipse 68% 42% at 50% -8%, rgba(186, 230, 253, 0.12) 0%, rgba(125, 211, 252, 0.03) 45%, transparent 72%);"
    ></div>

    <!-- 2. 跟随鼠标的柔和冷银焦散折射 (纯 CSS 变量驱动，零 Vue 响应式重绘) -->
    <div
      v-if="!performanceMode"
      class="spatial-cursor-caustic"
    ></div>

    <!-- 3. 底部中枢坞下方地平线漫反射 -->
    <div
      class="absolute inset-x-0 bottom-0 h-32"
      style="background: radial-gradient(ellipse 52% 18% at 50% 100%, rgba(186, 230, 253, 0.11) 0%, transparent 76%);"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  performanceMode?: boolean
}>()

const rootRef = ref<HTMLElement | null>(null)
let rafId: number | null = null
let latestX = 720
let latestY = 360

function onWindowMouseMove(e: MouseEvent) {
  if (props.performanceMode || document.hidden) return
  latestX = e.clientX
  latestY = e.clientY
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const el = rootRef.value
    if (!el) return
    el.style.setProperty('--spatial-mx', `${latestX}px`)
    el.style.setProperty('--spatial-my', `${latestY}px`)
  })
}

onMounted(() => {
  window.addEventListener('mousemove', onWindowMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onWindowMouseMove)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<style scoped>
.spatial-cursor-caustic {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    460px circle at var(--spatial-mx, 50%) var(--spatial-my, 35%),
    rgba(224, 242, 254, 0.04) 0%,
    rgba(186, 230, 253, 0.015) 45%,
    transparent 74%
  );
  transition: opacity 0.3s ease;
}
</style>

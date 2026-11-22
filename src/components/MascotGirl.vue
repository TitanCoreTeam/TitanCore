<!-- 文件路径: src/components/MascotGirl.vue -->
<template>
  <div 
    class="mascot-container relative select-none flex flex-col items-center justify-end group cursor-pointer"
    @click="handleClick"
    title="戳戳我看板娘~"
  >
    <!-- 头顶与周围闪烁樱花与小星光 -->
    <div class="absolute -top-1 -left-1 text-[#ff7eb3] opacity-85 animate-twinkle pointer-events-none text-sm">🌸</div>
    <div class="absolute top-9 -left-3 text-[#ffa6cc] opacity-75 animate-twinkle pointer-events-none text-xs" style="animation-delay: 0.8s;">✦</div>
    <div class="absolute top-2 right-1 text-[#f472b6] opacity-80 animate-twinkle pointer-events-none text-xs" style="animation-delay: 1.5s;">✧</div>

    <!-- 点击冒出的爱心花瓣小粒子 -->
    <Transition name="heart-pop">
      <div
        v-if="isHappy"
        class="pointer-events-none absolute -top-10 inset-x-0 flex justify-center gap-3 z-40"
      >
        <span class="text-xs animate-bounce">💗</span>
        <span class="text-sm -mt-1.5 animate-bounce" style="animation-delay: 80ms;">🌸</span>
        <span class="text-xs animate-bounce" style="animation-delay: 150ms;">✨</span>
      </div>
    </Transition>

    <!-- 萌系果冻对话气泡（唯一气泡，消除侧栏双气泡重叠） -->
    <div 
      class="mascot-bubble absolute -top-6 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-gradient-to-b from-white to-[#fff2f7] text-[#613952] text-[11.5px] font-bold font-sans shadow-[0_6px_16px_rgba(255,133,179,0.28),inset_0_1px_0_#ffffff] border-[1.5px] border-[#ffc4dc] flex items-center gap-1.5 backdrop-blur-md transition-all duration-300 pointer-events-none whitespace-nowrap"
      :class="{ 'scale-105 border-[#ff7eb3] text-[#d63b7c] shadow-[0_8px_20px_rgba(255,126,179,0.38)]': isHappy }"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-[#ff7eb3] shadow-[0_0_6px_#ff7eb3]"></span>
      <span>{{ bubbleText }}</span>
      <!-- 气泡小尾巴 (居中) -->
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#fff2f7] border-b-[1.5px] border-r-[1.5px] border-[#ffc4dc] rotate-45 transform"></div>
    </div>

    <!-- 看板娘主体画布区（带柔和呼吸悬浮与点击 Q 弹果冻反馈） -->
    <div 
      class="relative w-full aspect-square overflow-visible flex items-center justify-center transition-transform duration-300"
      :class="isHappy ? 'mascot-bounce' : 'mascot-float'"
    >
      <!-- 1. 待机完整高清底图 -->
      <img 
        :src="baseIdleImg" 
        alt="mascot-base" 
        class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 drop-shadow-[0_8px_16px_rgba(235,130,175,0.22)]"
      />

      <!-- 2. 自然眨眼阶段 1：半闭眼过渡贴片 -->
      <img 
        v-show="blinkStage === 1 && !isHappy" 
        :src="blinkHalfImg" 
        alt="blink-half" 
        class="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
      />

      <!-- 3. 自然眨眼阶段 2：完全闭眼贴片 -->
      <img 
        v-show="blinkStage === 2 && !isHappy" 
        :src="blinkClosedImg" 
        alt="blink-closed" 
        class="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
      />

      <!-- 4. 戳一戳互动：开怀笑脸贴片 -->
      <img 
        v-show="isHappy" 
        :src="clickHappyImg" 
        alt="happy" 
        class="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 transition-all duration-150"
      />
    </div>

    <!-- 底部樱粉果冻软垫光晕 -->
    <div class="absolute -bottom-1.5 w-28 h-3.5 bg-[#ff9ec7]/35 blur-md rounded-full pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import baseIdleImg from '../assets/kanbanniang/01_base_idle.png'
import blinkHalfImg from '../assets/kanbanniang/04_blink_half.png'
import blinkClosedImg from '../assets/kanbanniang/05_blink_closed.png'
import clickHappyImg from '../assets/kanbanniang/06_click_happy.png'

const blinkStage = ref<0 | 1 | 2>(0)
const isHappy = ref(false)
const bubbleText = ref('🌸 初樱在线中~')

const HAPPY_QUOTES = [
  '指挥官，今天玩什么呀？(◕ᴗ◕✿)',
  '呜哇！是樱花味的戳戳~ 🌸',
  '噗噜噗噜~ 气泡能量满格！',
  '别戳啦，会变成草莓大福的~',
  '今天也是粉粉嫩嫩的一天哦！',
  '随时待命中，指挥官！💗'
]

let blinkTimer: ReturnType<typeof setTimeout> | null = null
let quoteResetTimer: ReturnType<typeof setTimeout> | null = null
let happyResetTimer: ReturnType<typeof setTimeout> | null = null
const innerBlinkTimers = new Set<ReturnType<typeof setTimeout>>()

const clearInnerBlinkTimers = () => {
  innerBlinkTimers.forEach(t => clearTimeout(t))
  innerBlinkTimers.clear()
}

const scheduleNextBlink = () => {
  if (blinkTimer) clearTimeout(blinkTimer)
  const delay = 3200 + Math.random() * 2400
  blinkTimer = setTimeout(() => {
    if (!isHappy.value) {
      triggerBlink()
    } else {
      scheduleNextBlink()
    }
  }, delay)
}

const triggerBlink = () => {
  clearInnerBlinkTimers()
  blinkStage.value = 1
  const t1 = setTimeout(() => {
    innerBlinkTimers.delete(t1)
    if (isHappy.value) return
    blinkStage.value = 2
    const t2 = setTimeout(() => {
      innerBlinkTimers.delete(t2)
      if (isHappy.value) return
      blinkStage.value = 1
      const t3 = setTimeout(() => {
        innerBlinkTimers.delete(t3)
        if (isHappy.value) return
        blinkStage.value = 0
        scheduleNextBlink()
      }, 55)
      innerBlinkTimers.add(t3)
    }, 95)
    innerBlinkTimers.add(t2)
  }, 55)
  innerBlinkTimers.add(t1)
}

const handleClick = () => {
  clearInnerBlinkTimers()
  isHappy.value = true
  blinkStage.value = 0

  const randomQuote = HAPPY_QUOTES[Math.floor(Math.random() * HAPPY_QUOTES.length)]
  bubbleText.value = randomQuote

  if (happyResetTimer) clearTimeout(happyResetTimer)
  happyResetTimer = setTimeout(() => {
    isHappy.value = false
    scheduleNextBlink()
  }, 1250)

  if (quoteResetTimer) clearTimeout(quoteResetTimer)
  quoteResetTimer = setTimeout(() => {
    bubbleText.value = '🌸 初樱在线中~'
  }, 3200)
}

onMounted(() => {
  scheduleNextBlink()
})

onUnmounted(() => {
  if (blinkTimer) clearTimeout(blinkTimer)
  if (quoteResetTimer) clearTimeout(quoteResetTimer)
  if (happyResetTimer) clearTimeout(happyResetTimer)
  clearInnerBlinkTimers()
})
</script>

<style scoped>
.mascot-container {
  width: 172px;
  max-width: 100%;
}

@media (min-width: 1440px) {
  .mascot-container {
    width: 176px;
  }
}

@media (min-width: 2560px) {
  .mascot-container {
    width: 184px;
  }
}

@keyframes mascotFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

.mascot-float {
  animation: mascotFloat 3.6s ease-in-out infinite;
}

@keyframes mascotBounce {
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(1.08, 0.92) translateY(-8px); }
  50% { transform: scale(0.95, 1.05) translateY(2px); }
  75% { transform: scale(1.03, 0.98) translateY(-2px); }
  100% { transform: scale(1) translateY(0); }
}

.mascot-bounce {
  animation: mascotBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.heart-pop-enter-active,
.heart-pop-leave-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.heart-pop-enter-from,
.heart-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.7);
}
</style>

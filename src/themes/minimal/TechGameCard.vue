<!-- 文件名: src/themes/minimal/TechGameCard.vue -->
<!-- 未来主题 (Future · VisionOS 空间流体光学悬浮卡 Spatial Fluid Glass Card) -->
<template>
  <div 
    ref="cardRootRef"
    class="tech-card-root group relative w-full cursor-pointer select-none z-0 will-change-transform"
    @mouseenter="handleCardMouseEnter"
    @mousemove="handleCardMouseMove"
    @mouseleave="handleCardMouseLeave"
    @click="emit('action')"
    @contextmenu.prevent="emit('contextmenu', { id, x: $event.clientX, y: $event.clientY, title, type, installed: isInstalled, path: '' })"
    role="button"
    tabindex="0"
  >
    <!-- 卡片主体：方案 B 极简无框深空悬浮影院卡 -->
    <div 
      ref="cardBodyRef"
      class="tech-card-body relative w-full rounded-[16px] overflow-hidden flex flex-col justify-end transition-[transform,box-shadow,border-color] duration-300 ease-out"
      :style="{
        aspectRatio: '2 / 3',
        background: '#0d111a',
        border: isHovered ? '1px solid rgba(224, 242, 254, 0.62)' : '1px solid rgba(255, 255, 255, 0.13)',
        boxShadow: isHovered
          ? '0 26px 52px -12px rgba(0, 0, 0, 0.92), 0 0 24px rgba(186, 230, 253, 0.18), inset 0 1.5px 1px rgba(255, 255, 255, 0.72)'
          : '0 18px 38px -12px rgba(0, 0, 0, 0.82), inset 0 1px 0 rgba(255, 255, 255, 0.24)',
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
      }"
    >
      <!-- 1. 全画幅封面海报：2:3 严丝合缝铺满整张空间卡 -->
      <div class="absolute inset-0 overflow-hidden bg-[#060912]">
        <TitanImage 
          :id="id" 
          :src="image" 
          :local-steam-first="localSteamFirst"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          :class="isNoticeLogo ? 'scale-[1.18] group-hover:scale-[1.24]' : 'group-hover:scale-105'"
        />
        <!-- 顶部冷银镜面边缘高光 -->
        <div class="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/14 to-transparent pointer-events-none"></div>
        <!-- 底部深海渐层 -->
        <div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#04060b]/92 via-[#04060b]/40 to-transparent pointer-events-none"></div>
      </div>

      <!-- 2. 悬停冷银柔和折射聚光灯 -->
      <div 
        class="pointer-events-none absolute inset-0 rounded-[16px] transition-opacity duration-300 z-10"
        :class="isHovered ? 'opacity-100' : 'opacity-0'"
        style="background: radial-gradient(circle 220px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(224, 242, 254, 0.16) 0%, rgba(186, 230, 253, 0.06) 45%, transparent 78%);"
      ></div>

      <!-- 3. 左上角空间胶囊徽标 (仅在有真实徽标时显示) -->
      <div 
        v-if="badgeText"
        class="absolute top-3 left-3 z-30 inline-flex items-center gap-1 px-2.5 py-1 rounded-[7px] text-[10.5px] font-semibold leading-none tracking-wide backdrop-blur-xl select-none"
        :style="badgeStyle"
      >
        <span>{{ badgeText }}</span>
      </div>

      <!-- 4. 底部片名 + 极简状态光珠 + 空间发射台 -->
      <div class="relative z-20 px-3.5 pb-3 pt-2 flex flex-col justify-end pointer-events-none">
        <div class="flex items-center justify-between gap-2">
          <h3 
            class="text-white/95 font-bold text-[14.5px] leading-snug truncate tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)] font-sans transition-colors duration-200 group-hover:text-white flex-1"
            :title="title"
          >
            {{ title }}
          </h3>
          <!-- 微型冷银状态光珠 -->
          <span 
            v-if="isInstalled || isInLibrary"
            class="w-2 h-2 rounded-full transition-colors flex-shrink-0"
            :class="isInstalled ? 'bg-[#bae6fd] shadow-[0_0_8px_#bae6fd]' : 'bg-white/75 shadow-[0_0_6px_rgba(255,255,255,0.65)]'"
            :title="isInstalled ? t('card.launch') : t('card.inLibrary')"
          ></span>
        </div>

        <div 
          v-if="canShowLaunchButton"
          class="h-0 opacity-0 translate-y-2 group-hover:h-9 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-2 transition-all duration-300 ease-out pointer-events-auto"
        >
          <TitanLaunchButton 
            :status="resolvedLaunchStatus"
            theme="minimal"
            @launch="emit('launch', id)"
          />
        </div>
      </div>

      <!-- 5. 悬停液态纯银操作层 -->
      <div 
        v-if="!hideControls"
        class="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 bg-[#04060b]/45 backdrop-blur-[3px]"
      >
        <div class="flex flex-col gap-2 w-full max-w-[154px]">
          <button 
            type="button"
            @click.stop="emit('action')"
            class="w-full py-2 px-3 rounded-full text-[12.5px] font-bold tracking-wide text-center transition-all cursor-pointer active:scale-95 text-[#050811] hover:brightness-105"
            :class="isInstalling ? 'animate-pulse' : ''"
            style="
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(200, 230, 255, 0.92) 100%);
              border: 1px solid rgba(255, 255, 255, 0.75);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.48), inset 0 1px 0.5px rgba(255, 255, 255, 0.9);
            "
          >
            {{ primaryButtonText }}
          </button>
          <button 
            type="button"
            v-if="type !== 'collection' && type !== 'sharegame' && !isNotice"
            @click.stop="emit('collect')"
            class="w-full py-1.5 px-3 rounded-full text-[12px] font-semibold tracking-wide text-center transition-all cursor-pointer active:scale-95 backdrop-blur-xl"
            :style="isInLibrary 
              ? 'background: rgba(186, 230, 253, 0.22); border: 1px solid rgba(224, 242, 254, 0.5); color: #F0F9FF; box-shadow: inset 0 1px 0.5px rgba(255, 255, 255, 0.35);' 
              : 'background: rgba(10, 14, 24, 0.65); border: 1px solid rgba(255, 255, 255, 0.28); color: #FFFFFF; box-shadow: inset 0 1px 0.5px rgba(255, 255, 255, 0.3);'"
          >
            {{ isInLibrary ? t('card.inLibrary') : `+ ${t('card.collect')}` }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import TitanImage from '../../components/TitanImage.vue'
import TitanLaunchButton from '../../components/TitanLaunchButton.vue'
import { useLibraryStore } from '../../stores/libraryStore'
import { t } from '../../i18n'

const props = defineProps<{
  id: string
  title: string
  tags?: string[]
  image: string
  type?: string
  isInLibrary?: boolean
  isInstalled?: boolean
  isInstalling?: boolean
  hideControls?: boolean
  localSteamFirst?: boolean
  showLaunchButton?: boolean
  launchStatus?: 'ready' | 'running'
}>()

const emit = defineEmits<{
  (e: 'action'): void
  (e: 'collect'): void
  (e: 'launch', id: string | number): void
  (e: 'contextmenu', payload: any): void
}>()

const cardRootRef = ref<HTMLElement | null>(null)
const cardBodyRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const rotateX = ref(0)
const rotateY = ref(0)
let cachedRect: DOMRect | null = null
let rafId: number | null = null

const libraryStore = useLibraryStore()
const resolvedLaunchStatus = computed<'ready' | 'running'>(() => {
  if (props.launchStatus) return props.launchStatus
  return libraryStore.isAppRunning(props.id) ? 'running' : 'ready'
})

const canShowLaunchButton = computed(() => {
  return props.showLaunchButton && props.type === 'titan_protocol' && (libraryStore.prefEnableGameFastLaunch ?? libraryStore.prefEnableCardLaunch)
})

function handleCardMouseEnter() {
  isHovered.value = true
  if (cardBodyRef.value) {
    cachedRect = cardBodyRef.value.getBoundingClientRect()
  }
}

function handleCardMouseMove(e: MouseEvent) {
  if (!isHovered.value) isHovered.value = true
  const el = cardBodyRef.value
  if (!el) return
  if (!cachedRect) cachedRect = el.getBoundingClientRect()
  const x = e.clientX - cachedRect.left
  const y = e.clientY - cachedRect.top
  el.style.setProperty('--spot-x', `${x}px`)
  el.style.setProperty('--spot-y', `${y}px`)

  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    if (!cachedRect) return
    const cx = cachedRect.width / 2
    const cy = cachedRect.height / 2
    rotateX.value = -((y - cy) / cy) * 2.4
    rotateY.value = ((x - cx) / cx) * 2.4
  })
}

function handleCardMouseLeave() {
  isHovered.value = false
  cachedRect = null
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  rotateX.value = 0
  rotateY.value = 0
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const primaryButtonText = computed(() => {
  if (props.isInstalling) return t('card.syncing')
  if (props.type === 'collection') return t('card.viewCollection')
  return props.isInstalled ? t('card.launch') : t('card.view')
})

const badgeText = computed(() => {
  if (props.type === 'collection') return t('nav.collection')
  const raw = props.tags && props.tags[0] ? props.tags[0] : ''
  if (!raw) return ''
  const upper = raw.toUpperCase()
  if (upper === 'STEAM' || upper === 'TITAN_PROTOCOL' || upper === 'TITAN PROTOCOL') {
    return ''
  }
  return raw
})

const isCollection = computed(() => props.type === 'collection' || badgeText.value === t('nav.collection'))

const badgeStyle = computed(() => {
  if (isCollection.value) {
    return {
      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.28) 0%, rgba(236, 72, 153, 0.24) 100%)',
      border: '1px solid rgba(253, 186, 116, 0.55)',
      color: '#FFEDD5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0.5px rgba(255, 255, 255, 0.45)'
    }
  }
  return {
    background: 'rgba(8, 12, 22, 0.68)',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    color: '#E2E8F0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
  }
})

const isNotice = computed(() => props.type === 'notice' || props.type === 'announcement')
const isNoticeLogo = computed(() => isNotice.value && /logo/i.test(props.image || ''))
</script>

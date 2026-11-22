<!-- 文件名: src/themes/anime/AnimeGameCard.vue -->
<!-- Sakura 初樱气泡 · 2:3 满幅草莓果冻气泡卡砖 (Sakura Jelly Bubble Card) -->
<template>
  <div 
    ref="cardRootRef"
    class="anime-card-root group relative w-full cursor-pointer select-none z-0 will-change-transform"
    @click="emit('action')"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @contextmenu.prevent="emit('contextmenu', { id, x: $event.clientX, y: $event.clientY, title, type, installed: isInstalled, path: '' })"
    role="button"
    tabindex="0"
  >
    <!-- 1. 卡片主体：2:3 标准满幅比例 + 双层白瓷粉边果冻气泡质感 -->
    <div 
      ref="cardBodyRef"
      class="anime-card-body relative w-full rounded-[24px] overflow-hidden flex flex-col justify-end transition-[transform,box-shadow,border-color] duration-300 ease-out"
      :style="{
        aspectRatio: '2 / 3',
        background: '#FFF5F9',
        border: isHovered ? '2px solid #FF85B3' : '2px solid rgba(255, 255, 255, 0.96)',
        boxShadow: isHovered 
          ? '0 18px 36px -8px rgba(244, 114, 182, 0.36), 0 0 0 3px rgba(255, 194, 219, 0.45), inset 0 2px 1px rgba(255, 255, 255, 0.9)' 
          : '0 8px 22px -6px rgba(226, 136, 176, 0.18), 0 2px 6px rgba(244, 140, 184, 0.08), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)',
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
      }"
    >
      <!-- 2. 全画幅 2:3 海报：零裁切铺满整个气泡卡砖 -->
      <div class="absolute inset-0 overflow-hidden bg-[#fff2f7]">
        <TitanImage 
          :id="id" 
          :src="image" 
          :local-steam-first="localSteamFirst"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          :class="isNoticeLogo ? 'scale-[1.18] group-hover:scale-[1.24]' : 'group-hover:scale-105'"
        />
        <!-- 顶部果冻气泡边缘反光层 -->
        <div class="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
        <!-- 底部柔和深莓果色渐层（代替生硬纯黑遮罩，保持干净通透） -->
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2a1523]/88 via-[#2a1523]/30 to-transparent pointer-events-none"></div>
      </div>

      <!-- 3. 草莓牛奶流光聚光灯 -->
      <div 
        class="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0'"
        style="background: radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255, 190, 220, 0.32), transparent 72%);"
      ></div>

      <!-- 4. 左上角：果冻糖果分类徽标 -->
      <div 
        v-if="badgeText"
        class="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full text-[11px] font-bold leading-none tracking-wide backdrop-blur-md inline-flex items-center gap-1 select-none"
        :style="badgeStyle"
      >
        <span v-if="showSakuraPrefix" class="text-[11px] leading-none">🌸</span>
        <span>{{ badgeText }}</span>
      </div>

      <!-- 5. 底部圆润片名 + 状态糖豆 + 快捷启动台 -->
      <div class="relative z-20 px-3.5 pb-2.5 pt-2 flex flex-col justify-end pointer-events-none">
        <div class="flex items-center justify-between gap-2">
          <h3 
            class="text-[#FFFBFD] font-bold text-[15px] leading-snug truncate tracking-wide drop-shadow-[0_1px_4px_rgba(35,12,28,0.9)] font-sans transition-colors duration-200 group-hover:text-[#FFD6E8]"
            :title="title"
          >
            {{ title }}
          </h3>
          
          <!-- 微型果冻状态光珠（告别荧光青，采用薄荷糖绿 / 草莓樱粉） -->
          <span 
            v-if="isInstalled || isInLibrary"
            class="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
            :style="isInstalled
              ? 'background: #4ADE80; box-shadow: 0 0 0 2px rgba(255,255,255,0.65);'
              : 'background: #FF7EB3; box-shadow: 0 0 0 2px rgba(255,255,255,0.65);'"
            :title="isInstalled ? t('card.launch') : t('card.inLibrary')"
          ></span>
        </div>

        <div 
          v-if="canShowLaunchButton"
          class="h-0 opacity-0 translate-y-2 group-hover:h-9 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-2 transition-all duration-300 ease-out pointer-events-auto"
        >
          <TitanLaunchButton 
            :status="resolvedLaunchStatus"
            theme="anime"
            @launch="emit('launch', id)"
          />
        </div>
      </div>

      <!-- 6. 悬停快捷行动层：Q 弹草莓牛奶气泡按钮 -->
      <div 
        v-if="!hideControls"
        class="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-4 bg-[#361b2c]/38 backdrop-blur-[2px]"
      >
        <div class="flex flex-col gap-2 w-full max-w-[154px]">
          <button 
            type="button"
            @click.stop="emit('action')"
            class="w-full py-2 px-3 rounded-full text-[12.5px] font-bold tracking-wide text-center cursor-pointer text-white hover:brightness-105 active:scale-[0.92] transition-all duration-200"
            style="
              background: linear-gradient(135deg, #FF7EB3 0%, #FF94C2 60%, #FFB1D2 100%);
              border: 1.5px solid rgba(255, 255, 255, 0.92);
              box-shadow: 0 6px 16px rgba(255, 110, 168, 0.38), inset 0 1.5px 1px rgba(255, 255, 255, 0.72);
            "
          >
            {{ primaryButtonText }}
          </button>
          <button 
            type="button"
            v-if="type !== 'collection' && type !== 'sharegame' && !isNotice"
            @click.stop="emit('collect')"
            class="w-full py-1.5 px-3 rounded-full text-[12px] font-bold tracking-wide text-center cursor-pointer active:scale-[0.92] transition-all duration-200"
            :style="isInLibrary 
              ? 'background: rgba(255, 240, 246, 0.96); border: 1.5px solid #FFA8CE; color: #D63B7C; box-shadow: 0 4px 12px rgba(255, 126, 179, 0.2);' 
              : 'background: rgba(255, 255, 255, 0.96); border: 1.5px solid #FFFFFF; color: #613952; box-shadow: 0 4px 12px rgba(60, 25, 45, 0.15);'"
          >
            {{ isInLibrary ? t('card.inLibrary') : `+ ${t('card.collect')}` }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TitanImage from '../../components/TitanImage.vue'
import TitanLaunchButton from '../../components/TitanLaunchButton.vue'
import { useLibraryStore } from '../../stores/libraryStore'
import { t } from '../../i18n'

const props = defineProps<{
  id: string | number
  title: string
  tags?: string[]
  image?: string
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

const handleMouseEnter = () => {
  isHovered.value = true
  if (cardRootRef.value) {
    cachedRect = cardRootRef.value.getBoundingClientRect()
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isHovered.value) isHovered.value = true
  const root = cardRootRef.value
  if (!root) return
  if (!cachedRect) {
    cachedRect = root.getBoundingClientRect()
  }
  const x = e.clientX - cachedRect.left
  const y = e.clientY - cachedRect.top
  root.style.setProperty('--spot-x', `${x}px`)
  root.style.setProperty('--spot-y', `${y}px`)

  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    if (!cachedRect) return
    const centerX = cachedRect.width / 2
    const centerY = cachedRect.height / 2
    rotateX.value = -((y - centerY) / centerY) * 2.5
    rotateY.value = ((x - centerX) / centerX) * 2.5
  })
}

const handleMouseLeave = () => {
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

const isNotice = computed(() => props.type === 'notice' || props.type === 'announcement')
const isNoticeLogo = computed(() => isNotice.value && /logo/i.test(props.image || ''))
const showSakuraPrefix = computed(() => !!badgeText.value && !/^[\p{Extended_Pictographic}\u2600-\u27BF]/u.test(badgeText.value.trim()))

const isCollection = computed(() => props.type === 'collection' || badgeText.value === t('nav.collection'))

const badgeStyle = computed(() => {
  if (isCollection.value) {
    return {
      background: 'linear-gradient(135deg, rgba(255, 247, 237, 0.96) 0%, rgba(255, 237, 213, 0.96) 100%)',
      border: '1.5px solid #FED7AA',
      color: '#D95F18',
      boxShadow: '0 2px 8px rgba(234, 88, 12, 0.14), inset 0 1px 0 #FFFFFF'
    }
  }
  return {
    background: 'linear-gradient(135deg, rgba(255, 250, 252, 0.96) 0%, rgba(255, 234, 244, 0.96) 100%)',
    border: '1.5px solid #FFB8D5',
    color: '#D63B7C',
    boxShadow: '0 3px 10px rgba(255, 126, 179, 0.22), inset 0 1px 0 #FFFFFF'
  }
})
</script>

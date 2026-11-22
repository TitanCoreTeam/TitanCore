<!-- 文件名: src/themes/anime/AnimeSidebar.vue -->
<!-- Sakura 初樱气泡 · 二次元甜心牛奶果冻悬浮舱 (Sakura Jelly Bubble Rail) -->
<template>
  <aside
    class="anime-sidebar-rail w-[13.375rem] h-[calc(100%-1.75rem)] my-3.5 ml-3.5 flex flex-col items-center select-none flex-shrink-0 z-40 rounded-[2rem] p-3 relative backdrop-blur-2xl"
    style="
      background: linear-gradient(180deg, rgba(255, 252, 254, 0.92) 0%, rgba(255, 243, 248, 0.88) 100%);
      border: 2px solid rgba(255, 255, 255, 0.96);
      box-shadow: 0 16px 40px -8px rgba(236, 132, 176, 0.22), 0 4px 12px rgba(255, 182, 212, 0.14), inset 0 2px 0 rgba(255, 255, 255, 0.95);
    "
  >
    <!-- 顶部草莓果冻高光弧线 -->
    <div class="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff8eb8]/60 to-transparent pointer-events-none"></div>

    <!-- 1. 顶部品牌微标：Q 弹樱花果冻糖果徽章 -->
    <div class="flex items-center justify-center pb-3 pt-1 flex-shrink-0 cursor-default group" title="TitanCore 初樱气泡版">
      <div
        class="relative w-11 h-11 rounded-[18px] flex items-center justify-center font-bold text-white text-lg transition-transform duration-300 group-hover:scale-105 active:scale-95"
        style="
          background: linear-gradient(135deg, #FF7EB3 0%, #FF94C2 55%, #FFB1D2 100%);
          box-shadow: 0 6px 16px rgba(255, 126, 179, 0.36), inset 0 2px 1px rgba(255, 255, 255, 0.75);
          border: 2px solid rgba(255, 255, 255, 0.95);
        "
      >
        <span class="tracking-tight drop-shadow-[0_1px_2px_rgba(180,40,95,0.35)]">🌸</span>
      </div>
    </div>

    <!-- 2. 7 个导航菜单列表：圆润气泡胶囊 + 果冻回弹手感 -->
    <nav class="flex-1 w-full flex flex-col gap-1.5 min-h-0 overflow-y-auto scrollbar-hide py-1 relative z-10">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="relative w-full flex-shrink-0"
      >
        <button
          type="button"
          @click="goTo(item.id)"
          class="anime-bubble-btn group relative w-full h-[2.75rem] rounded-[1.375rem] px-4 flex items-center gap-3 cursor-pointer select-none transition-all duration-200 active:scale-[0.94]"
          :class="activeId === item.id 
            ? 'text-white font-bold' 
            : 'border border-transparent text-[#63485b] hover:text-[#d63b7c] hover:bg-white/90 hover:border-[#ffd6e7] hover:shadow-[0_4px_12px_rgba(255,150,192,0.16)] font-semibold'"
          :style="activeId === item.id ? {
            background: 'linear-gradient(135deg, #FF7EB3 0%, #FF94C2 60%, #FFA8CE 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.92)',
            boxShadow: '0 6px 18px -2px rgba(255, 126, 179, 0.38), inset 0 1.5px 1px rgba(255, 255, 255, 0.72)'
          } : {}"
        >
          <!-- 激活项左侧牛奶白小圆点 -->
          <div 
            v-if="activeId === item.id" 
            class="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] flex-shrink-0"
          ></div>

          <!-- 导航图标 -->
          <svg 
            width="21" 
            height="21" 
            fill="currentColor" 
            viewBox="0 0 256 256" 
            class="flex-shrink-0 transition-transform duration-200"
            :class="activeId === item.id ? 'text-white scale-105 drop-shadow-[0_1px_2px_rgba(180,40,95,0.28)]' : 'text-[#9e7891] group-hover:text-[#ff7eb3] group-hover:scale-105'"
          >
            <path :d="item.icon"></path>
          </svg>

          <!-- 圆润柔和字标 (15px 适中字重，告别粗黑压迫感) -->
          <span class="truncate font-sans tracking-wide leading-none select-none text-[15px]">
            {{ item.shortLabel }}
          </span>
        </button>
      </div>
    </nav>

    <!-- 3. 底部看板娘舞台（已移除重复的“在线中”静态胶囊，仅保留看板娘自带互动气泡 + 底部状态丸） -->
    <div class="mt-auto pt-2 pb-1 flex-shrink-0 w-full flex flex-col items-center relative z-20">
      <div class="w-full flex justify-center items-end relative min-h-[clamp(112px,20vh,164px)]">
        <MascotGirl class="w-[min(10.75rem,21vh)] pointer-events-auto" />
      </div>

      <!-- 底部草莓牛奶状态胶囊（移除刺眼蓝光常驻闪烁，仅同步中温和呼吸） -->
      <div 
        class="flex items-center gap-1.5 mt-1 px-3.5 py-1 rounded-full bg-white/90 border border-[#ffd2e4] shadow-[0_2px_10px_rgba(244,140,184,0.16),inset_0_1px_0_#ffffff] text-[11px] font-bold tracking-wide transition-all duration-300 cursor-default select-none" 
        :title="statusTooltip"
      >
        <span class="w-2 h-2 rounded-full transition-colors duration-300" :class="statusDotClass"></span>
        <span :class="statusTextClass">{{ statusText }}</span>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { t } from '../../i18n'
import { useAuthStore } from '../../stores/authStore'
import MascotGirl from '../../components/MascotGirl.vue'

const authStore = useAuthStore()

const props = defineProps<{
  activeView: string
  systemStatus?: 'ready' | 'syncing' | 'offline'
}>()

const emit = defineEmits<{
  (e: 'change-view', viewId: string): void
}>()

const activeId = computed(() => props.activeView)

const status = computed(() => props.systemStatus || 'ready')
const statusText = computed(() => {
  if (status.value === 'offline') return t('app.statusOffline')
  if (status.value === 'syncing') return t('app.statusSyncing')
  return t('app.statusReady')
})
const statusTextClass = computed(() => {
  if (status.value === 'offline') return 'text-[#e11d48]'
  if (status.value === 'syncing') return 'text-[#d97706]'
  return 'text-[#8c5878]'
})
const statusDotClass = computed(() => {
  if (status.value === 'offline') return 'bg-[#f43f5e]'
  if (status.value === 'syncing') return 'bg-[#fbbf24] animate-pulse'
  return 'bg-[#ff7eb3]'
})
const statusTooltip = computed(() => `TitanCore: ${statusText.value}`)

const goTo = (id: string) => {
  emit('change-view', id)
}

const CORE_MENU = computed(() => [
  { 
    id: 'discovery', 
    shortLabel: t('nav_short.discovery'), 
    label: t('nav.discovery'), 
    shortcutKey: '1', 
    icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm88-88a88,88,0,0,1-16.7,52.3L135.5,100.2a8,8,0,0,0-7.7-7.7L54.3,23.3A88,88,0,0,1,216,128Z' 
  },
  { 
    id: 'library', 
    shortLabel: t('nav_short.library'), 
    label: t('nav.library'), 
    shortcutKey: '2', 
    icon: 'M208,24H48A16,16,0,0,0,32,40V216a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V40A16,16,0,0,0,208,24Zm0,192H48V40H208V216ZM80,72H176V88H80Zm0,48H176v16H80Zm0,48H152v16H80Z' 
  },
  { 
    id: 'transmissions', 
    shortLabel: t('nav_short.transmissions'), 
    label: t('nav.transmissions'), 
    shortcutKey: '3', 
    icon: 'M222.14,105.86l-88-88a8,8,0,0,0-11.32,0l-88,88A8,8,0,0,0,40.49,119.5L88,71.94V184a8,8,0,0,0,16,0V71.94l47.51,47.52a8,8,0,0,0,11.32-11.32ZM216,208H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z' 
  },
  { 
    id: 'hajimi_beat', 
    shortLabel: t('nav_short.hajimi_beat'), 
    label: t('nav.hajimi_beat'), 
    shortcutKey: '4', 
    icon: 'M140,32V16a8,8,0,0,0-16,0V32A56.06,56.06,0,0,0,68,88v10.66A40.12,40.12,0,0,0,32,138.66V216a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V138.66A40.12,40.12,0,0,0,68,98.66V88a40,40,0,0,1,80,0v10.66A40.12,40.12,0,0,0,128,138.66V216a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V138.66a40.12,40.12,0,0,0-36-40V88A56.06,56.06,0,0,0,140,32ZM80,216H48V138.66a24,24,0,0,1,32,0Zm80,0V138.66a24,24,0,0,1,32,0V216Z' 
  },
  { 
    id: 'nexus_gate', 
    shortLabel: t('nav_short.nexus_gate'), 
    label: t('nav.nexus_gate'), 
    shortcutKey: '5', 
    icon: 'M240,112H216.59A88.13,88.13,0,0,0,144,39.41V16a8,8,0,0,0-16,0V39.41A88.13,88.13,0,0,0,55.41,112H32a8,8,0,0,0,0,16H55.41A88.13,88.13,0,0,0,128,200.59V224a8,8,0,0,0,16,0V200.59A88.13,88.13,0,0,0,216.59,128H240a8,8,0,0,0,0-16ZM128,184A72,72,0,1,1,200,112,72.08,72.08,0,0,1,128,184Z' 
  },
  { 
    id: 'uplink', 
    shortLabel: t('nav_short.uplink'), 
    label: t('nav.uplink'), 
    shortcutKey: '6', 
    icon: 'M232,128a104,104,0,1,0-208,0c0-41,23.81-76.41,58.55-92.93a8,8,0,0,1,6.9,14.48C62.09,63.14,44,89.5,44,128a88,88,0,0,0,168,0c0-38.5-18.09-64.86-45.45-78.45a8,8,0,1,1,6.9-14.48C208.19,51.59,232,87,232,128ZM128,64a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V72A8,8,0,0,0,128,64Z' 
  },
  { 
    id: 'settings', 
    shortLabel: t('nav_short.settings'), 
    label: t('nav.settings'), 
    shortcutKey: '7', 
    icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z' 
  }
])

const LOGIN_REQUIRED = new Set(['uplink', 'hajimi_beat', 'nexus_gate'])

const navItems = computed(() => {
  return CORE_MENU.value.filter(item => !LOGIN_REQUIRED.has(item.id) || authStore.isLoggedIn)
})

const DEFAULT_KEYS = ['1', '2', '3', '4', '5', '6', '7']
let keyboardConfig: { enabled: boolean; keys: string[] } | null = null

const loadKeyboardConfig = async () => {
  try {
    const raw = await window.electron.invoke('sys:get-config', 'keyboard_settings')
    if (raw && typeof raw === 'object') {
      keyboardConfig = {
        enabled: raw.enabled !== false,
        keys: Array.isArray(raw.keys) && raw.keys.length === 7 ? raw.keys : DEFAULT_KEYS
      }
    } else {
      keyboardConfig = { enabled: true, keys: DEFAULT_KEYS }
    }
  } catch {
    keyboardConfig = { enabled: true, keys: DEFAULT_KEYS }
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (props.activeView === 'hajimi_beat' && document.querySelector('.paper-exempt-minigame')) return
  if (!keyboardConfig || !keyboardConfig.enabled) return
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return

  const pressedKey = e.key.toUpperCase()
  const idx = keyboardConfig.keys.findIndex(k => k.toUpperCase() === pressedKey)
  if (idx !== -1 && idx < navItems.value.length) {
    const targetItem = navItems.value[idx]
    if (targetItem) {
      goTo(targetItem.id)
      e.preventDefault()
    }
  }
}

const onKeyboardUpdated = () => {
  loadKeyboardConfig()
}

onMounted(async () => {
  await loadKeyboardConfig()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('titan-keyboard-updated', onKeyboardUpdated)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('titan-keyboard-updated', onKeyboardUpdated)
})
</script>

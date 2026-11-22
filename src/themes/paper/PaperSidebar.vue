<!-- 文件名: src/themes/paper/PaperSidebar.vue -->
<template>
  <aside
    class="paper-sidebar-rail w-[4.75rem] h-[calc(100%-1.5rem)] my-3 ml-3 rounded-[1.25rem] py-3.5 px-2 flex flex-col items-center select-none flex-shrink-0 z-40 relative"
    style="
      background: #FFFDF7;
      border: 1px solid rgba(90, 78, 56, 0.13);
      box-shadow: 0 8px 24px -12px rgba(62, 54, 38, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    "
  >
    <!-- 顶部手绘圆印章 T -->
    <div
      class="relative w-11 h-11 rounded-full flex items-center justify-center font-bold text-[1rem] shadow-sm cursor-default flex-shrink-0 mb-3.5 transition-transform duration-200 hover:scale-105"
      title="TitanCore"
      style="
        background: linear-gradient(145deg, #F2DFB4 0%, #EEF4E8 100%);
        color: #352D1E;
        border: 1.5px solid #D4B77B;
      "
    >
      <span class="relative z-10">T</span>
      <span
        class="absolute inset-[2px] rounded-full border border-dashed pointer-events-none"
        style="border-color: rgba(102, 123, 72, 0.35);"
      ></span>
    </div>

    <!-- 7 个核心导航纯图标列表（无看板娘、悬停滑出和纸小纸签） -->
    <nav class="flex-1 w-full flex flex-col items-center gap-2 min-h-0 overflow-visible py-1 relative z-10">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="relative w-full flex justify-center group flex-shrink-0"
      >
        <button
          type="button"
          @click="goTo(item.id)"
          class="paper-rail-btn relative w-[3.25rem] h-[3.25rem] flex items-center justify-center cursor-pointer select-none"
          :class="activeId === item.id ? 'paper-dab text-[#352D1E]' : 'rounded-xl text-[#6B6251] hover:bg-[#F6EBD0]/90 hover:text-[#353024]'"
        >
          <span
            v-if="activeId === item.id"
            class="absolute -left-1.5 w-1 h-5 rounded-full"
            style="background: #667B48;"
          ></span>

          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :stroke-width="activeId === item.id ? 2 : 1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[1.375rem] h-[1.375rem] flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
          >
            <path v-for="(d, idx) in item.paths" :key="idx" :d="d" />
            <circle v-if="item.circle" :cx="item.circle.cx" :cy="item.circle.cy" :r="item.circle.r" />
            <rect v-for="(rc, ridx) in item.rects || []" :key="`r${ridx}`" :x="rc.x" :y="rc.y" :width="rc.w" :height="rc.h" :rx="rc.rx" />
          </svg>
        </button>

        <!-- 悬停右侧弹出和纸提示签 -->
        <div class="pointer-events-none absolute left-[calc(100%+0.625rem)] top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 hidden md:flex items-center">
          <div
            class="px-2.5 py-1 rounded-lg whitespace-nowrap text-[0.8125rem] font-semibold flex items-center gap-2 shadow-md"
            style="
              background: #FFFDF7;
              border: 1px solid rgba(90, 78, 56, 0.14);
              color: #353024;
            "
          >
            <span>{{ item.shortLabel }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- 底部极简状态小圆点 -->
    <div class="mt-auto pt-2 pb-0.5 flex-shrink-0 flex items-center justify-center relative group cursor-default" :title="statusTooltip">
      <div
        class="w-9 h-9 rounded-full flex items-center justify-center border"
        style="background: rgba(255, 253, 247, 0.9); border-color: rgba(90, 78, 56, 0.13);"
      >
        <span class="paper-status-dot w-2.5 h-2.5 rounded-full transition-colors duration-300" :class="{ 'is-syncing': status === 'syncing' }" :style="statusDotStyle"></span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { t } from '../../i18n'
import { useAuthStore } from '../../stores/authStore'

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

const statusDotStyle = computed(() => {
  if (status.value === 'offline') {
    return { background: '#BA5243', boxShadow: '0 0 0 3px rgba(186, 82, 67, 0.18)' }
  }
  if (status.value === 'syncing') {
    return { background: '#A87628', boxShadow: '0 0 0 3px rgba(168, 118, 40, 0.18)' }
  }
  return { background: '#5C7D4C', boxShadow: '0 0 0 3px rgba(92, 125, 76, 0.18)' }
})

const statusTooltip = computed(() => {
  if (status.value === 'offline') return `TitanCore: ${t('app.statusOffline')}`
  if (status.value === 'syncing') return `TitanCore: ${t('app.statusSyncing')}`
  return `TitanCore: ${t('app.statusReady')}`
})

const goTo = (id: string) => {
  emit('change-view', id)
}

interface NavDef {
  id: string
  shortLabel: string
  label: string
  shortcutKey: string
  paths: string[]
  circle?: { cx: number; cy: number; r: number }
  rects?: Array<{ x: number; y: number; w: number; h: number; rx: number }>
}

const CORE_MENU = computed<NavDef[]>(() => [
  {
    id: 'discovery',
    shortLabel: t('nav_short.discovery'),
    label: t('nav.discovery'),
    shortcutKey: '1',
    circle: { cx: 12, cy: 12, r: 9 },
    paths: ['M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z']
  },
  {
    id: 'library',
    shortLabel: t('nav_short.library'),
    label: t('nav.library'),
    shortcutKey: '2',
    paths: [],
    rects: [
      { x: 4, y: 4, w: 6.5, h: 6.5, rx: 1.5 },
      { x: 13.5, y: 4, w: 6.5, h: 6.5, rx: 1.5 },
      { x: 4, y: 13.5, w: 6.5, h: 6.5, rx: 1.5 },
      { x: 13.5, y: 13.5, w: 6.5, h: 6.5, rx: 1.5 }
    ]
  },
  {
    id: 'transmissions',
    shortLabel: t('nav_short.transmissions'),
    label: t('nav.transmissions'),
    shortcutKey: '3',
    paths: ['M12 4v11', 'M8 11l4 4 4-4', 'M4 19h16']
  },
  {
    id: 'hajimi_beat',
    shortLabel: t('nav_short.hajimi_beat'),
    label: t('nav.hajimi_beat'),
    shortcutKey: '4',
    paths: ['M7.5 12h3', 'M9 10.5v3', 'M15.5 11h.01', 'M17.5 13h.01'],
    rects: [{ x: 3, y: 7, w: 18, h: 10, rx: 5 }]
  },
  {
    id: 'nexus_gate',
    shortLabel: t('nav_short.nexus_gate'),
    label: t('nav.nexus_gate'),
    shortcutKey: '5',
    circle: { cx: 11, cy: 11, r: 7.5 },
    paths: ['m20 20-3.5-3.5']
  },
  {
    id: 'uplink',
    shortLabel: t('nav_short.uplink'),
    label: t('nav.uplink'),
    shortcutKey: '6',
    paths: ['M12 20s-7-4.5-7-9.8A4.2 4.2 0 019.2 6c1.3 0 2.3.6 2.8 1.4.5-.8 1.5-1.4 2.8-1.4A4.2 4.2 0 0119 10.2C19 15.5 12 20 12 20z']
  },
  {
    id: 'settings',
    shortLabel: t('nav_short.settings'),
    label: t('nav.settings'),
    shortcutKey: '7',
    circle: { cx: 12, cy: 12, r: 3 },
    paths: ['M12 3v2', 'M12 19v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M3 12h2', 'M19 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4']
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

<style scoped>
.paper-rail-btn {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
}
.paper-rail-btn:active {
  transform: scale(0.9);
}

.paper-dab {
  background: #F2DFB4;
  border: 1px solid #D4B77B;
  border-radius: 0.75rem;
  box-shadow: 0 3px 10px -4px rgba(140, 118, 76, 0.24);
}
@keyframes paperStatusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
}
.paper-status-dot.is-syncing {
  animation: paperStatusPulse 2.8s ease-in-out infinite;
}
</style>

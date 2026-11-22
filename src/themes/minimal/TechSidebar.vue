<!-- 文件名: src/themes/minimal/TechSidebar.vue -->
<!-- 未来主题 (Future · 底部居中磁悬浮液态钛中枢坞 Magnetic Levitation Dock) -->
<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none">
    <!-- 坞座下方地平线棱镜漫反射光晕 -->
    <div
      class="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 w-[92%] h-10 blur-md"
      style="background: radial-gradient(ellipse at 50% 60%, rgba(186, 230, 253, 0.22) 0%, rgba(148, 163, 184, 0.07) 48%, transparent 76%);"
    ></div>

    <!-- 磁悬浮液态钛中枢坞 -->
    <nav
      class="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-[1.625rem] relative"
      style="
        background: linear-gradient(165deg, rgba(255, 255, 255, 0.13) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(255, 255, 255, 0.06) 100%);
        backdrop-filter: blur(36px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.24);
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.92), 0 0 32px rgba(186, 230, 253, 0.12), inset 0 1.5px 1px rgba(255, 255, 255, 0.48), inset 0 -1px 1px rgba(186, 230, 253, 0.18);
      "
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        @click="goTo(item.id)"
        class="relative w-[4.375rem] h-[3.25rem] rounded-[1.125rem] flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer select-none active:scale-95"
        :class="activeId === item.id
          ? '-translate-y-1 text-white'
          : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.06]'"
        :style="activeId === item.id ? {
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(186, 230, 253, 0.14))',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.6), inset 0 1.5px 1px rgba(255, 255, 255, 0.75)'
        } : {}"
      >
        <!-- 激活项顶部极轻盈冷银全息光锥 -->
        <span
          v-if="activeId === item.id"
          class="dock-holo-cone pointer-events-none"
        ></span>

        <svg
          width="19"
          height="19"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :stroke-width="activeId === item.id ? 2 : 1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="flex-shrink-0 transition-transform duration-200"
          :class="activeId === item.id ? 'text-[#e0f2fe] drop-shadow-[0_0_6px_rgba(186,230,253,0.65)]' : ''"
        >
          <path v-for="(d, idx) in item.paths" :key="idx" :d="d" />
          <circle v-if="item.circle" :cx="item.circle.cx" :cy="item.circle.cy" :r="item.circle.r" />
          <polygon v-if="item.polygon" :points="item.polygon" />
          <rect v-for="(rc, ridx) in item.rects || []" :key="`r${ridx}`" :x="rc.x" :y="rc.y" :width="rc.w" :height="rc.h" :rx="rc.rx" />
          <circle v-for="(dt, didx) in item.dots || []" :key="`d${didx}`" :cx="dt.cx" :cy="dt.cy" :r="dt.r" fill="currentColor" stroke="none" />
        </svg>

        <span
          class="font-semibold leading-none text-center truncate max-w-[64px] select-none"
          :class="isEnglish ? 'text-[10px]' : 'text-[11.5px]'"
        >
          {{ item.shortLabel }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { t, currentLang } from '../../i18n'
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

const goTo = (id: string) => {
  emit('change-view', id)
}

const isEnglish = computed(() => currentLang.value.startsWith('en'))

interface NavDef {
  id: string
  shortLabel: string
  label: string
  paths: string[]
  circle?: { cx: number; cy: number; r: number }
  polygon?: string
  rects?: Array<{ x: number; y: number; w: number; h: number; rx: number }>
  dots?: Array<{ cx: number; cy: number; r: number }>
}

const CORE_MENU = computed<NavDef[]>(() => [
  {
    id: 'discovery',
    shortLabel: t('nav_short.discovery'),
    label: t('nav.discovery'),
    circle: { cx: 12, cy: 12, r: 9 },
    polygon: '15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5',
    paths: []
  },
  {
    id: 'library',
    shortLabel: t('nav_short.library'),
    label: t('nav.library'),
    paths: [],
    rects: [
      { x: 4, y: 4, w: 6.5, h: 6.5, rx: 1 },
      { x: 13.5, y: 4, w: 6.5, h: 6.5, rx: 1 },
      { x: 4, y: 13.5, w: 6.5, h: 6.5, rx: 1 },
      { x: 13.5, y: 13.5, w: 6.5, h: 6.5, rx: 1 }
    ]
  },
  {
    id: 'transmissions',
    shortLabel: t('nav_short.transmissions'),
    label: t('nav.transmissions'),
    paths: ['M12 4v11', 'M8 11l4 4 4-4', 'M4 19h16']
  },
  {
    id: 'hajimi_beat',
    shortLabel: t('nav_short.hajimi_beat'),
    label: t('nav.hajimi_beat'),
    rects: [{ x: 3, y: 7, w: 18, h: 10, rx: 4 }],
    paths: ['M7.5 12h3', 'M9 10.5v3'],
    dots: [
      { cx: 15.5, cy: 11, r: 0.9 },
      { cx: 17.5, cy: 13, r: 0.9 }
    ]
  },
  {
    id: 'nexus_gate',
    shortLabel: t('nav_short.nexus_gate'),
    label: t('nav.nexus_gate'),
    circle: { cx: 11, cy: 11, r: 7 },
    paths: ['m20 20-3.5-3.5']
  },
  {
    id: 'uplink',
    shortLabel: t('nav_short.uplink'),
    label: t('nav.uplink'),
    paths: ['M12 20s-7-4.5-7-9.8A4.2 4.2 0 0 1 9.2 6c1.3 0 2.3.6 2.8 1.4.5-.8 1.5-1.4 2.8-1.4A4.2 4.2 0 0 1 19 10.2C19 15.5 12 20 12 20z']
  },
  {
    id: 'settings',
    shortLabel: t('nav_short.settings'),
    label: t('nav.settings'),
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
.dock-holo-cone {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 58px;
  height: 22px;
  background: linear-gradient(180deg, transparent 0%, rgba(224, 242, 254, 0.22) 100%);
  clip-path: polygon(24% 0%, 76% 0%, 100% 100%, 0% 100%);
  filter: blur(2.5px);
}
</style>

<!-- 文件名: src/themes/minimal/TechTopbar.vue -->
<!-- 未来主题 (Future · 极简无框裸浮顶栏 + 纯银线性窗口控制键) -->
<template>
  <header 
    class="tech-topbar h-[54px] flex items-center justify-between px-7 z-30 select-none relative flex-shrink-0"
    style="-webkit-app-region: drag;"
  >
    <!-- 左侧：裸浮液态钛 T 标 + 极简路径 + 真实状态指示点 -->
    <div class="flex items-center gap-2.5">
      <div
        class="w-7 h-7 rounded-[9px] flex items-center justify-center font-extrabold text-[13px] text-white flex-shrink-0"
        style="
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(148, 163, 184, 0.08));
          border: 1px solid rgba(255, 255, 255, 0.32);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.65), 0 4px 16px rgba(0, 0, 0, 0.45);
        "
      >
        <span>T</span>
      </div>
      <span class="text-[13px] font-bold tracking-[0.14em] text-white/90">TITANCORE</span>
      <span class="text-white/20 text-sm">/</span>
      <h1 class="text-[13.5px] font-semibold tracking-wide text-[#c8e6ff] font-sans">
        {{ currentBreadcrumb || t('nav.discovery') }}
      </h1>
      <span
        class="w-1.5 h-1.5 rounded-full ml-1 transition-colors duration-300 flex-shrink-0"
        :class="statusDotClass"
        :title="statusTooltip"
      ></span>
    </div>

    <!-- 右侧：极简功能环钮 + 纯银线性窗口控制键 -->
    <div class="flex items-center gap-2" style="-webkit-app-region: no-drag;">
      
      <!-- 反馈通知 -->
      <button 
        type="button"
        @click="$emit('go-feedback')"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative cursor-pointer bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-[#94a3b8] hover:text-white active:scale-90"
        :title="t('nav.uplink')"
      >
        <span 
          v-if="hasUnreadFeedback" 
          class="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#bae6fd] shadow-[0_0_8px_#bae6fd] animate-ping"
        ></span>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      <!-- Steam 重启 -->
      <button 
        type="button"
        @click="$emit('restart-steam')"
        :disabled="isRestartingSteam"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 cursor-pointer bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-[#94a3b8] hover:text-white active:scale-90"
        :title="t('app.steamRestart')"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :class="isRestartingSteam ? 'animate-spin text-[#bae6fd]' : ''">
          <path d="M21 12a9 9 0 1 1-2.6-6.4" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>

      <!-- 音频同步律动 -->
      <button 
        type="button"
        @click="$emit('toggle-audio')"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90"
        :class="audioSyncLevel === 0
          ? 'bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-[#94a3b8] hover:text-white'
          : 'text-[#e0f2fe] bg-white/[0.16] border border-white/45 shadow-[0_0_14px_rgba(186,230,253,0.28),inset_0_1px_0.5px_rgba(255,255,255,0.55)]'"
        :title="audioSyncLevel === 0 ? t('app.audioSyncOff') : t('app.audioSyncOn')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </button>

      <!-- 性能模式开关 -->
      <button 
        type="button"
        @click="$emit('toggle-performance')"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90"
        :class="performanceMode
          ? 'text-[#e0f2fe] bg-white/[0.16] border border-white/45 shadow-[0_0_14px_rgba(186,230,253,0.28),inset_0_1px_0.5px_rgba(255,255,255,0.55)]'
          : 'bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-[#94a3b8] hover:text-white'"
        :title="t('app.perfMode')"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-500" :class="performanceMode ? 'rotate-180 text-[#bae6fd]' : ''">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      </button>

      <!-- 细分隔线 -->
      <div class="w-px h-4 mx-1.5 bg-white/[0.12]"></div>

      <!-- 纯银极简线性窗口控制键 -->
      <div class="flex items-center gap-1.5">
        <button 
          type="button"
          @click="winControl.min()" 
          class="w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-150 cursor-pointer bg-white/[0.03] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-white/65 hover:text-white active:scale-90"
          :title="t('app.minimize')"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </button>
        <button 
          type="button"
          @click="winControl.max()" 
          class="w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-150 cursor-pointer bg-white/[0.03] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/30 text-white/65 hover:text-white active:scale-90"
          :title="t('app.maximize')"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">
            <rect x="2" y="2" width="8" height="8" rx="1.2" />
          </svg>
        </button>
        <button 
          type="button"
          @click="winControl.close()" 
          class="w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-150 cursor-pointer bg-white/[0.03] hover:bg-rose-500/25 border border-white/[0.10] hover:border-rose-400/45 text-white/65 hover:text-rose-200 active:scale-90"
          :title="t('app.close')"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" />
            <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" />
          </svg>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../i18n'

const props = defineProps<{
  currentBreadcrumb: string
  systemStatus?: 'ready' | 'syncing' | 'offline'
  hasUnreadFeedback?: boolean
  isRestartingSteam?: boolean
  audioSyncLevel?: number
  performanceMode?: boolean
  winControl: {
    min: () => void
    max: () => void
    close: () => void
  }
}>()

defineEmits<{
  (e: 'go-feedback'): void
  (e: 'restart-steam'): void
  (e: 'toggle-audio'): void
  (e: 'toggle-performance'): void
}>()

const statusDotClass = computed(() => {
  if (props.systemStatus === 'offline') return 'bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]'
  if (props.systemStatus === 'syncing') return 'bg-[#fbbf24] shadow-[0_0_6px_#fbbf24] animate-pulse'
  return 'bg-[#7dd3fc] shadow-[0_0_8px_rgba(125,211,252,0.7)]'
})

const statusTooltip = computed(() => {
  if (props.systemStatus === 'offline') return `TitanCore: ${t('app.statusOffline')}`
  if (props.systemStatus === 'syncing') return `TitanCore: ${t('app.statusSyncing')}`
  return `TitanCore: ${t('app.statusReady')}`
})
</script>

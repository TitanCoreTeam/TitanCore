<!-- 文件名: src/themes/anime/AnimeTopbar.vue -->
<!-- Sakura 初樱气泡 · 二次元甜心牛奶果冻顶栏 (Sakura Jelly Bubble Topbar) -->
<template>
  <header 
    class="anime-topbar mx-3.5 mt-3.5 mb-1 h-[54px] rounded-[24px] flex items-center justify-between px-5 z-30 select-none relative flex-shrink-0 backdrop-blur-xl"
    style="
      -webkit-app-region: drag;
      background: linear-gradient(180deg, rgba(255, 252, 254, 0.92) 0%, rgba(255, 243, 248, 0.88) 100%);
      border: 2px solid rgba(255, 255, 255, 0.96);
      box-shadow: 0 10px 28px -6px rgba(236, 132, 176, 0.18), inset 0 2px 0 rgba(255, 255, 255, 0.95);
    "
  >
    <!-- 左侧：初樱果冻气泡徽章 + 圆润中文主标题 -->
    <div class="flex items-center gap-2.5">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center text-sm select-none"
        style="
          background: linear-gradient(135deg, #FFF0F6 0%, #FFD9E8 100%);
          border: 1.5px solid #FFFFFF;
          box-shadow: 0 3px 8px rgba(255, 133, 179, 0.22), inset 0 1px 0 #FFFFFF;
        "
      >
        🌸
      </div>
      <h1 class="text-[#56344b] font-bold tracking-wide text-[15.5px] font-sans">
        {{ currentBreadcrumb || t('nav.discovery') }}
      </h1>
    </div>

    <!-- 右侧：马卡龙果冻圆钮组 + 窗口三色糖果豆（已移除违和的赛博音频律动开关） -->
    <div class="flex items-center gap-2" style="-webkit-app-region: no-drag;">
      
      <!-- 反馈心愿小铃铛 -->
      <button 
        type="button"
        @click="$emit('go-feedback')"
        class="w-8 h-8 rounded-full flex items-center justify-center text-[#7a4e6b] hover:text-[#d63b7c] bg-white/90 hover:bg-[#fff0f6] border border-[#ffd6e7] hover:border-[#ffa8ce] shadow-[0_2px_8px_rgba(244,140,184,0.14),inset_0_1px_0_#ffffff] transition-all duration-200 relative cursor-pointer active:scale-90 hover:scale-105"
        :title="t('nav.uplink')"
      >
        <span 
          v-if="hasUnreadFeedback" 
          class="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff6b9e] shadow-[0_0_6px_#ff6b9e] animate-ping"
        ></span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      <!-- Steam 重启 -->
      <button 
        type="button"
        @click="$emit('restart-steam')"
        :disabled="isRestartingSteam"
        class="w-8 h-8 rounded-full flex items-center justify-center text-[#7a4e6b] hover:text-[#d63b7c] bg-white/90 hover:bg-[#fff0f6] border border-[#ffd6e7] hover:border-[#ffa8ce] shadow-[0_2px_8px_rgba(244,140,184,0.14),inset_0_1px_0_#ffffff] transition-all duration-200 disabled:opacity-40 cursor-pointer active:scale-90 hover:scale-105"
        :title="t('app.steamRestart')"
      >
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 256 256" :class="isRestartingSteam ? 'animate-spin text-[#ff7eb3]' : ''">
          <path d="M224,128a96,96,0,1,1-96-96,8,8,0,0,1,0,16,80,80,0,1,0,80,80,8,8,0,0,1,16,0Zm-40-64H136a8,8,0,0,0,0,16h24.69L115,125.66a8,8,0,0,0,11.32,11.32L172,91.31V116a8,8,0,0,0,16,0V68A8,8,0,0,0,184,60Z"></path>
        </svg>
      </button>

      <!-- 性能模式开关 -->
      <button 
        type="button"
        @click="$emit('toggle-performance')"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105"
        :class="performanceMode 
          ? 'bg-[#ffe4ef] text-[#d63b7c] border border-[#ff9ec7] shadow-[0_2px_10px_rgba(255,126,179,0.28)]' 
          : 'text-[#7a4e6b] hover:text-[#d63b7c] bg-white/90 hover:bg-[#fff0f6] border border-[#ffd6e7] shadow-[0_2px_8px_rgba(244,140,184,0.14),inset_0_1px_0_#ffffff]'"
        :title="t('app.perfMode')"
      >
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 256 256" class="transition-transform duration-500" :class="performanceMode ? 'rotate-180 text-[#ff7eb3]' : ''">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
        </svg>
      </button>

      <!-- 分隔线 -->
      <div class="w-[1px] h-4 mx-1 bg-[#f5cde0]"></div>

      <!-- 窗口控制三色果冻糖豆 -->
      <div class="flex items-center gap-2 pl-0.5">
        <button 
          type="button"
          @click="winControl.min()" 
          class="w-3.5 h-3.5 rounded-full bg-[#7ee7b8] border border-white/80 hover:brightness-105 transition-all duration-200 active:scale-75 hover:scale-110 shadow-[0_2px_6px_rgba(16,185,129,0.25),inset_0_1px_1px_#ffffff] cursor-pointer"
          :title="t('app.minimize')"
        ></button>
        <button 
          type="button"
          @click="winControl.max()" 
          class="w-3.5 h-3.5 rounded-full bg-[#fcd36d] border border-white/80 hover:brightness-105 transition-all duration-200 active:scale-75 hover:scale-110 shadow-[0_2px_6px_rgba(245,158,11,0.25),inset_0_1px_1px_#ffffff] cursor-pointer"
          :title="t('app.maximize')"
        ></button>
        <button 
          type="button"
          @click="winControl.close()" 
          class="w-3.5 h-3.5 rounded-full bg-[#ff8fab] border border-white/80 hover:brightness-105 transition-all duration-200 active:scale-75 hover:scale-110 shadow-[0_2px_6px_rgba(244,63,94,0.28),inset_0_1px_1px_#ffffff] cursor-pointer"
          :title="t('app.close')"
        ></button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { t } from '../../i18n'

defineProps<{
  currentBreadcrumb: string
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
</script>

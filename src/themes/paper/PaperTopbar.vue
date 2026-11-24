<!-- 文件名: src/themes/paper/PaperTopbar.vue -->
<template>
  <header
    class="paper-topbar mx-3.5 mt-3 mb-1 h-[3.5rem] rounded-[1rem] flex items-center justify-between px-5 z-30 select-none relative flex-shrink-0"
    style="
      -webkit-app-region: drag;
      background: #FFFDF7;
      border: 1px solid rgba(90, 78, 56, 0.13);
      box-shadow: 0 6px 20px -10px rgba(62, 54, 38, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    "
  >
    <!-- 左侧：手绘嫩叶暖阳徽章 + 当前页面标题（无任何多余装饰/说明文字） -->
    <div class="flex items-center gap-2.5">
      <svg class="w-[1.375rem] h-[1.375rem] flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 17.5C5 10.5 10.2 5.2 18.8 5.2C18.8 13.6 13.8 18.8 6.8 18.8C6 18.8 5.3 18.2 5 17.5Z"
          fill="#7D9B5A"
          fill-opacity="0.88"
          stroke="#4A4131"
          stroke-width="1.35"
          stroke-linejoin="round"
        />
        <path
          d="M4.5 19.2C8.2 15.2 12.2 11.4 16.8 8.2"
          stroke="#4A4131"
          stroke-width="1.35"
          stroke-linecap="round"
        />
        <path
          d="M9.6 14.4C11.2 14.5 12.6 14.2 13.8 13.5"
          stroke="#EED69B"
          stroke-width="1.2"
          stroke-linecap="round"
        />
        <path
          d="M4.5 8.5C6.2 6.8 8.6 5.9 11 5.9"
          stroke="#EED69B"
          stroke-width="1.3"
          stroke-linecap="round"
        />
      </svg>
      <h1 class="text-[#353024] font-semibold tracking-[0.02em] text-[0.9375rem] font-sans">
        {{ currentBreadcrumb || t('nav.discovery') }}
      </h1>
    </div>

    <!-- 右侧：4 大核心功能按键 + 窗口三色控制 -->
    <div class="flex items-center gap-2" style="-webkit-app-region: no-drag;">
      <!-- 反馈通知 -->
      <button
        type="button"
        @click="$emit('go-feedback')"
        class="paper-btn relative w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer"
        :title="t('nav.uplink')"
      >
        <span
          v-if="hasUnreadFeedback"
          class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style="background: #BA5243;"
        ></span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </button>

      <!-- Steam 重启 -->
      <button
        type="button"
        @click="$emit('restart-steam')"
        :disabled="isRestartingSteam"
        class="paper-btn w-9 h-9 rounded-xl border flex items-center justify-center disabled:opacity-40 cursor-pointer"
        :title="t('app.steamRestart')"
      >
        <svg class="w-4 h-4" :class="isRestartingSteam ? 'animate-spin text-[#667B48]' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 11-3.2-6.9"/>
          <polyline points="21 3 21 9 15 9"/>
        </svg>
      </button>

      <!-- 性能模式开关 -->
      <button
        type="button"
        @click="$emit('toggle-performance')"
        class="paper-btn w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer"
        :class="performanceMode ? 'is-perf-active' : ''"
        :title="t('app.perfMode')"
      >
        <svg class="w-4 h-4 transition-transform duration-500" :class="performanceMode ? 'rotate-180' : ''" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"/>
        </svg>
      </button>

      <div class="w-px h-4 mx-1" style="background: rgba(90, 78, 56, 0.14);"></div>

      <!-- 柔和木质蜡笔三色窗口点 -->
      <div class="flex items-center gap-2 pl-0.5" data-win-control>
        <button
          type="button"
          @click="winControl.min()"
          class="w-3.5 h-3.5 rounded-full hover:opacity-80 transition-all duration-150 active:scale-75 hover:scale-110 cursor-pointer"
          style="background: #7CA571; border: 1px solid rgba(90, 78, 56, 0.18);"
          :title="t('app.minimize')"
        ></button>
        <button
          type="button"
          @click="winControl.max()"
          class="w-3.5 h-3.5 rounded-full hover:opacity-80 transition-all duration-150 active:scale-75 hover:scale-110 cursor-pointer"
          style="background: #E2BF74; border: 1px solid rgba(90, 78, 56, 0.18);"
          :title="t('app.maximize')"
        ></button>
        <button
          type="button"
          @click="winControl.close()"
          class="w-3.5 h-3.5 rounded-full hover:opacity-80 transition-all duration-150 active:scale-75 hover:scale-110 cursor-pointer"
          style="background: #D47763; border: 1px solid rgba(90, 78, 56, 0.18);"
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
  (e: 'toggle-performance'): void
}>()
</script>

<style scoped>
.paper-btn {
  background: #FFFDF7;
  border-color: rgba(90, 78, 56, 0.13);
  color: #6B6251;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.paper-btn:hover {
  background: #F6EBD0;
  border-color: #D4B77B;
  color: #352D1E;
}
.paper-btn.is-perf-active {
  background: #EEF4E8;
  border-color: #C7D8B8;
  color: #3F5B32;
}
.paper-btn:active {
  transform: scale(0.9);
}
</style>

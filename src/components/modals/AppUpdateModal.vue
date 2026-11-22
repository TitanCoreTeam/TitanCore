<template>
  <BaseModal
    :visible="visible"
    @close="emitClose"
    :show-close="true"
    :container-class="currentTheme === 'paper'
      ? 'w-[92vw] max-w-[540px] max-h-[90vh] overflow-y-auto bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] p-6 sm:p-8 relative flex flex-col gap-5 sm:gap-6 rounded-2xl'
      : 'w-[92vw] max-w-[540px] max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-6 sm:p-8 relative flex flex-col gap-5 sm:gap-6'"
  >
    <!-- 顶部装饰流线 -->
    <div
      class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r pointer-events-none"
      :class="currentTheme === 'paper' ? 'from-[#a8ba78]/30 via-[#667b48]/60 to-[#d4b77b]/30 h-[2px]' : 'from-transparent via-[#00f3ff]/50 to-transparent'"
    ></div>

    <!-- 弹窗主标题区 (PC桌面级大字号与双语徽标) -->
    <div class="flex items-center justify-between border-b pb-4" :class="currentTheme === 'paper' ? 'border-[#5a4e38]/12' : 'border-white/[0.06]'">
      <div class="flex items-center gap-3">
        <span
          class="w-[4px] h-[22px] rounded-sm"
          :class="currentTheme === 'paper' ? 'bg-[#667b48] rounded-full' : 'bg-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.6)]'"
        ></span>
        <h3 class="text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2.5" :class="currentTheme === 'paper' ? 'text-[#353024]' : 'text-white'">
          {{ t('settings.update.appOnlyTitle') || t('settings.update.title') || '主程序版本更新' }}
        </h3>
      </div>
      <span
        class="text-[11px] tracking-widest px-2.5 py-1 rounded border uppercase font-bold"
        :class="currentTheme === 'paper' ? 'bg-[#f2dfb4] border-[#d4b77b] text-[#352d1e] font-sans' : 'bg-[#00f3ff]/10 border-[#00f3ff]/25 text-[#00f3ff] font-mono'"
      >
        CLIENT UPDATE
      </span>
    </div>

    <!-- 版本对比大卡片 -->
    <div
      class="border rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4"
      :class="currentTheme === 'paper' ? 'bg-[#f6f0e1] border-[#5a4e38]/15' : 'bg-white/[0.03] border-white/[0.08]'"
    >
      <!-- 当前版本 -->
      <div class="flex flex-col gap-1 min-w-0">
        <span class="text-xs font-mono tracking-wider uppercase" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : 'text-zinc-500'">CURRENT / 当前</span>
        <span class="text-base sm:text-lg font-mono font-bold truncate" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : 'text-zinc-400'">
          v{{ currentVersion || '1.0.0' }}
        </span>
      </div>

      <!-- 动态过渡指示箭头 -->
      <div class="flex items-center justify-center px-2">
        <div
          class="w-8 h-8 rounded-full border flex items-center justify-center"
          :class="currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#c7d8b8] text-[#5c7d4c] shadow-sm' : 'bg-[#00f3ff]/10 border-[#00f3ff]/30 text-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.3)]'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>

      <!-- 最新版本 -->
      <div class="flex flex-col gap-1 items-end min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono tracking-wider uppercase" :class="currentTheme === 'paper' ? 'text-[#5c7d4c]' : 'text-[#00f3ff]'">LATEST / 最新</span>
          <span
            class="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
            :class="currentTheme === 'paper' ? 'bg-[#667b48] text-[#fffdf7]' : 'bg-[#00f3ff] text-black'"
          >NEW</span>
        </div>
        <span
          class="text-xl sm:text-2xl font-mono font-bold tracking-tight truncate"
          :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'font-black text-[#00f3ff] drop-shadow-[0_0_12px_rgba(0,243,255,0.4)]'"
        >
          v{{ latestVersion || '最新版' }}
        </span>
      </div>
    </div>

    <!-- 更新亮点与特性列表 (通用中英文双语高亮兜底) -->
    <div
      class="border rounded-xl p-4 sm:p-5 flex flex-col gap-3"
      :class="currentTheme === 'paper' ? 'bg-[#eef4e8]/70 border-[#c7d8b8]' : 'bg-[#00f3ff]/[0.03] border-[#00f3ff]/15'"
    >
      <div class="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'text-[#00f3ff]'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        <span>更新亮点 / Release Highlights</span>
      </div>

      <ul class="flex flex-col gap-2 text-xs sm:text-sm leading-relaxed font-sans" :class="currentTheme === 'paper' ? 'text-[#353024]' : 'text-zinc-300'">
        <li class="flex items-start gap-2.5">
          <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#667b48]' : 'bg-[#00f3ff] shadow-[0_0_6px_rgba(0,243,255,0.8)]'"></span>
          <span>底层运行环境与多源竞速下载链路深度调优</span>
        </li>
        <li class="flex items-start gap-2.5">
          <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#667b48]' : 'bg-[#00f3ff] shadow-[0_0_6px_rgba(0,243,255,0.8)]'"></span>
          <span>外部挂载工具箱生命周期强化与并发任务自愈守护</span>
        </li>
        <li class="flex items-start gap-2.5">
          <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#667b48]' : 'bg-[#00f3ff] shadow-[0_0_6px_rgba(0,243,255,0.8)]'"></span>
          <span>桌面多分辨率视域适配与工控视觉排版升级</span>
        </li>
      </ul>

      <!-- 队列与后台机制说明 -->
      <div class="border-t pt-2.5 mt-1 flex items-center gap-2 text-xs" :class="currentTheme === 'paper' ? 'border-[#c7d8b8] text-[#5c7d4c]' : 'border-[#00f3ff]/10 text-[#00f3ff]/80'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>{{ t('settings.update.queueDesc') || t('settings.updateQueueNote') || '确认更新后将在后台静默下载，就绪后提示快速重启生效' }}</span>
      </div>
    </div>

    <!-- 底部操作按钮群 (扩大点击靶区至 h-11，PC 键盘交互友好) -->
    <div class="flex items-center gap-3 w-full pt-1">
      <button
        type="button"
        @click="emitClose"
        class="flex-1 h-11 border font-medium text-sm sm:text-base rounded-lg transition-all cursor-pointer"
        :class="currentTheme === 'paper' ? 'bg-[#f6f0e1] hover:bg-[#f6ebd0] border-[#5a4e38]/20 text-[#353024]' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.1] hover:border-white/[0.2] text-zinc-300 hover:text-white'"
      >
        {{ t('settings.update.later') || t('common.cancel') || '稍后提醒' }}
      </button>

      <button
        type="button"
        @click="emitConfirm"
        class="flex-[1.2] h-11 font-bold text-sm sm:text-base rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        :class="currentTheme === 'paper' ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-[0_4px_12px_rgba(102,123,72,0.24)]' : 'bg-[#00f3ff] hover:bg-[#2bf5ff] active:bg-[#00d0db] text-black shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:shadow-[0_0_28px_rgba(0,243,255,0.4)]'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>{{ t('settings.update.confirmUpdate') || t('settings.confirmUpdate') || '立即更新' }}</span>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue'
import { t } from '../../i18n'
import { useTheme } from '../../composables/useTheme'

const { currentTheme } = useTheme()

const props = defineProps<{
  visible: boolean
  currentVersion?: string
  latestVersion?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'close'): void
  (e: 'confirm'): void
}>()

function emitClose() {
  emit('update:visible', false)
  emit('close')
}

function emitConfirm() {
  emit('confirm')
}
</script>

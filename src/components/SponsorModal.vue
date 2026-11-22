<template>
  <BaseModal
    :visible="visible"
    @close="$emit('close')"
    :show-close="false"
    :container-class="currentTheme === 'paper'
      ? 'max-w-2xl w-full bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] p-6 rounded-2xl relative overflow-hidden'
      : currentTheme === 'anime'
      ? 'max-w-2xl w-full bg-white/95 border-2 border-[#ffc2d9] shadow-[0_20px_60px_rgba(255,140,185,0.22)] p-6 rounded-3xl relative overflow-hidden'
      : 'max-w-2xl w-full bg-[#0a0a0f] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] p-6 rounded-2xl relative overflow-hidden'"
  >
    <!-- 极简科技微网格底纹 -->
    <div 
      v-if="currentTheme !== 'paper'"
      class="absolute inset-0 pointer-events-none"
      :class="currentTheme === 'anime' 
        ? 'bg-[linear-gradient(rgba(255,133,179,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,133,179,0.03)_1px,transparent_1px)] bg-[size:32px_32px]'
        : 'bg-[linear-gradient(rgba(0,243,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]'"
    ></div>

    <!-- 顶部极细装饰流光线 -->
    <div 
      class="absolute top-0 left-0 w-full h-[2px]"
      :class="currentTheme === 'paper' ? 'bg-gradient-to-r from-[#a8ba78]/35 via-[#667b48]/65 to-[#d4b77b]/40' : currentTheme === 'anime' ? 'bg-gradient-to-r from-transparent via-[#ff85b3] to-transparent' : 'bg-gradient-to-r from-transparent via-[#00f3ff]/60 to-transparent'"
    ></div>

    <div class="relative z-10 flex flex-col gap-6">

      <!-- 顶栏: 战术标头 + 机能关闭按钮 -->
      <div 
        class="flex items-center justify-between border-b pb-4"
        :class="currentTheme === 'paper' ? 'border-[#5a4e38]/12' : currentTheme === 'anime' ? 'border-[#ffd6e7]' : 'border-white/[0.06]'"
      >
        <div class="flex items-center gap-3">
          <span 
            class="w-2.5 h-2.5 rounded-full"
            :class="currentTheme === 'paper' ? 'bg-[#667b48]' : currentTheme === 'anime' ? 'bg-[#ff66b2] shadow-[0_0_8px_#ff66b2] animate-pulse' : 'bg-[#00f3ff] shadow-[0_0_8px_#00f3ff] animate-pulse'"
          ></span>
          <h3 
            class="text-xl uppercase"
            :class="currentTheme === 'paper' ? 'text-[#353024] font-bold tracking-[0.14em] font-sans' : currentTheme === 'anime' ? 'text-[#1e192b] font-black tracking-[0.2em] font-code' : 'text-white font-black tracking-[0.2em] font-code'"
          >
            {{ t('shop.modalTitle') }}
          </h3>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'bg-[#f6f0e1] hover:bg-[#f6ebd0] border border-[#5a4e38]/15 text-[#6b6251] hover:text-[#353024]'
            : currentTheme === 'anime'
            ? 'bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#ff66b2]'
            : 'bg-white/[0.03] hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white'"
          title="ESC"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 理念卡片: 逐段渐显 (500ms 间隔, 第三段落定后固定) -->
      <div 
        class="rounded-xl p-6 transition-colors"
        :class="currentTheme === 'paper'
          ? 'bg-[#f6f0e1] border border-[#5a4e38]/15 shadow-sm'
          : currentTheme === 'anime'
          ? 'bg-gradient-to-b from-[#fff5f9] to-[#f8faff] border border-[#f5a3c7] shadow-sm'
          : 'bg-gradient-to-b from-[#101218] to-[#0b0c10] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'"
      >
        <p
          v-for="(p, i) in paras"
          :key="i"
          :class="[
            'text-base leading-loose text-center transition-all duration-700',
            showFlags[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
            i === 0 
              ? (currentTheme === 'paper' ? 'text-[#353024] font-bold' : currentTheme === 'anime' ? 'text-[#1e192b] font-black' : 'text-white font-semibold')
              : (currentTheme === 'paper' ? 'text-[#6b6251] font-medium' : currentTheme === 'anime' ? 'text-[#4a425a] font-medium' : 'text-zinc-200'),
            i === paras.length - 1 && i > 0 
              ? (currentTheme === 'paper' ? 'text-[#6b6251] border-t border-[#5a4e38]/12 pt-4 mt-4 font-bold' : currentTheme === 'anime' ? 'text-slate-600 border-t border-[#f5a3c7]/60 pt-4 mt-4 font-bold' : 'text-zinc-300 border-t border-white/10 pt-4 mt-4') 
              : '',
            i > 0 && i < paras.length - 1 ? 'mt-4' : ''
          ]"
        >{{ p }}</p>
      </div>

      <!-- 双通道发射台 -->
      <div v-if="sources.length" class="flex flex-col gap-3 pt-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <!-- 通道 A: 首选 (单源时自动占满 2 列) -->
          <button
            type="button"
            @click="openUrl(sources[0])"
            :class="[
              sources.length > 1 ? '' : 'sm:col-span-2',
              currentTheme === 'paper'
                ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-[0_4px_12px_rgba(102,123,72,0.24)] font-bold font-sans'
                : currentTheme === 'anime'
                ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white shadow-[0_6px_20px_rgba(255,133,179,0.35)] hover:opacity-95 font-bold'
                : 'bg-[#00f3ff] hover:bg-white text-black shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] font-black font-code'
            ]"
            class="py-3.5 px-4 text-base tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{{ t('shop.channelA') }}</span>
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>

          <!-- 通道 B: 容灾专线 -->
          <button
            v-if="sources.length > 1"
            type="button"
            @click="openUrl(sources[1])"
            :class="currentTheme === 'paper'
              ? 'bg-[#fffdf7] hover:bg-[#f6ebd0] border border-[#5a4e38]/20 text-[#353024] shadow-sm font-sans'
              : currentTheme === 'anime'
              ? 'bg-white hover:bg-pink-50 border-2 border-[#ff9ec7] text-[#ff66b2] shadow-sm font-code'
              : 'bg-[#141418] hover:bg-[#1a1a22] border border-white/10 hover:border-[#00f3ff]/40 text-zinc-200 hover:text-[#00f3ff] font-code'"
            class="py-3.5 px-4 font-bold text-base tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{{ t('shop.channelB') }}</span>
            <svg class="w-4 h-4 shrink-0 opacity-70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>

        </div>

        <p 
          v-if="sources.length > 1" 
          class="text-base text-center tracking-wider font-medium"
          :class="currentTheme === 'paper' ? 'text-[#6b6251] font-sans' : currentTheme === 'anime' ? 'text-slate-600 font-code' : 'text-zinc-300 font-code'"
        >
          {{ t('shop.channelHint') }}
        </p>
      </div>

      <!-- 未配置状态 -->
      <div 
        v-else 
        class="w-full rounded-xl p-4 text-center border"
        :class="currentTheme === 'paper' ? 'bg-[#fbefe9] border-[#e3bcb3]' : currentTheme === 'anime' ? 'bg-rose-50 border-rose-200' : 'bg-red-500/10 border-red-500/30'"
      >
        <p class="text-base font-bold" :class="currentTheme === 'paper' ? 'text-[#993e32] font-sans' : currentTheme === 'anime' ? 'text-rose-600 font-code' : 'text-red-300 font-code'">{{ t('shop.notConfigured') }}</p>
      </div>

      <!-- 取消/关闭 -->
      <button
        type="button"
        @click="$emit('close')"
        class="w-full py-2.5 font-bold text-base tracking-widest rounded-lg transition-all border cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'bg-[#f6f0e1] hover:bg-[#f6ebd0] border-[#5a4e38]/20 text-[#353024] font-sans'
          : currentTheme === 'anime'
          ? 'bg-slate-50 hover:bg-pink-50 border-slate-200 text-[#4a425a] hover:text-[#ff66b2] font-code'
          : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-zinc-200 hover:text-white font-code'"
      >
        {{ t('common.cancel') }}
      </button>

    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { t } from '../i18n'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from '../composables/useTheme'
import BaseModal from './common/BaseModal.vue'
import { tcToast } from '../utils/tcToast'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const authStore = useAuthStore()
const { currentTheme } = useTheme()

// 宣言按空行分段, 逐段渐显
const paras = computed<string[]>(() => t('shop.story').split(/\n\s*\n/).filter(Boolean))
const showFlags = ref<boolean[]>([])
let timers: number[] = []

const play = () => {
  timers.forEach((x) => clearTimeout(x))
  timers = []
  const reduce = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { showFlags.value = paras.value.map(() => true); return }
  showFlags.value = paras.value.map(() => false)
  paras.value.forEach((_p, i) => {
    timers.push(window.setTimeout(() => { showFlags.value[i] = true }, 250 + i * 500))
  })
}

const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !e.isComposing) {
    e.stopImmediatePropagation()
    emit('close')
  }
}
watch(() => props.visible, (v) => {
  if (v) {
    window.addEventListener('keydown', onEsc)
    play()
  } else {
    window.removeEventListener('keydown', onEsc)
	timers.forEach((x) => clearTimeout(x))
  }
}, { immediate: true })
onUnmounted(() => {
  timers.forEach((x) => clearTimeout(x))
  window.removeEventListener('keydown', onEsc)
})

const sources = computed<string[]>(() => {
  const cfg: any = authStore.appConfig
  const arr = cfg?.shop_urls
  if (Array.isArray(arr) && arr.length) return arr.filter((u: any) => typeof u === 'string' && u)
  const single = cfg?.shop_url || cfg?.shopUrl
  return single ? [single] : []
})

const openUrl = async (url: string) => {
  try {
    const res = await window.electron.invoke('sys:open-external', url)
    if (!res?.success) throw new Error('OPEN_EXTERNAL_FAILED')
  } catch {
    try {
      await navigator.clipboard.writeText(url)
      tcToast(t('shop.externalFailTitle'), t('shop.externalFailDesc'), 'warning')
    } catch { }
  }
}
</script>

<template>
  <BaseModal 
    :visible="visible" 
    @close="$emit('close')" 
    :show-close="true" 
    :container-class="containerClass"
  >
    <div class="flex flex-col gap-6">
      <h3 class="text-xl font-black tracking-widest uppercase" :class="titleColorClass">{{ t('app.diagTitle') }}</h3>

      <div class="space-y-3">
        <div v-for="item in results" :key="item.name" class="flex items-start gap-3">
          <span 
            class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" 
            :class="item.warning 
              ? (currentTheme === 'paper' ? 'bg-[#a87628]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
              : (item.ok ? (currentTheme === 'paper' ? 'bg-[#5c7d4c]' : currentTheme === 'anime' ? 'bg-[#ff66b2] shadow-[0_0_8px_rgba(255,102,178,0.6)]' : 'bg-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.6)]') : (currentTheme === 'paper' ? 'bg-[#ba5243]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'))"
          ></span>
          <div class="flex-1">
            <div 
              class="text-sm font-bold" 
              :class="item.warning ? (currentTheme === 'paper' ? 'text-[#7d5619]' : 'text-amber-500') : (item.ok ? itemTitleOkClass : (currentTheme === 'paper' ? 'text-[#993e32]' : 'text-red-500'))"
            >{{ t(item.name) }}</div>
            <div 
              class="text-xs mt-0.5" 
              :class="item.warning ? (currentTheme === 'paper' ? 'text-[#946b28]' : 'text-amber-600/80') : (item.ok ? itemMsgOkClass : (currentTheme === 'paper' ? 'text-[#ba5243]' : 'text-red-400/80'))"
            >{{ t(item.message) }}</div>
          </div>
        </div>
      </div>

      <div class="h-px" :class="dividerClass"></div>

      <div class="flex items-center justify-between">
        <span class="text-xs font-code" :class="statsTextClass">
          {{ t('app.diagPassFail', { pass: passCount, fail: failCount }) }}
        </span>
        <button 
          type="button"
          @click="onActionClick"
          :disabled="isRepairing"
          class="px-6 py-2 rounded-lg font-bold font-code text-sm tracking-widest transition-all disabled:opacity-40"
          :class="buttonClass"
        >
          <span v-if="isRepairing" class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></span>
          {{ buttonText }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import BaseModal from './common/BaseModal.vue'
import { t } from '../i18n'
import { useTheme } from '../composables/useTheme'

export interface DiagnosticItem {
  name: string
  ok: boolean
  message: string
  warning?: boolean
}

const props = defineProps<{
  visible: boolean
  results: DiagnosticItem[]
  isRepairing?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'repair-env'): void
}>()

const { currentTheme } = useTheme()

const containerClass = computed(() => {
  if (currentTheme.value === 'paper') {
    return 'max-w-lg w-full bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] rounded-2xl p-8 text-[#353024]'
  }
  if (currentTheme.value === 'anime') {
    return 'max-w-lg w-full bg-white/95 border-2 border-[#ffc2d9] rounded-3xl shadow-[0_20px_60px_rgba(255,140,185,0.22)] p-8 text-[#4a3240]'
  }
  if (currentTheme.value === 'minimal') {
    return 'max-w-lg w-full bg-[#0e1526]/78 border border-white/20 rounded-3xl shadow-[0_28px_70px_rgba(0,0,0,0.68),inset_0_1.5px_1px_rgba(255,255,255,0.38)] text-[#f4f8ff] backdrop-blur-3xl p-8'
  }
  return 'max-w-lg w-full bg-[#0c0d12]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-white p-8'
})

const titleColorClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#353024]'
  if (currentTheme.value === 'anime') return 'text-[#1e192b]'
  return 'text-white'
})

const itemTitleOkClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#353024]'
  if (currentTheme.value === 'anime') return 'text-[#1e192b]'
  return 'text-white'
})

const itemMsgOkClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#6b6251]'
  if (currentTheme.value === 'anime') return 'text-[#64748b]'
  return 'text-white/50'
})

const dividerClass = computed(() => {
  if (currentTheme.value === 'paper') return 'bg-[#5a4e38]/15'
  if (currentTheme.value === 'anime') return 'bg-pink-100'
  if (currentTheme.value === 'minimal') return 'bg-[#00f2ff]/15'
  return 'bg-white/5'
})

const statsTextClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#6b6251]'
  if (currentTheme.value === 'anime') return 'text-slate-400'
  return 'text-white/30'
})

const passCount = computed(() => props.results.filter(r => r.ok && !r.warning).length)
const failCount = computed(() => props.results.filter(r => !r.ok).length)

const allOk = computed(() => props.results.length > 0 && props.results.every(r => r.ok || r.warning))

const actionType = computed(() => {
  if (props.isRepairing) return 'repairing'
  if (allOk.value) return 'ok'
  return 'env'
})

const buttonText = computed(() => {
  switch (actionType.value) {
    case 'repairing': return t('app.diagRepairing')
    case 'ok': return t('app.diagEnvOk')
    case 'env': return t('app.diagRepairEnv')
  }
})

const buttonClass = computed(() => {
  if (currentTheme.value === 'paper') {
    switch (actionType.value) {
      case 'repairing': return 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b]'
      case 'ok': return 'bg-[#eef4e8] text-[#3f5b32] border border-[#c7d8b8]'
      case 'env': return 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-[0_4px_12px_rgba(102,123,72,0.24)]'
    }
  }
  if (currentTheme.value === 'anime') {
    switch (actionType.value) {
      case 'repairing': return 'bg-pink-100 text-[#ff66b2] border border-pink-200'
      case 'ok': return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      case 'env': return 'bg-gradient-to-r from-[#ff85b3] via-[#ff9ec7] to-[#70d6ff] text-white shadow-md hover:opacity-95'
    }
  }

  if (currentTheme.value === 'minimal') {
    switch (actionType.value) {
      case 'repairing': return 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30'
      case 'ok': return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'env': return 'bg-gradient-to-r from-[#00f2ff] to-[#3a7bd5] text-black font-black hover:brightness-110 shadow-[0_0_15px_rgba(0,242,255,0.3)]'
    }
  }

  switch (actionType.value) {
    case 'repairing': return 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30'
    case 'ok': return 'bg-green-500/10 text-green-400 border border-green-500/20'
    case 'env': return 'bg-[#00f3ff] text-black border border-[#00f3ff] hover:bg-white'
  }
})

function onActionClick() {
  if (actionType.value === 'env') {
    emit('repair-env')
  }
}
</script>

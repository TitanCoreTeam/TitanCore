<!-- 文件名: src/themes/paper/PaperGameCard.vue -->
<template>
  <div
    class="paper-card-root group relative w-full cursor-pointer select-none z-0"
    @click="emit('action')"
    @contextmenu.prevent="emit('contextmenu', { id, x: $event.clientX, y: $event.clientY, title, type, installed: isInstalled, path: '' })"
    role="button"
    tabindex="0"
  >
    <div
      class="paper-card-body relative w-full rounded-[14px] overflow-hidden flex flex-col justify-end transition-[transform,box-shadow,border-color] duration-300 ease-out"
      style="aspect-ratio: 2 / 3; background: #E9E3D7;"
    >
      <!-- 全画幅海报 -->
      <div class="absolute inset-0 overflow-hidden bg-[#E9E3D7]">
        <TitanImage
          :id="id"
          :src="image"
          :local-steam-first="localSteamFirst"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          :class="isNoticeLogo ? 'scale-[1.18] group-hover:scale-[1.24]' : 'group-hover:scale-105'"
        />
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1F1D1A]/88 via-[#1F1D1A]/28 to-transparent pointer-events-none"></div>
      </div>

      <!-- 分类微标（仅合集或有独立品类时展示） -->
      <div
        v-if="badgeText"
        class="absolute top-3 left-3 z-30 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold leading-none tracking-[0.02em] shadow-sm select-none"
        :style="badgeStyle"
      >
        <span>{{ badgeText }}</span>
      </div>

      <!-- 底部片名 + 状态光珠 + 快捷启动发射台 -->
      <div class="relative z-20 px-3 pb-2.5 pt-2 flex flex-col justify-end pointer-events-none">
        <div class="flex items-center justify-between gap-2">
          <h3
            class="text-[#FAF8F4] font-semibold text-[0.9375rem] leading-snug truncate tracking-[0.01em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] font-sans transition-colors duration-200 group-hover:text-[#F2DFB4]"
            :title="title"
          >
            {{ title }}
          </h3>

          <span
            v-if="isInstalled || isInLibrary"
            class="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
            :style="isInstalled
              ? 'background: #5C7D4C; box-shadow: 0 0 0 2px rgba(255,253,247,0.55);'
              : 'background: #D4B77B; box-shadow: 0 0 0 2px rgba(255,253,247,0.55);'"
            :title="isInstalled ? t('card.launch') : t('card.inLibrary')"
          ></span>
        </div>

        <div
          v-if="canShowLaunchButton"
          class="h-0 opacity-0 translate-y-2 group-hover:h-9 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-2 transition-all duration-300 ease-out pointer-events-auto"
        >
          <TitanLaunchButton
            :status="resolvedLaunchStatus"
            theme="paper"
            @launch="emit('launch', id)"
          />
        </div>
      </div>

      <!-- 悬停快捷操作层 -->
      <div
        v-if="!hideControls"
        class="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 bg-[#26221A]/42"
      >
        <div class="flex flex-col gap-2 w-full max-w-[156px]">
          <button
            type="button"
            @click.stop="emit('action')"
            class="w-full py-2 px-3 rounded-xl text-[13px] font-semibold tracking-[0.02em] text-center cursor-pointer text-[#FFFDF7] shadow-sm hover:brightness-95 active:scale-95 transition-all"
            style="background: #667B48; border: 1px solid rgba(255,253,247,0.22);"
          >
            {{ primaryButtonText }}
          </button>
          <button
            type="button"
            v-if="type !== 'collection' && type !== 'sharegame' && !isNotice"
            @click.stop="emit('collect')"
            class="w-full py-1.5 px-3 rounded-xl text-[12px] font-semibold tracking-[0.02em] text-center cursor-pointer shadow-sm active:scale-95 transition-all"
            :style="isInLibrary
              ? 'background: rgba(238, 244, 232, 0.96); border: 1px solid #C7D8B8; color: #3F5B32;'
              : 'background: rgba(255, 253, 247, 0.96); border: 1px solid rgba(90, 78, 56, 0.16); color: #353024;'"
          >
            {{ isInLibrary ? t('card.inLibrary') : `+ ${t('card.collect')}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const libraryStore = useLibraryStore()

const resolvedLaunchStatus = computed<'ready' | 'running'>(() => {
  if (props.launchStatus) return props.launchStatus
  return libraryStore.isAppRunning(props.id) ? 'running' : 'ready'
})

const canShowLaunchButton = computed(() => {
  return props.showLaunchButton && props.type === 'titan_protocol' && (libraryStore.prefEnableGameFastLaunch ?? libraryStore.prefEnableCardLaunch)
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

const isCollection = computed(() => props.type === 'collection' || badgeText.value === t('nav.collection'))

const badgeStyle = computed(() => {
  if (isCollection.value) {
    return {
      background: 'rgba(251, 243, 223, 0.95)',
      border: '1px solid #E4CCA0',
      color: '#7D5619'
    }
  }
  return {
    background: 'rgba(242, 223, 180, 0.95)',
    border: '1px solid #D4B77B',
    color: '#352D1E'
  }
})
</script>

<style scoped>
.paper-card-body {
  border: 1px solid rgba(90, 78, 56, 0.14);
  box-shadow: 0 4px 14px -6px rgba(62, 54, 38, 0.16);
}
.paper-card-root:hover .paper-card-body {
  transform: translateY(-5px) scale(1.015);
  border-color: rgba(102, 123, 72, 0.50);
  box-shadow: 0 16px 32px -10px rgba(62, 54, 38, 0.22), 0 4px 12px -4px rgba(102, 123, 72, 0.14);
}
.paper-card-root:active .paper-card-body {
  transform: translateY(-2px) scale(0.985);
}
</style>

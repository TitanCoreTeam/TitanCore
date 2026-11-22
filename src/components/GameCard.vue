<template>
  <div 
    class="group relative w-full aspect-[2/3] transition-all duration-300 ease-out z-0 select-none hover:-translate-y-2 will-change-transform"
    :class="currentTheme === 'paper' || currentTheme === 'anime' ? 'rounded-2xl' : 'rounded-theme'"
    @click="emit('action')"
    @contextmenu.prevent="emit('contextmenu', { id, x: $event.clientX, y: $event.clientY, title, type, installed: isInstalled, path: '' })"
    role="button"
    tabindex="0"
  >
    <div 
      class="relative h-full w-full overflow-hidden z-10 flex flex-col transition-all duration-500"
      :class="currentTheme === 'paper'
        ? 'rounded-2xl bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_8px_24px_-10px_rgba(62,54,38,0.12)] group-hover:shadow-[0_12px_28px_-10px_rgba(62,54,38,0.18)] group-hover:border-[#8c764c]/35'
        : currentTheme === 'anime' 
        ? 'rounded-2xl bg-white border border-pink-200/70 shadow-[0_4px_16px_rgba(244,114,182,0.15)] group-hover:shadow-[0_8px_25px_rgba(244,114,182,0.3)] group-hover:border-pink-300' 
        : 'rounded-theme bg-bg-panel border border-white/5 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]'"
    >

      <!-- 海报图层 (纯净通透，仅底部文字背后留微弱暗晕，去除发灰与黑幕) -->
      <div class="absolute inset-0 overflow-hidden" :class="currentTheme === 'paper' ? 'bg-[#ede5d4]' : currentTheme === 'anime' ? 'bg-slate-100' : 'bg-[#0a0d14]'">
        <TitanImage 
          :id="String(id)" :src="image" :local-steam-first="localSteamFirst"
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <!-- 仅底部微弱渐变保护标题可读性 -->
        <div 
          class="absolute inset-0 pointer-events-none"
          :class="currentTheme === 'paper'
            ? 'bg-gradient-to-t from-[#fffdf7]/95 via-transparent to-transparent'
            : currentTheme === 'anime' 
            ? 'bg-gradient-to-t from-white/90 via-transparent to-transparent' 
            : 'bg-gradient-to-t from-black/95 via-black/30 to-transparent'"
        ></div>
      </div>

      <!-- 悬浮操作按钮层 -->
      <div v-if="!hideControls" class="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center" :class="currentTheme === 'paper' ? 'bg-[#26221A]/35 backdrop-blur-[2px]' : 'bg-black/60 backdrop-blur-[1px]'">
        <div class="flex items-center gap-2 w-full px-4">
          <button 
            type="button"
            v-if="type !== 'collection' && type !== 'sharegame'"
            @click.stop="emit('collect')"
            class="flex-1 px-3 py-2 text-[10px] tracking-widest text-center transition-all border cursor-pointer"
            :class="currentTheme === 'paper' ? (isInLibrary ? 'rounded-xl font-bold bg-[#eef4e8] border-[#c7d8b8] text-[#3f5b32] hover:bg-[#e1ecd7]' : 'rounded-xl font-bold bg-[#fffdf7]/95 border-[#5a4e38]/20 text-[#353024] hover:bg-[#f6ebd0]') : (isInLibrary ? 'rounded-sm font-black font-code bg-primary/20 border-primary/30 text-primary hover:bg-primary/30' : 'rounded-sm font-black font-code bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white hover:border-white/40')"
          >
            <span>{{ isInLibrary ? '★ ' + t('card.collected') : '☆ ' + t('card.collect') }}</span>
          </button>
          <button 
            type="button"
            @click.stop="emit('action')"
            class="px-3 py-2 text-[10px] tracking-widest text-center transition-transform hover:scale-105 cursor-pointer"
            :class="[displayButtonClass, 'flex-1', currentTheme === 'paper' ? 'rounded-xl font-bold shadow-sm' : 'rounded-sm font-black font-code shadow-[0_0_15px_rgba(0,0,0,0.8)]']"
          >
            <span>{{ displayButtonText }}</span>
          </button>
        </div>
      </div>

      <!-- 底部主标题与交互区 -->
      <div class="absolute bottom-0 inset-x-0 p-3.5 z-20 flex flex-col justify-end pointer-events-none">
        <div class="relative transition-transform duration-300">
          <h3 
            class="text-[17px] leading-tight tracking-wide line-clamp-1 transition-colors duration-300"
            :class="currentTheme === 'paper' ? 'font-bold text-[#353024] group-hover:text-[#56693b]' : currentTheme === 'anime' ? 'font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] group-hover:text-pink-300' : 'font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] group-hover:text-[#00f3ff]'"
            :title="title"
          >
            {{ title }}
          </h3>

          <!-- 开启实验功能【悬停破空升起启动发射台】平时立绘纯净无遮挡，坚决不展示无意义标签 -->
          <div 
            v-if="canShowLaunchButton"
            class="h-0 opacity-0 translate-y-2 group-hover:h-9 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-2 transition-all duration-300 ease-out pointer-events-auto"
          >
            <TitanLaunchButton 
              :status="resolvedLaunchStatus"
              :theme="currentTheme"
              @launch="emit('launch', id)"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TitanImage from './TitanImage.vue'
import TitanLaunchButton from './TitanLaunchButton.vue'
import { useLibraryStore } from '../stores/libraryStore'
import { useTheme } from '../composables/useTheme'
import { t } from '../i18n'

const props = defineProps<{
  id: string | number
  title: string
  image: string
  type: string
  tags?: string[]
  isInstalled?: boolean
  isInLibrary?: boolean
  buttonText?: string
  buttonClass?: string
  hideControls?: boolean
  localSteamFirst?: boolean
  showLaunchButton?: boolean
  launchStatus?: 'ready' | 'running'
}>()

const emit = defineEmits(['action', 'collect', 'contextmenu', 'launch'])

const typeColorClass: Record<string, string> = {
  titan_module: 'bg-primary/20 text-primary border-primary/30',
  game: 'bg-green-500/20 text-green-400 border-green-500/30',
  wallpaper: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tool: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  titan_protocol: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  collection: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  patch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sharegame: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
}

const typeLabelMap: Record<string, string> = {
  titan_module: 'Titan Module',
  game: 'Steam 游戏',
  wallpaper: '壁纸',
  tool: '实用工具',
  titan_protocol: 'Titan 协议',
  collection: '精选合集',
  unknown: '未知类型',
  patch: '游戏补丁',
  sharegame: '共享游戏'
}


const { currentTheme } = useTheme()
const libraryStore = useLibraryStore()

const resolvedLaunchStatus = computed<'ready' | 'running'>(() => {
  if (props.launchStatus) return props.launchStatus
  return libraryStore.isAppRunning(props.id) ? 'running' : 'ready'
})

const canShowLaunchButton = computed(() => {
  return props.showLaunchButton && props.type === 'titan_protocol' && (libraryStore.prefEnableGameFastLaunch ?? libraryStore.prefEnableCardLaunch)
})

const animeTypeColorClass: Record<string, string> = {
  titan_module: 'bg-sky-100 text-sky-700 border border-sky-300',
  game: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  wallpaper: 'bg-indigo-100 text-indigo-700 border border-indigo-300',
  tool: 'bg-slate-100 text-slate-700 border border-slate-300',
  titan_protocol: 'bg-blue-100 text-blue-700 border border-blue-300',
  collection: 'bg-pink-100 text-pink-700 border border-pink-300',
  unknown: 'bg-gray-100 text-gray-700 border border-gray-300',
  patch: 'bg-amber-100 text-amber-700 border border-amber-300',
  sharegame: 'bg-cyan-100 text-cyan-700 border border-cyan-300'
}

// 严格过滤无意义的技术标签与协议文字，仅在有真正业务意义时（如合集、工具等）才返回分类名
const currentTypeLabel = computed(() => {
  if (props.type === 'titan_protocol' || props.type === 'game') return ''
  return typeLabelMap[props.type] || ''
})

// 过滤掉 #TITAN_PROTOCOL、#STEAM、#GAME 等底层无脑技术标签
const cleanTags = computed(() => {
  return (props.tags || []).filter(tag => {
    if (!tag) return false
    const upper = String(tag).trim().toUpperCase()
    return upper !== 'TITAN_PROTOCOL' && upper !== 'TITAN PROTOCOL' && upper !== 'STEAM' && upper !== 'GAME'
  }).slice(0, 2)
})

const hasMetaTags = computed(() => !!currentTypeLabel.value || cleanTags.value.length > 0)
const currentTypeColor = computed(() => typeColorClass[props.type] || typeColorClass['unknown'])
const animeTypeColor = computed(() => animeTypeColorClass[props.type] || animeTypeColorClass['unknown'])

const displayButtonText = computed(() => {
  if (props.buttonText) return props.buttonText
  if (props.type === 'sharegame') return t('card.getAuthorization') || '获取授权'
  if (props.type === 'collection') return t('card.viewCollection')
  return props.isInstalled ? t('card.launch') : t('card.view')
})

const displayButtonClass = computed(() => {
  if (props.buttonClass) return props.buttonClass
  if (currentTheme.value === 'paper') return 'bg-[#667b48] text-[#fffdf7] hover:bg-[#56693b] font-bold shadow-[0_4px_12px_rgba(102,123,72,0.24)]'
  return 'bg-primary text-black hover:bg-primary-hover font-bold shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
})
</script>

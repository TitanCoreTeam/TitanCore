<!-- 文件名: src/components/DiscoveryView.vue -->
<template>
  <div 
    class="h-full flex flex-col relative overflow-hidden animate-fade-in select-none transition-colors duration-300"
    :class="currentTheme === 'anime' 
      ? 'bg-transparent text-[#4a2c40]' 
      : currentTheme === 'paper'
        ? 'bg-transparent text-[#353024]'
        : currentTheme === 'minimal'
          ? 'bg-transparent text-slate-100'
          : 'bg-[#08080a] text-white'"
    style="font-family: 'MiSans', 'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif;"
  >
    <!-- 顶部频段导轨 / 分类标签 -->
    <div 
      class="flex-shrink-0 z-20"
      :class="[
        currentTheme === 'minimal' ? 'px-7 pt-2 pb-1.5' : (currentTheme === 'paper' || currentTheme === 'anime' ? 'px-5 pt-2.5 pb-1.5' : 'px-8 pt-5 pb-3')
      ]"
    >
      <div class="w-full overflow-x-auto scrollbar-hide py-1">
        <div class="flex items-center min-w-max" :class="currentTheme === 'minimal' ? 'gap-6' : 'gap-2.5'">
          <button 
            v-for="tab in staticTabs" 
            :key="tab.id"
            @click="discoveryStore.setTab(tab.id)"
            :disabled="discoveryStore.isFetching"
            class="relative transition-all duration-200 flex items-center cursor-pointer disabled:opacity-40 select-none whitespace-nowrap active:scale-95"
            :class="[
              currentTheme === 'anime'
                ? 'rounded-full font-sans font-bold text-[13px] tracking-wide h-9 px-5'
                : currentTheme === 'paper'
                  ? 'rounded-xl h-9 px-4 font-sans font-semibold text-[13px] tracking-[0.02em]'
                  : currentTheme === 'minimal'
                    ? 'h-8 px-0.5 pb-1 text-[14px] tracking-wide'
                    : 'h-10 px-6 text-xs font-bold tracking-wider border uppercase rounded-[4px] overflow-hidden group',
              discoveryStore.activeTab === tab.id
                ? (currentTheme === 'anime'
                    ? 'bg-gradient-to-b from-[#ff7eb3] to-[#ff98c3] text-white border-[1.5px] border-white/95 shadow-[0_6px_16px_rgba(255,126,179,0.34),inset_0_1.5px_1px_rgba(255,255,255,0.75)]'
                    : currentTheme === 'paper'
                      ? 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b] shadow-[0_2px_8px_rgba(140,118,76,0.20)] font-semibold'
                      : currentTheme === 'minimal'
                        ? 'text-white font-bold'
                        : 'bg-[#00f3ff]/15 text-[#00f3ff] border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.15)] tab-active-glow')
                : (currentTheme === 'anime'
                    ? 'bg-white/90 border-[1.5px] border-[#ffd6e7] text-[#7a4e6b] hover:bg-white hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]'
                    : currentTheme === 'paper'
                      ? 'bg-[#fffdf7]/95 border border-[rgba(90,78,56,0.13)] text-[#6b6251] hover:bg-[#f6ebd0] hover:text-[#353024] hover:border-[rgba(140,118,76,0.28)]'
                      : currentTheme === 'minimal'
                        ? 'text-[#64748b] hover:text-white font-semibold'
                        : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/15 hover:text-zinc-200 hover:bg-white/[0.04]')
            ]"
          >
            <!-- 经典主题横扫流光 -->
            <span 
              v-if="currentTheme !== 'anime' && currentTheme !== 'minimal' && currentTheme !== 'paper' && discoveryStore.activeTab === tab.id" 
              class="absolute inset-0 pointer-events-none sweep-animation bg-gradient-to-r from-transparent via-white/40 to-transparent"
            ></span>
            <!-- 方案 B 极简无框底边冰银微光细线 -->
            <span
              v-if="currentTheme === 'minimal' && discoveryStore.activeTab === tab.id"
              class="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#e0f2fe] to-transparent shadow-[0_0_10px_rgba(186,230,253,0.7)]"
            ></span>
            <span class="relative z-10">{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 资产海报流容器 -->
    <div
      class="flex-1 flex flex-col min-h-0 relative overflow-hidden z-10"
      :class="currentTheme === 'paper' || currentTheme === 'anime' || currentTheme === 'minimal' ? 'px-0' : 'px-8'"
    >
      <!-- 指挥官专属共享游戏库温情横幅 (字号饱满标准，禁用 WAP 蚂蚁字) -->
      <div 
        v-if="discoveryStore.activeTab === 'sharegame' && !isShareBannerDismissed" 
        class="p-6 transition-all animate-fade-in flex flex-col gap-2 relative shrink-0"
        :class="[
          currentTheme === 'minimal' ? 'mx-7 mt-2 mb-2' : (currentTheme === 'paper' || currentTheme === 'anime' ? 'mx-5 mt-2 mb-2' : 'mb-4'),
          currentTheme === 'anime' 
          ? 'rounded-[24px] bg-gradient-to-r from-[#fff5f9]/95 via-[#fff0f6]/95 to-white/95 border-2 border-[#ffc2d9] shadow-[0_8px_24px_-6px_rgba(236,130,174,0.20),inset_0_2px_0_#ffffff]' 
          : currentTheme === 'paper'
            ? 'rounded-2xl bg-[#fffdf7]/95 border border-[rgba(90,78,56,0.13)] shadow-[0_6px_20px_-8px_rgba(62,54,38,0.12)]'
            : currentTheme === 'minimal'
              ? 'rounded-2xl bg-[#0b101b]/78 backdrop-blur-2xl border border-white/18 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.22)]'
              : 'rounded-xl bg-gradient-to-r from-[#00f3ff]/10 via-[#00f3ff]/5 to-transparent border border-[#00f3ff]/20 shadow-[0_0_20px_rgba(0,243,255,0.06)]'
        ]"
      >
        <!-- 关闭按钮 -->
        <div class="absolute top-5 right-5 z-10">
          <button
            @click="dismissBanner"
            class="px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border select-none"
            :class="currentTheme === 'anime'
              ? 'rounded-full bg-white/90 hover:bg-white text-pink-600 border-pink-200 shadow-sm'
              : currentTheme === 'paper'
                ? 'rounded-xl bg-[#f6f0e1] hover:bg-[#f6ebd0] text-[#6b6251] hover:text-[#353024] border-[rgba(90,78,56,0.14)] font-semibold'
                : currentTheme === 'minimal'
                  ? 'rounded-full text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.14] border-white/15 hover:border-white/35'
                  : 'rounded bg-white/[0.04] hover:bg-[#00f3ff]/15 text-zinc-400 hover:text-[#00f3ff] border-white/10 hover:border-[#00f3ff]/40'"
            :title="t('discovery.dontShowAgain')"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            <span>{{ t('discovery.dontShowAgain') }}</span>
          </button>
        </div>

        <div class="flex items-center gap-3 pr-32">
          <span class="text-2xl">🎖️</span>
          <h2 
            class="text-xl font-black tracking-wide" 
            :class="currentTheme === 'anime' ? 'text-pink-600' : currentTheme === 'paper' ? 'text-[#353024] font-bold' : 'text-white'"
          >
            {{ t('discovery.shareBannerTitle') }}
          </h2>
          <span 
            class="px-2.5 py-1 text-xs font-bold tracking-wider"
            :class="currentTheme === 'anime' 
              ? 'rounded-full bg-pink-100 text-pink-600 border border-pink-200' 
              : currentTheme === 'paper'
                ? 'rounded-lg bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b] font-semibold'
                : currentTheme === 'minimal'
                  ? 'rounded-md bg-white/10 text-[#e0f2fe] border border-white/25'
                  : 'rounded uppercase bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30'"
          >
            {{ t('discovery.shareBannerBadge') }}
          </span>
        </div>
        <p 
          class="text-sm leading-relaxed max-w-4xl" 
          :class="currentTheme === 'anime' ? 'text-[#554c66]' : currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'minimal' ? 'text-[#94a3b8]' : 'text-zinc-300'"
        >
          {{ t('discovery.shareBannerDesc') }}
        </p>
      </div>

      <!-- 加载状态指示器 -->
      <div 
        v-if="discoveryStore.isFetching" 
        class="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm"
        :class="currentTheme === 'anime' ? 'bg-[#fff5f8]/60' : currentTheme === 'paper' ? 'bg-[#f4efe2]/75' : 'bg-[#090b10]/60'"
      >
        <div 
          class="w-9 h-9 border-2 rounded-full animate-spin mb-3"
          :class="currentTheme === 'anime' 
            ? 'border-[#f5cbdc] border-t-[#ea8fb4]' 
            : currentTheme === 'paper'
              ? 'border-[#d4b77b]/50 border-t-[#667b48]'
              : currentTheme === 'minimal' 
                ? 'border-white/10 border-t-white' 
                : 'border-white/10 border-t-white'"
        ></div>
        <span 
          class="text-xs font-medium tracking-wider"
          :class="currentTheme === 'anime' ? 'text-[#7a6b8c]' : currentTheme === 'paper' ? 'text-[#6b6251]' : 'text-white/60'"
        >
          {{ t('discovery.loading') || 'Loading...' }}
        </span>
      </div>

      <!-- 核心 VirtualList 虚拟列表驱动海量卡片 -->
      <VirtualList 
        v-if="filteredDisplayList.length > 0"
        class="flex-1 min-h-0"
        :items="filteredDisplayList"
        :columns="currentColumns"
        :aspectRatio="themeAspectRatio"
        :gap="currentTheme === 'minimal' ? 22 : (currentTheme === 'paper' || currentTheme === 'anime' ? 18 : 24)"
        :paddingX="currentTheme === 'minimal' ? 28 : (currentTheme === 'paper' || currentTheme === 'anime' ? 20 : 24)"
        :paddingTop="currentTheme === 'paper' || currentTheme === 'anime' || currentTheme === 'minimal' ? 12 : 24"
        :paddingBottom="currentTheme === 'minimal' ? 116 : 32"
      >
        <template #default="{ items }">
          <template v-if="currentTheme === 'minimal'">
            <TechGameCard 
              v-for="item in items" 
              :key="item.id"
              :id="String(item.id)" 
              :title="item.basic?.title || item.title" 
              :tags="item.basic?.tags || item.tags || [item.type ? item.type.toUpperCase() : '']" 
              :image="item.basic?.cover || item.cover" 
              :type="item.type"
              :isInLibrary="userLibrarySet.has(resolveContractKey(item))"
              :isInstalled="false"
              :isInstalling="false" 
              :hideControls="false"
              @action="onCardAction(item)"
              @collect="onCollect(item)"
            />
          </template>
          <template v-else-if="currentTheme === 'anime'">
            <AnimeGameCard 
              v-for="item in items" 
              :key="item.id"
              :id="String(item.id)" 
              :title="item.basic?.title || item.title" 
              :tags="item.basic?.tags || item.tags || [item.type ? item.type.toUpperCase() : '']" 
              :image="item.basic?.cover || item.cover" 
              :type="item.type"
              :isInLibrary="userLibrarySet.has(resolveContractKey(item))"
              :isInstalled="false"
              :isInstalling="false" 
              :hideControls="false"
              @action="onCardAction(item)"
              @collect="onCollect(item)"
            />
          </template>
          <template v-else-if="currentTheme === 'paper'">
            <PaperGameCard 
              v-for="item in items" 
              :key="item.id"
              :id="String(item.id)" 
              :title="item.basic?.title || item.title" 
              :tags="item.basic?.tags || item.tags || [item.type ? item.type.toUpperCase() : '']" 
              :image="item.basic?.cover || item.cover" 
              :type="item.type"
              :isInLibrary="userLibrarySet.has(resolveContractKey(item))"
              :isInstalled="false"
              :isInstalling="false" 
              :hideControls="false"
              @action="onCardAction(item)"
              @collect="onCollect(item)"
            />
          </template>
          <template v-else>
            <GameCard 
              v-for="item in items" 
              :key="item.id"
              :id="item.id" 
              :title="item.basic.title" 
              :tags="item.basic.tags || []" 
              :image="item.basic.cover" 
              :type="item.type"
              :isInLibrary="userLibrarySet.has(resolveContractKey(item))"
              :isInstalled="false"
              :isInstalling="false" 
              :hideControls="false"
              :buttonText="t('card.view')"
              @action="onCardAction(item)"
              @collect="onCollect(item)"
              @cancel="() => {}"
            />
          </template>
        </template>
      </VirtualList>

      <!-- 空列表状态 -->
      <div 
        v-else-if="!discoveryStore.isFetching" 
        class="h-full flex items-center justify-center font-sans flex-col gap-3"
        :class="currentTheme === 'anime' ? 'text-[#8a7a9c]' : currentTheme === 'paper' ? 'text-[#9b917e]' : 'text-white/30'"
      >
        <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="opacity-30">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4"/>
        </svg>
        <span class="tracking-wider text-xs">{{ t('discovery.empty') }}</span>
      </div>
    </div>

    <!-- 独立公告阅读与外链弹窗 -->
    <NoticeArticleModal
      v-if="isNoticeModalVisible"
      :visible="isNoticeModalVisible"
      :noticeItem="selectedNoticeItem"
      @close="isNoticeModalVisible = false"
    />

    <!-- 独立专属：指挥官自费共享游戏正版凭据授权枢纽 -->
    <ShareGameModal
      v-if="isShareGameModalVisible"
      :visible="isShareGameModalVisible"
      :item="selectedShareGameItem"
      @close="isShareGameModalVisible = false"
    />

    <!-- 资产详情弹窗 -->
    <GameDetailModal 
      v-if="isDetailVisible"
      :visible="isDetailVisible"
      :gameId="selectedItem?.id || ''"
      :appId="detailAppId"
      :notice="detailNotice"
      :cover="selectedItem?.basic?.cover || ''"
      :title="selectedItem?.basic?.title || ''"
      :tags="selectedItem?.basic?.tags || []"
      :rating="selectedItem?.basic?.rating || 9.9"
      :description="selectedItem?.desc || selectedItem?.meta_json?.desc || t('discovery.noDesc')"
      :isInstalled="false"
      :isInLibrary="userLibrarySet.has(resolveContractKey(selectedItem))"
      :isDownloading="false"
      :isInstalling="false"
      :progress="0"
      statusText="READY"
      downloadText=""
      :type="selectedItem?.type || ''"
      @close="isDetailVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { t } from '../i18n'
import GameCard from './GameCard.vue'
import AnimeGameCard from '../themes/anime/AnimeGameCard.vue'
import TechGameCard from '../themes/minimal/TechGameCard.vue'
import PaperGameCard from '../themes/paper/PaperGameCard.vue'
import VirtualList from './VirtualList.vue'
import GameDetailModal from './GameDetailModal.vue'
import ShareGameModal from './modals/ShareGameModal.vue'
import NoticeArticleModal from './modals/NoticeArticleModal.vue'
import { useDiscoveryStore } from '../stores/discoveryStore'
import { useLibraryStore } from '../stores/libraryStore'
import { useSearchStore } from '../stores/searchStore'
import { useTheme } from '../composables/useTheme'
import { useShareBanner } from '../composables/useShareBanner'

const { currentTheme } = useTheme()
const { isShareBannerDismissed, dismissBanner } = useShareBanner()

const props = defineProps<{ searchQuery?: string }>()

const discoveryStore = useDiscoveryStore()
const libraryStore = useLibraryStore()
const searchStore = useSearchStore()
const currentColumns = ref(5)
const themeAspectRatio = computed(() => 2 / 3)

const isNoticeModalVisible = ref(false)
const selectedNoticeItem = ref<any>(null)

const isShareGameModalVisible = ref(false)
const selectedShareGameItem = ref<any>(null)

const userLibrarySet = ref<Set<string>>(new Set())

const resolveContractKey = (item: any): string => {
  if (!item) return ''
  if (item.type === 'titan_protocol' || item.resource_id?.startsWith('steam_gate_')) {
    const coreId = item.meta?.target_id || item.meta?.steam_appid ||
                   item.basic?.app_id || item.basic?.appId ||
                   item.meta?.app_id || item.meta?.appId ||
                   item.meta?.steam_id || item.basic?.steam_id ||
                   item.id || item.resource_id
    const m = String(coreId).match(/(\d+)$/)
    return m ? m[1] : String(coreId)
  }
  return item.resource_id || item.id
}

const staticTabs = computed(() => [
  { id: 'titan_protocol', label: t('discovery.tabSteam') },
  { id: 'collection', label: t('discovery.tabCollection') },
  { id: 'sharegame', label: t('discovery.tabShare') || '共享游戏' },
])

const isDetailVisible = ref(false)
const selectedItem = ref<any>(null)

// 提取精准 Steam AppID（支持运维手动发布的各层元数据提取），确保红黄牌与补丁提示 100% 触发
const detailAppId = computed(() => {
  if (!selectedItem.value) return ''
  const item = selectedItem.value
  let metaObj = item.meta || {}
  if (!item.meta && item.meta_json) {
    try { metaObj = JSON.parse(item.meta_json) } catch {}
  }
  const candidates = [
    item.app_id, item.appId, item.steam_appid, item.steam_id, item.target_id,
    item.basic?.app_id, item.basic?.appId, item.basic?.steam_id,
    metaObj.steam_appid, metaObj.target_id, metaObj.app_id, metaObj.appId, metaObj.steam_id,
    resolveContractKey(item), item.id, item.resource_id
  ]
  for (const cid of candidates) {
    if (!cid) continue
    const s = String(cid).replace(/^(steam_gate_|titan_protocol_|game_|patch_)/, '').trim()
    const m = s.match(/(\d{3,10})/)
    if (m) return m[1]
  }
  const title = item.basic?.title || item.title || ''
  const titleMatch = String(title).match(/(\d{4,8})/)
  if (titleMatch) return titleMatch[1]
  return ''
})

const detailNotice = computed(() => {
  if (!selectedItem.value) return ''
  const item = selectedItem.value
  return item.notice || item.meta?.notice || item.meta_json?.notice || ''
})

const syncUserLibraryState = async () => {
  try {
    const lib = await window.electron.sys.getUserLibrary()
    if (Array.isArray(lib)) {
      // 容灾自愈：若历史数据中有被误收藏的 sharegame，静默移出用户库，防止污染状态
      const validItems: any[] = []
      for (const item of lib) {
        if (item.type === 'sharegame') {
          window.electron.sys.removeUserLibrary(item.resource_id || item.id).catch(() => {})
        } else {
          validItems.push(item)
        }
      }
      userLibrarySet.value = new Set(validItems.map(item => resolveContractKey(item)))
    }
  } catch (e) {
  }
}

const filteredDisplayList = computed(() => {
  const isShareTab = discoveryStore.activeTab === 'sharegame'
  const result = discoveryStore.displayList.filter(item => {
    // 共享游戏卡片属于公共账号池，绝不因用户库状态被隐藏，保证全量可见
    if (isShareTab || item.type === 'sharegame' || item.basic?.type === 'sharegame') return true
    return !userLibrarySet.value.has(resolveContractKey(item))
  })
  // 公告数据卡片默认置顶排列在橱窗前列
  return [...result].sort((a, b) => {
    const isNoticeA = a.type === 'notice' || a.type === 'announcement' || !!a.meta?.pinned
    const isNoticeB = b.type === 'notice' || b.type === 'announcement' || !!b.meta?.pinned
    if (isNoticeA && !isNoticeB) return -1
    if (!isNoticeA && isNoticeB) return 1
    return 0
  })
})

watch(() => discoveryStore.displayList, (val) => {
}, { immediate: true })

const onCardAction = async (item: any) => {
  const rawItem = discoveryStore.rawList.find(r => r.id === item.id) || item

  if (rawItem.type === 'collection') {
    try {
      const childrenRes = await window.electron.invoke('sys:get-collection-children', rawItem.id)
      if (childrenRes && childrenRes.length > 0) {
        window.dispatchEvent(new CustomEvent('titan-navigate', { 
          detail: { view: 'collection', payload: { title: rawItem.title || item.basic?.title, cover: rawItem.cover || item.basic?.cover, data: childrenRes } } 
        }))
      }
    } catch(e) { }
  } else if (rawItem.type === 'notice' || rawItem.type === 'announcement' || item.type === 'notice' || item.type === 'announcement' || rawItem.meta?.type === 'notice') {
    selectedNoticeItem.value = { 
      ...rawItem, 
      basic: item.basic, 
      meta: item.meta || rawItem.meta,
      updated_at: rawItem.updated_at || item.updated_at || rawItem.created_at
    }
    isNoticeModalVisible.value = true
  } else if (rawItem.type === 'sharegame' || item.type === 'sharegame') {
    selectedShareGameItem.value = { ...rawItem, basic: item.basic }
    isShareGameModalVisible.value = true
  } else {
    selectedItem.value = { ...rawItem, basic: item.basic }
    isDetailVisible.value = true
  }
}

const onCollect = async (item: any) => {
  if (item.type === 'collection' || item.type === 'sharegame' || item.basic?.type === 'sharegame' || item.type === 'notice' || item.type === 'announcement') return
  const contractKey = resolveContractKey(item)
  const next = new Set(userLibrarySet.value)
  next.add(contractKey)
  userLibrarySet.value = next

  try {
    await libraryStore.toggleItem(item.id, {
      title: item.basic?.title || '',
      type: item.type || '',
      cover: item.basic?.cover || '',
      desc: item.basic?.desc || item.meta?.desc || ''
    })
  } catch (e) {
    const rollback = new Set(userLibrarySet.value)
    rollback.delete(contractKey)
    userLibrarySet.value = rollback
  }
}

// 网格断点：纸境与未来空间窄侧栏默认 6 列，初樱气泡宽侧栏自适应 5~6 列
const updateColumns = () => {
  const w = window.innerWidth
  if (w < 320) return
  if (currentTheme.value === 'paper' || currentTheme.value === 'minimal') {
    if (w < 960) currentColumns.value = 4
    else if (w < 1200) currentColumns.value = 5
    else if (w < 1560) currentColumns.value = 6
    else if (w < 1860) currentColumns.value = 7
    else if (w < 2400) currentColumns.value = 8
    else currentColumns.value = 9
    return
  }
  if (currentTheme.value === 'anime') {
    if (w < 980) currentColumns.value = 4
    else if (w < 1280) currentColumns.value = 5
    else if (w < 1720) currentColumns.value = 6
    else if (w < 2240) currentColumns.value = 7
    else currentColumns.value = 8
    return
  }
  if (w < 1024) currentColumns.value = 3        // 小窗
  else if (w < 1280) currentColumns.value = 4   // 窄屏笔记本
  else if (w < 1600) currentColumns.value = 5   // 默认窗口 (1440) → 5
  else if (w < 2560) currentColumns.value = 6   // 1080P/2K 全屏 → 6
  else if (w < 3840) currentColumns.value = 7   // 准 4K / 超宽
  else currentColumns.value = 8                 // 4K
}
watch(currentTheme, updateColumns)

let unsubLibUpdate: (() => void) | null = null

onMounted(async () => {
  searchStore.initRadar().catch(() => {})
  updateColumns()
  window.addEventListener('resize', updateColumns)
  await syncUserLibraryState()

  unsubLibUpdate = window.electron.on('titan:library-updated', () => {
    syncUserLibraryState()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
  unsubLibUpdate?.()
})
</script>

<style scoped>
@keyframes lightSweep {
  0% { transform: translateX(-100%); opacity: 0.8; }
  100% { transform: translateX(100%); opacity: 0; }
}
.sweep-animation {
  animation: lightSweep 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
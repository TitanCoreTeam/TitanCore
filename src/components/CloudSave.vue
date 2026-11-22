<template>
  <Teleport to="body">
    <Transition name="cloudsave-fade">
      <div 
        v-if="visible" 
        class="fixed inset-0 z-[999] flex items-center justify-center transition-all" 
        :class="currentTheme === 'paper' ? 'bg-[#353024]/30 backdrop-blur-sm' : currentTheme === 'anime' ? 'bg-slate-900/40 backdrop-blur-sm' : (currentTheme === 'minimal' ? 'bg-[#06080e]/80 backdrop-blur-sm' : 'bg-black/80')" 
        @click.self="close"
      >
        <div 
          class="rounded-2xl max-h-[82vh] flex flex-col transition-all border animate-scale-in" 
          :class="currentTheme === 'paper'
            ? 'bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] text-[#353024]'
            : currentTheme === 'anime'
            ? 'bg-white/95 border-2 border-[#ffc2d9] rounded-3xl shadow-[0_20px_60px_rgba(255,140,185,0.22)] text-[#4a3240]'
            : (currentTheme === 'minimal'
              ? 'bg-[#0e1526]/78 border-white/20 rounded-3xl shadow-[0_28px_70px_rgba(0,0,0,0.68),inset_0_1.5px_1px_rgba(255,255,255,0.38)] text-[#f4f8ff] backdrop-blur-3xl'
              : 'bg-[#0d0e12] border-white/10 shadow-[0_0_40px_rgba(0,243,255,0.08)]')"
          :style="{ width: modalWidth + 'px', fontFamily: `'MiSans', 'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif` }"
        >
      <!-- 头部 -->
      <div 
        class="flex items-center justify-between px-6 py-4 border-b shrink-0 transition-colors"
        :class="currentTheme === 'paper' ? 'border-[#5a4e38]/12 bg-[#f6f0e1]/75' : currentTheme === 'anime' ? 'border-[#ffd6e7] bg-[#fff7fa]/85' : 'border-white/5'"
      >
        <div class="flex items-center gap-3">
          <h3 
            class="uppercase tracking-wider font-code" 
            :class="[screenWidth >= 3840 ? 'text-base' : 'text-sm', currentTheme === 'paper' ? 'font-bold text-[#353024]' : currentTheme === 'anime' ? 'font-black text-[#1e192b]' : 'font-black text-white']"
          >{{ t('cloud.title') }}</h3>
          <span class="text-xs font-code font-medium" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-600' : 'text-zinc-500'">
            <template v-if="isVip">{{ t('cloud.slotsUsage', { used: usedSlots, max: maxSlots, usedMb, maxMb }) }}</template>
            <template v-else>{{ t('cloud.localBanner') }}</template>
          </span>
        </div>
        <div class="flex items-center gap-3">
          <select 
            v-if="accounts.length > 0" 
            v-model="selectedAccount" 
            @change="onAccountChange"
            :disabled="!!busyAppId"
            :title="selectedAccount ? getAccountTitle(selectedAccount) : ''"
            class="text-xs rounded px-3 py-1.5 outline-none font-code border transition-all max-w-[240px] disabled:opacity-40 disabled:cursor-not-allowed"
            :class="currentTheme === 'paper'
              ? 'bg-[#f6f0e1] border-[#5a4e38]/20 text-[#353024] focus:border-[#667b48]'
              : currentTheme === 'anime'
              ? 'bg-white border-[#e2d4f0] text-[#1e192b] focus:border-[#ff85b3]'
              : 'bg-[#0a0a0a] border-white/10 text-zinc-300 focus:border-[#00f3ff]/40'"
          >
            <option v-for="acc in accounts" :key="acc" :value="acc" :title="getAccountTitle(acc)">{{ getAccountLabel(acc) }}</option>
          </select>
          <button 
            @click="refresh()" 
            :disabled="!!busyAppId"
            class="transition-colors p-1 rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
            :class="currentTheme === 'paper' ? 'text-[#6b6251] hover:text-[#353024] hover:bg-[#f6ebd0]' : currentTheme === 'anime' ? 'text-slate-400 hover:text-[#ff66b2] hover:bg-pink-50' : 'text-zinc-500 hover:text-[#00f3ff]'" 
            :title="t('cloud.refresh')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
          <button 
            @click="close" 
            class="transition-colors p-1 rounded cursor-pointer" 
            :class="currentTheme === 'paper' ? 'text-[#6b6251] hover:text-[#353024] hover:bg-[#f6ebd0]' : currentTheme === 'anime' ? 'text-slate-400 hover:text-[#1e192b] hover:bg-pink-50' : 'text-zinc-500 hover:text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- 内容区：虚拟滚动 -->
      <div ref="listRef" class="flex-1 overflow-y-auto relative scrollbar-hide p-6" @scroll="onListScroll">
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div 
            class="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            :class="currentTheme === 'paper' ? 'border-[#667b48]' : currentTheme === 'anime' ? 'border-[#ff66b2]' : 'border-[#00f3ff]'"
          ></div>
          <span class="ml-3 text-xs font-code font-bold" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-600' : 'text-zinc-400'">{{ t('cloud.scanning') }}</span>
        </div>

        <div v-else-if="items.length === 0" class="text-center py-16 text-xs" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-500' : 'text-zinc-500'">
          <svg class="w-10 h-10 mx-auto mb-3" :class="currentTheme === 'paper' ? 'text-[#667b48]' : currentTheme === 'anime' ? 'text-pink-300' : 'text-zinc-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p class="font-bold">{{ t('cloud.emptyTitle') }}</p>
          <p class="mt-1" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : currentTheme === 'anime' ? 'text-slate-400' : 'text-zinc-600'">{{ t('cloud.emptyHint') }}</p>
        </div>

        <div v-else :style="{ height: virtualTotalHeight + 'px' }">
          <div :style="{ transform: `translateY(${virtualOffsetY}px)` }">
            <div 
              v-for="item in virtualVisibleItems" 
              :key="item.appId" 
              class="flex items-center gap-4 rounded-lg transition-all border"
              :class="[
                itemPaddingClass,
                currentTheme === 'paper'
                  ? 'bg-[#f6f0e1]/75 border-[#5a4e38]/15 shadow-sm hover:border-[#8c764c]/35'
                  : currentTheme === 'anime' 
                  ? 'bg-white border-[#e2d4f0] shadow-sm hover:border-[#ff9ec7]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              ]"
              :style="{ height: itemHeight + 'px' }"
            >
              <!-- 横图 -->
              <div 
                class="rounded overflow-hidden shrink-0 relative" 
                :class="currentTheme === 'paper' ? 'bg-[#ebe4d6]' : currentTheme === 'anime' ? 'bg-slate-100' : 'bg-[#0a0a0a]'"
                :style="{ width: headerImgWidth + 'px', height: headerImgHeight + 'px' }"
              >
                <img 
                  v-if="item.headerImage" 
                  :src="item.headerImage" 
                  class="w-full h-full object-cover" 
                  draggable="false"
                  @error="item.headerImage = ''" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-xs" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : currentTheme === 'anime' ? 'text-slate-400' : 'text-zinc-600'">{{ t('cloud.noCover') }}</div>
              </div>

              <!-- 信息 -->
              <div class="flex-1 min-w-0">
                <div 
                  class="truncate" 
                  :class="[
                    screenWidth >= 3840 ? 'text-base' : 'text-sm',
                    currentTheme === 'paper' ? 'font-bold text-[#353024]' : currentTheme === 'anime' ? 'font-black text-[#1e192b]' : 'font-black text-white'
                  ]"
                >{{ item.gameName || `AppID: ${item.appId}` }}</div>
                <div class="text-xs font-code mt-1" :class="currentTheme === 'paper' ? 'text-[#6b6251] font-medium' : currentTheme === 'anime' ? 'text-slate-500 font-bold' : 'text-zinc-500'">AppID: {{ item.appId }}</div>
                <div class="flex items-center gap-2 mt-2">
                  <span 
                    v-if="item.hasCloud" 
                    class="text-[10px] px-1.5 py-0.5 rounded font-bold border"
                    :class="currentTheme === 'paper' ? 'bg-[#ebf3f0] text-[#3e635b] border-[#c1d7d1]' : currentTheme === 'anime' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/20'"
                  >
                    {{ t('cloud.syncedAt', { date: item.cloudDate }) }}
                  </span>
                  <span 
                    v-else 
                    class="text-[10px] px-1.5 py-0.5 rounded border"
                    :class="currentTheme === 'paper' ? 'bg-[#ece4d2] text-[#6b6251] border-[#5a4e38]/15' : currentTheme === 'anime' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-white/5'"
                  >{{ t('cloud.notUploaded') }}</span>
                  <span 
                    v-if="!item.hasLocal" 
                    class="text-[10px] px-1.5 py-0.5 rounded border font-bold"
                    :class="currentTheme === 'paper' ? 'bg-[#fbf3df] text-[#7d5619] border-[#e4cca0]' : currentTheme === 'anime' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-yellow-900/20 text-yellow-500 border border-yellow-700/20'"
                  >{{ t('cloud.cloudOnly') }}</span>
                </div>
              </div>

              <!-- 按钮操作组 -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- 1. 云端功能：仅 VIP 可用 -->
                <button 
                  @click="handleUpload(item)" 
                  :disabled="!isVip || !!busyAppId || !item.hasLocal"
                  :title="!isVip ? t('cloud.vipOnly') : ''"
                  class="rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed border cursor-pointer"
                  :class="[
                    btnSizeClass,
                    currentTheme === 'paper'
                      ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] border-[#667b48] shadow-sm font-bold'
                      : currentTheme === 'anime'
                      ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white border-transparent shadow-sm hover:opacity-90 font-bold'
                      : 'bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/30 hover:bg-[#00f3ff]/20 font-black'
                  ]"
                >
                  {{ busyAppId === item.appId && busyAction === 'upload' ? t('cloud.uploadBusy') : t('cloud.upload') }}
                </button>
                <button 
                  @click="handleDownload(item)" 
                  :disabled="!isVip || !!busyAppId || !item.hasCloud"
                  :title="!isVip ? t('cloud.vipOnly') : ''"
                  class="rounded font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed border cursor-pointer"
                  :class="[
                    btnSizeClass,
                    currentTheme === 'paper'
                      ? 'bg-[#ebf3f0] text-[#3e635b] border-[#c1d7d1] hover:bg-[#dcebe6]'
                      : currentTheme === 'anime'
                      ? 'bg-pink-50 text-[#ff66b2] border-[#ff9ec7] hover:bg-pink-100'
                      : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/[0.08]'
                  ]"
                >
                  {{ busyAppId === item.appId && busyAction === 'download' ? t('cloud.downloadBusy') : t('cloud.download') }}
                </button>

                <!-- 2. 本地工具：全员免费开放（不受 isVip 限制） -->
                <button 
                  @click="handleManualPack(item)" 
                  :disabled="!!busyAppId || !item.hasLocal"
                  class="rounded font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed border cursor-pointer"
                  :class="[
                    btnSizeClass,
                    currentTheme === 'paper'
                      ? 'bg-[#fffdf7] text-[#353024] border-[#5a4e38]/20 hover:bg-[#f6ebd0]'
                      : currentTheme === 'anime'
                      ? 'bg-white text-[#4a425a] border-[#e2d4f0] hover:bg-slate-50 hover:text-[#ff66b2]'
                      : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:bg-white/[0.08]'
                  ]"
                >
                  {{ t('cloud.localBackup') }}
                </button>
                <button 
                  @click="handleManualRestore(item)" 
                  :disabled="!!busyAppId"
                  class="rounded font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed border cursor-pointer"
                  :class="[
                    btnSizeClass,
                    currentTheme === 'paper'
                      ? 'bg-[#fffdf7] text-[#353024] border-[#5a4e38]/20 hover:bg-[#f6ebd0]'
                      : currentTheme === 'anime'
                      ? 'bg-white text-[#4a425a] border-[#e2d4f0] hover:bg-slate-50 hover:text-[#ff66b2]'
                      : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:bg-white/[0.08]'
                  ]"
                >
                  {{ t('cloud.localRestore') }}
                </button>

                <!-- 3. 删除存档：支持删本地 / 删云端 / 双删（云端操作需 VIP） -->
                <button 
                  @click="handleDelete(item)" 
                  :disabled="!!busyAppId || (!item.hasLocal && !(isVip && item.hasCloud))"
                  :title="!item.hasLocal && !isVip ? t('cloud.vipOnly') : ''"
                  class="rounded font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed border cursor-pointer"
                  :class="[
                    btnSizeClass,
                    currentTheme === 'paper'
                      ? 'bg-[#fbefe9] text-[#993e32] border-[#e3bcb3] hover:bg-[#f5e0d6]'
                      : currentTheme === 'anime'
                      ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                      : 'bg-red-950/30 text-red-400 border-red-900/30 hover:bg-red-900/50'
                  ]"
                >
                  {{ t('cloud.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from '../composables/useTheme'
import Swal from 'sweetalert2'
import { t } from '../i18n'

const { currentTheme } = useTheme()

interface CloudSaveItem {
  appId: string
  gameName: string
  headerImage: string
  hasLocal: boolean
  hasCloud: boolean
  cloudDate: string
}

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const authStore = useAuthStore()
const isVip = computed(() => authStore.isVip)

const accounts = ref<string[]>([])
const accountNames = ref<Record<string, string>>({})
const selectedAccount = ref('')

const duplicateAccountNames = computed(() => {
  const counts = new Map<string, number>()
  for (const acc of accounts.value) {
    const name = accountNames.value[acc]?.trim()
    if (!name) continue
    counts.set(name, (counts.get(name) || 0) + 1)
  }
  const dups = new Set<string>()
  for (const [name, cnt] of counts) {
    if (cnt > 1) dups.add(name)
  }
  return dups
})

const getAccountLabel = (accId: string) => {
  const name = accountNames.value[accId]?.trim()
  if (!name) return accId
  return duplicateAccountNames.value.has(name) ? `${name} (${accId})` : name
}

const getAccountTitle = (accId: string) => {
  const name = accountNames.value[accId]?.trim()
  return name ? `${name} (ID: ${accId})` : accId
}

const escapeHtml = (val: string) =>
  String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const items = ref<CloudSaveItem[]>([])
const loading = ref(false)
const busyAppId = ref('')
const busyAction = ref('')

const usedSlots = ref(0)
const maxSlots = ref(10)
const usedMb = ref(0)
const maxMb = ref(1024)

const close = () => emit('close')

// ================= 分辨率自适应 =================
const screenWidth = ref(window.innerWidth)
const updateScreenWidth = () => { screenWidth.value = window.innerWidth }

const modalWidth = computed(() => {
  const w = screenWidth.value
  if (w >= 3840) return 1400
  if (w >= 2560) return 1200
  if (w >= 1920) return 960
  return Math.min(Math.round(w * 0.92), 960)
})

const headerImgWidth = computed(() => {
  const w = screenWidth.value
  if (w >= 3840) return 320
  if (w >= 2560) return 280
  if (w >= 1920) return 214
  return 180
})
const headerImgHeight = computed(() => Math.round(headerImgWidth.value / 2.14))

// 列表项自适应高度与内边距
const itemHeight = computed(() => {
  const w = screenWidth.value
  if (w >= 3840) return 180
  if (w >= 2560) return 160
  return 140
})

const itemPaddingClass = computed(() => {
  const w = screenWidth.value
  if (w >= 3840) return 'p-5'
  if (w >= 2560) return 'p-4'
  return 'p-3'
})

const btnSizeClass = computed(() => {
  const w = screenWidth.value
  if (w >= 3840) return 'h-10 px-4 text-sm'
  if (w >= 2560) return 'h-9 px-3 text-xs'
  return 'h-8 px-3 text-xs'
})

// ================= 虚拟滚动 =================
const listRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const listHeight = ref(600)
const BUFFER_COUNT = 4

const virtualTotalHeight = computed(() => items.value.length * itemHeight.value)
const virtualStart = computed(() => Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - BUFFER_COUNT))
const virtualEnd = computed(() => Math.min(items.value.length, Math.ceil((scrollTop.value + listHeight.value) / itemHeight.value) + BUFFER_COUNT))
const virtualVisibleItems = computed(() => {
  return items.value.slice(virtualStart.value, virtualEnd.value).map((item, idx) => ({
    ...item,
    _virtualIndex: virtualStart.value + idx
  }))
})
const virtualOffsetY = computed(() => virtualStart.value * itemHeight.value)

const onListScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

let listRO: ResizeObserver | null = null
let refreshSeq = 0

watch(listRef, (el) => {
  listRO?.disconnect()
  listRO = null
  if (!el) return
  if (el.clientHeight > 0) listHeight.value = el.clientHeight
  listRO = new ResizeObserver(([entry]) => {
    listHeight.value = entry.contentRect.height
  })
  listRO.observe(el)
})

const resetScroll = () => {
  scrollTop.value = 0
  if (listRef.value) listRef.value.scrollTop = 0
}

const resetQuota = () => {
  usedSlots.value = 0
  maxSlots.value = 10
  usedMb.value = 0
  maxMb.value = 1024
}

watch(() => props.visible, (v) => {
  if (v) {
    resetScroll()
    refresh()
  } else {
    refreshSeq++
    loading.value = false
    selectedAccount.value = ''
    resetScroll()
  }
})

async function refresh(preferredAccount?: string) {
  const seq = ++refreshSeq
  const preferred = typeof preferredAccount === 'string' && preferredAccount ? preferredAccount : undefined
  loading.value = true
  items.value = []
  try {
    // 并发发起本地账号扫描与 VIP 云端列表拉取，避免网络阻塞本地秒开
    const cloudListPromise = isVip.value
      ? window.electron.invoke('cloudsave:list').catch((e: any) => {
          console.warn('[CloudSave] 拉取云端列表失败:', e)
          return null
        })
      : Promise.resolve(null)

    const scanRes = await window.electron.invoke('cloudsave:scan-accounts')
    if (seq !== refreshSeq) return
    accounts.value = scanRes.accounts || []
    accountNames.value = scanRes.accountNames || {}

    if (preferred) {
      if (!accounts.value.includes(preferred)) {
        accounts.value = [preferred, ...accounts.value]
      }
      selectedAccount.value = preferred
    } else if (accounts.value.length === 0) {
      selectedAccount.value = ''
    } else if (!selectedAccount.value || !accounts.value.includes(selectedAccount.value)) {
      selectedAccount.value = accounts.value[0]
    }

    let localItems: CloudSaveItem[] = []
    if (selectedAccount.value) {
      const localRes = await window.electron.invoke('cloudsave:scan-saves', selectedAccount.value)
      if (seq !== refreshSeq) return
      localItems = localRes.items || []
    }

    if (localItems.length > 0) {
      items.value = localItems.map((it) => ({ ...it, hasCloud: false, cloudDate: '' }))
      loading.value = false
    }

    if (isVip.value) {
      const listRes = scanRes.prefetchedCloudData ?? await cloudListPromise
      if (seq !== refreshSeq) return
      if (!listRes?.error && listRes?.data?.apps) {
        const cloudItems = listRes.data.apps
        usedSlots.value = listRes.data.quota?.used_slots || 0
        maxSlots.value = listRes.data.quota?.max_slots || 10
        usedMb.value = listRes.data.quota?.used_mb || 0
        maxMb.value = listRes.data.quota?.max_mb || 1024

        const merged = new Map<string, CloudSaveItem>()
        for (const it of localItems) {
          merged.set(it.appId, { ...it, hasCloud: false, cloudDate: '' })
        }
        for (const c of cloudItems) {
          const appId = String(c.app_id)
          if (merged.has(appId)) {
            const existing = merged.get(appId)!
            existing.hasCloud = c.has_backup
            existing.cloudDate = c.backup_at || ''
            if (c.game_name && (!existing.gameName || existing.gameName.startsWith('AppID: '))) {
              existing.gameName = c.game_name
            }
          } else {
            merged.set(appId, {
              appId,
              gameName: c.game_name || `AppID: ${appId}`,
              headerImage: `titan-img://steam/steam_gate_${appId}?header=1`,
              hasLocal: false,
              hasCloud: c.has_backup,
              cloudDate: c.backup_at || ''
            })
          }
        }
        items.value = Array.from(merged.values())
      } else {
        resetQuota()
      }
    } else {
      resetQuota()
    }
  } catch (e: any) {
    if (seq !== refreshSeq) return
    const isPaper = currentTheme.value === 'paper'
    Swal.fire({ title: t('cloud.scanFailed'), text: t(e.message), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
  } finally {
    if (seq === refreshSeq) {
      loading.value = false
    }
  }
}

function onAccountChange() {
  if (busyAppId.value) return
  resetScroll()
  refresh()
}

async function handleUpload(item: CloudSaveItem) {
  if (busyAppId.value) return
  const isPaper = currentTheme.value === 'paper'
  if (!isVip.value) {
    Swal.fire({
      title: t('cloud.vipTitle'),
      text: t('cloud.vipText'),
      icon: 'info',
      background: isPaper ? '#fffdf7' : '#121212',
      color: isPaper ? '#353024' : '#fff',
      confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
      confirmButtonText: t('cloud.vipConfirm')
    })
    return
  }
  if (!item.hasLocal) return
  busyAppId.value = item.appId
  busyAction.value = 'upload'
  try {
    const result = await window.electron.invoke('cloudsave:upload', selectedAccount.value, item.appId, item.gameName)
    if (result.success) {
      Swal.fire({ title: t('cloud.uploadSuccess'), text: t(result.msg), icon: 'success', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#667b48' : '#00f3ff' })
      await refresh()
    } else {
      Swal.fire({ title: t('cloud.uploadFailed'), text: t(result.msg), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
    }
  } catch (e: any) {
    Swal.fire({ title: t('cloud.uploadError'), text: t(e.message), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
  } finally {
    busyAppId.value = ''
    busyAction.value = ''
  }
}

const formatCloudSwalHtml = (rawHtml: string) => {
  if (currentTheme.value !== 'paper') return rawHtml
  return rawHtml
    .replace(/color:#aaa/gi, 'color:#6b6251')
    .replace(/color:#fff/gi, 'color:#353024')
    .replace(/color:#00f3ff/gi, 'color:#56693b')
    .replace(/color:#ef4444/gi, 'color:#993e32')
}

async function handleDownload(item: CloudSaveItem) {
  if (busyAppId.value) return
  const isPaper = currentTheme.value === 'paper'
  if (!isVip.value) {
    Swal.fire({
      title: t('cloud.vipTitle'),
      text: t('cloud.vipText'),
      icon: 'info',
      background: isPaper ? '#fffdf7' : '#121212',
      color: isPaper ? '#353024' : '#fff',
      confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
      confirmButtonText: t('cloud.vipConfirm')
    })
    return
  }
  if (!item.hasCloud) return
  const targetAccountLabel = selectedAccount.value ? getAccountLabel(selectedAccount.value) : t('cloud.autoAssignAccount')
  const confirm = await Swal.fire({
    title: t('cloud.restoreConfirmTitle'),
    html: formatCloudSwalHtml(t('cloud.restoreConfirmHtml', {
      game: escapeHtml(item.gameName || item.appId),
      account: escapeHtml(targetAccountLabel)
    })),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('cloud.confirmRestore'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
    cancelButtonColor: isPaper ? '#efe8d8' : '#333'
  })
  if (!confirm.isConfirmed) return

  busyAppId.value = item.appId
  busyAction.value = 'download'
  try {
    const result = await window.electron.invoke('cloudsave:download', selectedAccount.value, item.appId)
    if (result.success) {
      Swal.fire({ title: t('cloud.restoreDone'), text: result.msg ? t(result.msg) : t('cloud.restoreDoneDefault'), icon: 'success', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#667b48' : '#00f3ff' })
      await refresh(result.restoredAccountId)
    } else {
      Swal.fire({ title: t('cloud.restoreInfo'), text: t(result.msg), icon: 'info', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#667b48' : '#00f3ff' })
    }
  } catch (e: any) {
    Swal.fire({ title: t('cloud.restoreError'), text: t(e.message), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
  } finally {
    busyAppId.value = ''
    busyAction.value = ''
  }
}

async function handleManualPack(item: CloudSaveItem) {
  if (busyAppId.value || !item.hasLocal) return
  const isPaper = currentTheme.value === 'paper'
  busyAppId.value = item.appId
  busyAction.value = 'pack'
  try {
    const result = await window.electron.invoke('cloudsave:manual-pack', selectedAccount.value, item.appId)
    if (result.success) {
      Swal.fire({ title: t('cloud.packDone'), text: t('cloud.packDonePath', { path: result.path }), icon: 'success', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#667b48' : '#00f3ff' })
    } else if (result.msg !== 'ERR_CANCELLED') {
      Swal.fire({ title: t('cloud.packFailed'), text: t(result.msg), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
    }
  } catch (e: any) {
    Swal.fire({ title: t('cloud.packError'), text: t(e.message), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
  } finally {
    busyAppId.value = ''
    busyAction.value = ''
  }
}

async function handleManualRestore(item: CloudSaveItem) {
  if (busyAppId.value) return
  const targetAccountLabel = selectedAccount.value ? getAccountLabel(selectedAccount.value) : t('cloud.autoAssignAccount')
  const isPaper = currentTheme.value === 'paper'
  const confirm = await Swal.fire({
    title: t('cloud.importTitle'),
    html: formatCloudSwalHtml(t('cloud.importHtml', {
      game: escapeHtml(item.gameName || item.appId),
      account: escapeHtml(targetAccountLabel)
    })),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('cloud.chooseFileRestore'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
    cancelButtonColor: isPaper ? '#efe8d8' : '#333'
  })
  if (!confirm.isConfirmed) return

  busyAppId.value = item.appId
  busyAction.value = 'restore'
  try {
    const result = await window.electron.invoke('cloudsave:manual-restore', selectedAccount.value, item.appId)
    if (result.success) {
      Swal.fire({ title: t('cloud.importSuccess'), text: t(result.msg), icon: 'success', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#667b48' : '#00f3ff' })
      await refresh(result.restoredAccountId)
    } else if (result.msg !== 'ERR_CANCELLED') {
      Swal.fire({ title: t('cloud.restoreInfo'), text: t(result.msg), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
    }
  } catch (e: any) {
    Swal.fire({ title: t('cloud.restoreError'), text: t(e.message), icon: 'error', background: isPaper ? '#fffdf7' : '#121212', color: isPaper ? '#353024' : '#fff', confirmButtonColor: isPaper ? '#ba5243' : '#ef4444' })
  } finally {
    busyAppId.value = ''
    busyAction.value = ''
  }
}

type DeleteScope = 'cloud' | 'local' | 'both'

function getDeleteThemeVars(anime: boolean, paper = false): string {
  if (paper) {
    return '--tc-del-strong:#353024;--tc-del-muted:#6b6251;--tc-del-accent:#56693b;'
  }
  return anime
    ? '--tc-del-strong:#1e192b;--tc-del-muted:#4a425a;--tc-del-accent:#0284c7;'
    : '--tc-del-strong:#fff;--tc-del-muted:#aaa;--tc-del-accent:#00f3ff;'
}

function buildDeleteChoiceHtml(gameLabel: string, accountLabel: string, anime: boolean, paper = false): string {
  const borderColor = paper ? '#d8ceb8' : anime ? '#e2d4f0' : 'rgba(255,255,255,0.1)'
  const cardBg = paper ? '#f6f0e1' : anime ? '#f8f5ff' : 'rgba(255,255,255,0.03)'
  const headerColor = paper ? '#6b6251' : anime ? '#4a425a' : '#aaa'
  const titleColor = paper ? '#353024' : anime ? '#1e192b' : '#fff'
  const descColor = paper ? '#6b6251' : anime ? '#64748b' : '#9ca3af'
  const dangerColor = paper ? '#993e32' : anime ? '#dc2626' : '#f87171'

  const rowStyle = `display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid ${borderColor};background:${cardBg};cursor:pointer;text-align:left;`
  const radioStyle = `margin-top:3px;accent-color:${paper ? '#667b48' : anime ? '#ff66b2' : '#ef4444'};cursor:pointer;`
  const titleStyle = `font-size:13px;font-weight:700;color:${titleColor};line-height:1.4;`
  const descStyle = `font-size:11px;color:${descColor};margin-top:2px;line-height:1.4;`

  return [
    `<div style="${getDeleteThemeVars(anime, paper)}">`,
    `<div style="color:${headerColor};font-size:13px;line-height:1.5;text-align:left;margin-bottom:12px;">${t('cloud.deleteChoiceHeader', { game: escapeHtml(gameLabel), account: escapeHtml(accountLabel) })}</div>`,
    '<div style="display:flex;flex-direction:column;gap:8px;">',
    `<label style="${rowStyle}"><input type="radio" name="tc-cloud-del-scope" value="cloud" checked style="${radioStyle}" /><div><div style="${titleStyle}">${escapeHtml(t('cloud.deleteChoiceCloud'))}</div><div style="${descStyle}">${escapeHtml(t('cloud.deleteChoiceCloudDesc'))}</div></div></label>`,
    `<label style="${rowStyle}"><input type="radio" name="tc-cloud-del-scope" value="local" style="${radioStyle}" /><div><div style="${titleStyle}">${escapeHtml(t('cloud.deleteChoiceLocal'))}</div><div style="${descStyle}">${escapeHtml(t('cloud.deleteChoiceLocalDesc'))}</div></div></label>`,
    `<label style="${rowStyle}"><input type="radio" name="tc-cloud-del-scope" value="both" style="${radioStyle}" /><div><div style="${titleStyle};color:${dangerColor};">${escapeHtml(t('cloud.deleteChoiceBoth'))}</div><div style="${descStyle}">${escapeHtml(t('cloud.deleteChoiceBothDesc'))}</div></div></label>`,
    '</div>',
    '</div>'
  ].join('')
}

async function handleDelete(item: CloudSaveItem) {
  if (busyAppId.value) return
  const canDeleteLocal = item.hasLocal && !!selectedAccount.value
  const canDeleteCloud = isVip.value && item.hasCloud
  const isPaperTheme = currentTheme.value === 'paper'

  if (!canDeleteLocal && !canDeleteCloud) {
    if (!isVip.value && item.hasCloud) {
      Swal.fire({
        title: t('cloud.vipTitle'),
        text: t('cloud.vipText'),
        icon: 'info',
        background: isPaperTheme ? '#fffdf7' : '#121212',
        color: isPaperTheme ? '#353024' : '#fff',
        confirmButtonColor: isPaperTheme ? '#667b48' : '#00f3ff',
        confirmButtonText: t('cloud.vipConfirm')
      })
    }
    return
  }

  const isAnimeTheme = currentTheme.value === 'anime'
  const gameLabel = item.gameName || item.appId
  const accountLabel = selectedAccount.value ? getAccountLabel(selectedAccount.value) : t('cloud.autoAssignAccount')
  let scope: DeleteScope = canDeleteCloud ? 'cloud' : 'local'

  if (canDeleteLocal && canDeleteCloud) {
    const confirm = await Swal.fire({
      title: t('cloud.deleteConfirmTitle'),
      html: buildDeleteChoiceHtml(gameLabel, accountLabel, isAnimeTheme, isPaperTheme),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('cloud.confirmDelete'),
      cancelButtonText: t('common.cancel'),
      background: isPaperTheme ? '#fffdf7' : '#121212',
      color: isPaperTheme ? '#353024' : '#fff',
      confirmButtonColor: isPaperTheme ? '#ba5243' : '#ef4444',
      cancelButtonColor: isPaperTheme ? '#efe8d8' : '#333',
      preConfirm: () => {
        const checked = Swal.getPopup()?.querySelector('input[name="tc-cloud-del-scope"]:checked') as HTMLInputElement | null
        const val = checked?.value
        return val === 'local' || val === 'both' ? val : 'cloud'
      }
    })
    if (!confirm.isConfirmed) return
    scope = confirm.value === 'local' || confirm.value === 'both' ? confirm.value : 'cloud'
  } else {
    const innerHtml = scope === 'local'
      ? t('cloud.deleteLocalConfirmHtml', { game: escapeHtml(gameLabel), account: escapeHtml(accountLabel) })
      : t('cloud.deleteConfirmHtml', { game: escapeHtml(gameLabel) })
    const confirmHtml = `<div style="${getDeleteThemeVars(isAnimeTheme, isPaperTheme)}">${innerHtml}</div>`
    const confirm = await Swal.fire({
      title: t('cloud.deleteConfirmTitle'),
      html: confirmHtml,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('cloud.confirmDelete'),
      cancelButtonText: t('common.cancel'),
      background: isPaperTheme ? '#fffdf7' : '#121212',
      color: isPaperTheme ? '#353024' : '#fff',
      confirmButtonColor: isPaperTheme ? '#ba5243' : '#ef4444',
      cancelButtonColor: isPaperTheme ? '#efe8d8' : '#333'
    })
    if (!confirm.isConfirmed) return
  }

  busyAppId.value = item.appId
  busyAction.value = 'delete'
  try {
    const result = await window.electron.invoke('cloudsave:delete', item.appId, {
      scope,
      accountId: selectedAccount.value
    })
    if (result.success) {
      const doneKey = scope === 'both'
        ? 'cloud.deletedBothText'
        : (scope === 'local' ? 'cloud.deletedLocalText' : 'cloud.deletedText')
      Swal.fire({ title: t('cloud.deleted'), text: t(doneKey), icon: 'success', background: isPaperTheme ? '#fffdf7' : '#121212', color: isPaperTheme ? '#353024' : '#fff', confirmButtonColor: isPaperTheme ? '#667b48' : '#00f3ff' })
      await refresh()
    } else {
      if (result.partialCloudDeleted) {
        await refresh()
      }
      Swal.fire({ title: t('cloud.deleteFailed'), text: t(result.msg), icon: 'error', background: isPaperTheme ? '#fffdf7' : '#121212', color: isPaperTheme ? '#353024' : '#fff', confirmButtonColor: isPaperTheme ? '#ba5243' : '#ef4444' })
    }
  } catch (e: any) {
    Swal.fire({ title: t('cloud.deleteError'), text: t(e.message), icon: 'error', background: isPaperTheme ? '#fffdf7' : '#121212', color: isPaperTheme ? '#353024' : '#fff', confirmButtonColor: isPaperTheme ? '#ba5243' : '#ef4444' })
  } finally {
    busyAppId.value = ''
    busyAction.value = ''
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  if (props.visible) refresh()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
  listRO?.disconnect()
  listRO = null
})
</script>

<style scoped>
.cloudsave-fade-enter-active,
.cloudsave-fade-leave-active {
  transition: opacity 0.25s ease;
}
.cloudsave-fade-enter-from,
.cloudsave-fade-leave-to {
  opacity: 0;
}
.animate-scale-in {
  animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
<template>
  <BaseModal
    :visible="visible"
    @close="$emit('close')"
    :show-close="true"
    :container-class="containerClass"
  >
    <div 
      class="absolute top-0 left-0 w-full h-0.5" 
      :class="currentTheme === 'paper' ? 'bg-gradient-to-r from-[#a8ba78]/35 via-[#667b48]/65 to-[#d4b77b]/40' : currentTheme === 'anime' ? 'bg-gradient-to-r from-transparent via-[#ff85b3] to-transparent' : 'bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent'"
    ></div>

    <div class="flex items-center gap-3 mb-6 border-b pb-4" :class="currentTheme === 'paper' ? 'border-[#5a4e38]/12' : currentTheme === 'anime' ? 'border-[#e2d4f0]' : 'border-white/5'">
      <span class="text-sm font-bold tracking-wide" :class="titleTextClass">{{ t('docs.title') }}</span>
    </div>

    <div class="flex items-center gap-2 mb-6">
      <button
        v-for="tab in docTabs"
        :key="tab.id"
        @click="activeDocTab = tab.id"
        class="px-5 py-2.5 rounded-lg text-sm font-bold font-code tracking-widest transition-all border"
        :class="getTabClass(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
      <!-- 入库方法 -->
      <div v-if="activeDocTab === 'deploy'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.deploy') }}</h3>
        <div class="space-y-3">
          <div class="rounded-xl p-5" :class="cardBgClass">
            <div class="flex items-center gap-3 mb-3">
              <span class="w-8 h-8 rounded-lg font-bold font-code text-sm flex items-center justify-center border" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] text-[#3f5b32] border-[#c7d8b8]' : 'bg-primary/20 text-primary font-black border-primary/30'">01</span>
              <span class="text-sm font-bold" :class="currentTheme === 'paper' ? 'text-[#353024]' : 'text-primary'">{{ t('docs.deploy.step1.title') }}</span>
            </div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.deploy.step1.desc') }}</p>
          </div>
          <div class="rounded-xl p-5" :class="cardBgClass">
            <div class="flex items-center gap-3 mb-3">
              <span class="w-8 h-8 rounded-lg font-bold font-code text-sm flex items-center justify-center border" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] text-[#3f5b32] border-[#c7d8b8]' : 'bg-primary/20 text-primary font-black border-primary/30'">02</span>
              <span class="text-sm font-bold" :class="currentTheme === 'paper' ? 'text-[#353024]' : 'text-primary'">{{ t('docs.deploy.step2.title') }}</span>
            </div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.deploy.step2.desc') }}</p>
          </div>
          <div class="rounded-xl p-5" :class="cardBgClass">
            <div class="flex items-center gap-3 mb-3">
              <span class="w-8 h-8 rounded-lg font-bold font-code text-sm flex items-center justify-center border" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] text-[#3f5b32] border-[#c7d8b8]' : 'bg-primary/20 text-primary font-black border-primary/30'">03</span>
              <span class="text-sm font-bold" :class="currentTheme === 'paper' ? 'text-[#353024]' : 'text-primary'">{{ t('docs.deploy.step3.title') }}</span>
            </div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.deploy.step3.desc') }}</p>
          </div>
        </div>
      </div>

      <!-- 补丁使用 -->
      <div v-if="activeDocTab === 'patch'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.patch') }}</h3>
        <div class="space-y-3">
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#a87628]' : currentTheme === 'anime' ? 'bg-amber-50/60 border-yellow-400' : 'border-yellow-500 bg-yellow-500/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#7d5619]' : 'text-yellow-400'">{{ t('docs.patch.denuvo.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.patch.denuvo.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#5c7d4c]' : currentTheme === 'anime' ? 'bg-emerald-50/60 border-green-400' : 'border-green-500 bg-green-500/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'text-green-400'">{{ t('docs.patch.movieGame.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.patch.movieGame.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#ebf3f0] border-[#5b827a]' : currentTheme === 'anime' ? 'bg-sky-50/60 border-primary' : 'border-primary bg-primary/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3e635b]' : 'text-primary'">{{ t('docs.patch.onlineFix.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.patch.onlineFix.desc') }}</p>
          </div>
        </div>
      </div>

      <!-- 联机说明 -->
      <div v-if="activeDocTab === 'multiplayer'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.multiplayer') }}</h3>
        <div class="rounded-xl p-5 mb-4 border" :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#e4cca0]' : currentTheme === 'anime' ? 'bg-amber-50/80 border-amber-200' : 'bg-yellow-500/5 border-yellow-500/20'">
          <div class="flex items-center gap-2 font-bold text-sm mb-3" :class="currentTheme === 'paper' ? 'text-[#7d5619]' : 'text-yellow-400'">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" /></svg>
            <span>{{ t('docs.multiplayer.warningTitle') }}</span>
          </div>
          <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.multiplayer.warningDesc') }}</p>
        </div>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#a87628]' : 'bg-yellow-500 shadow-[0_0_5px_#eab308]'"></span>
            <span class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.multiplayer.rule1') }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#a87628]' : 'bg-yellow-500 shadow-[0_0_5px_#eab308]'"></span>
            <span class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.multiplayer.rule2') }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#a87628]' : 'bg-yellow-500 shadow-[0_0_5px_#eab308]'"></span>
            <span class="text-sm leading-relaxed" :class="descTextClass">
              {{ t('docs.multiplayer.rule3Prefix') }}<span class="font-bold" :class="currentTheme === 'paper' ? 'text-[#993e32]' : 'text-red-400'">{{ t('docs.multiplayer.rule3Highlight') }}</span>{{ t('docs.multiplayer.rule3Suffix') }}
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full mt-2 shrink-0" :class="currentTheme === 'paper' ? 'bg-[#a87628]' : 'bg-yellow-500 shadow-[0_0_5px_#eab308]'"></span>
            <span class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.multiplayer.rule4') }}</span>
          </li>
        </ul>
      </div>

      <!-- DLC解锁 -->
      <div v-if="activeDocTab === 'dlc'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.dlc') }}</h3>
        <div class="space-y-3">
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#ebf3f0] border-[#5b827a]' : currentTheme === 'anime' ? 'border-primary bg-sky-50/60' : 'border-primary bg-primary/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3e635b]' : 'text-primary'">{{ t('docs.dlc.unlock.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.dlc.unlock.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#a87628]' : currentTheme === 'anime' ? 'border-yellow-500 bg-amber-50/60' : 'border-yellow-500 bg-yellow-500/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#7d5619]' : 'text-yellow-400'">{{ t('docs.dlc.missing.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.dlc.missing.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#5c7d4c]' : currentTheme === 'anime' ? 'border-green-500 bg-emerald-50/60' : 'border-green-500 bg-green-500/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'text-green-400'">{{ t('docs.dlc.safety.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.dlc.safety.desc') }}</p>
          </div>
        </div>
      </div>

      <!-- 内置功能 -->
      <div v-if="activeDocTab === 'builtin'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.builtin') }}</h3>
        <div class="space-y-3">
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#5c7d4c]' : currentTheme === 'anime' ? 'border-primary bg-sky-50/60' : 'border-primary bg-primary/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'text-primary'">{{ t('docs.builtin.download.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.builtin.download.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#ebf3f0] border-[#5b827a]' : currentTheme === 'anime' ? 'border-blue-400 bg-blue-50/60' : 'border-blue-400 bg-blue-400/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#3e635b]' : 'text-blue-400'">{{ t('docs.builtin.engine.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.builtin.engine.desc') }}</p>
          </div>
          <div class="border-l-2 rounded-r-xl p-5" :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#a87628]' : currentTheme === 'anime' ? 'border-purple-400 bg-purple-50/60' : 'border-purple-400 bg-purple-400/5'">
            <div class="font-bold mb-2 text-sm" :class="currentTheme === 'paper' ? 'text-[#7d5619]' : 'text-purple-400'">{{ t('docs.builtin.minigame.title') }}</div>
            <p class="text-sm leading-relaxed" :class="descTextClass">{{ t('docs.builtin.minigame.desc') }}</p>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div v-if="activeDocTab === 'faq'" class="space-y-4 animate-fade-in">
        <h3 class="text-base font-bold tracking-wide mb-4" :class="titleTextClass">{{ t('docs.tabs.faq') }}</h3>
        <div class="space-y-2">
          <div 
            v-for="(item, idx) in faqItems" 
            :key="idx" 
            class="rounded-xl overflow-hidden transition-colors"
            :class="cardBgClass"
          >
            <button
              @click="faqOpen = faqOpen === idx ? -1 : idx"
              class="w-full flex items-center justify-between p-4 text-left transition-colors"
              :class="currentTheme === 'paper' ? 'hover:bg-[#f6ebd0]/65 text-[#353024]' : currentTheme === 'anime' ? 'hover:bg-slate-100 text-[#1e192b]' : 'hover:bg-white/5 text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <span 
                  class="text-[10px] font-code px-1.5 py-0.5 rounded border"
                  :class="currentTheme === 'paper' ? 'text-[#7d5619] bg-[#fbf3df] border-[#e4cca0]' : currentTheme === 'anime' ? 'text-[#ff66b2] bg-pink-100 border-pink-200' : 'text-primary bg-primary/10 border-primary/20'"
                >{{ item.code }}</span>
                <span class="font-bold text-sm" :class="currentTheme === 'paper' ? 'text-[#353024]' : currentTheme === 'anime' ? 'text-[#1e192b]' : 'text-gray-300'">{{ item.q }}</span>
              </div>
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="transition-transform duration-300 shrink-0"
                :class="[
                  faqOpen === idx ? 'rotate-180' : '',
                  currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-400' : 'text-gray-500'
                ]"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="faqOpen === idx"
              class="px-4 pb-4 text-sm leading-relaxed animate-slide-in-up"
              :class="descTextClass"
            >
              {{ item.a }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import BaseModal from './common/BaseModal.vue'
import { t } from '../i18n'
import { useTheme } from '../composables/useTheme'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { currentTheme } = useTheme()

const onEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !e.isComposing) {
    e.stopImmediatePropagation()
    emit('close')
  }
}
watch(() => props.visible, (v) => {
  if (v) window.addEventListener('keydown', onEsc)
  else window.removeEventListener('keydown', onEsc)
}, { immediate: true })
onUnmounted(() => window.removeEventListener('keydown', onEsc))

const activeDocTab = ref('deploy')
const faqOpen = ref(-1)

const containerClass = computed(() => {
  if (currentTheme.value === 'paper') {
    return 'max-w-4xl w-full bg-[#fffdf7] border border-[#5a4e38]/15 rounded-2xl p-8 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] text-[#353024]'
  }
  if (currentTheme.value === 'anime') {
    return 'max-w-4xl w-full bg-white/95 border-2 border-[#ffc2d9] rounded-3xl p-8 shadow-[0_20px_60px_rgba(255,140,185,0.22)] text-[#4a3240]'
  }
  if (currentTheme.value === 'minimal') {
    return 'max-w-4xl w-full bg-[#0e1526]/78 border border-white/20 rounded-3xl p-8 shadow-[0_28px_70px_rgba(0,0,0,0.68),inset_0_1.5px_1px_rgba(255,255,255,0.38)] text-[#f4f8ff] backdrop-blur-3xl'
  }
  return 'max-w-4xl w-full bg-[#0e0e14] border border-white/10 p-8 shadow-[0_0_40px_rgba(0,243,255,0.08)] text-white'
})

const getTabClass = (tabId: string) => {
  const isActive = activeDocTab.value === tabId
  if (currentTheme.value === 'paper') {
    return isActive
      ? 'bg-[#f2dfb4] text-[#352d1e] border-[#d4b77b] shadow-sm'
      : 'bg-[#f6f0e1] text-[#6b6251] border-[#5a4e38]/15 hover:bg-[#f6ebd0] hover:text-[#353024] hover:border-[#8c764c]/35'
  }
  if (currentTheme.value === 'anime') {
    return isActive
      ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ff98c3] text-white border-transparent shadow-[0_4px_16px_rgba(255,133,179,0.35)]'
      : 'bg-[#fff5f9] text-[#8a6a7b] border-[#ffd6e7] hover:text-[#ff66a3] hover:border-[#ffa6ca]'
  }
  if (currentTheme.value === 'minimal') {
    return isActive
      ? 'bg-white/15 text-white border-white/35 shadow-[0_6px_18px_rgba(125,211,252,0.22),inset_0_1px_1px_rgba(255,255,255,0.4)]'
      : 'bg-white/5 text-[#8ea4c8] border-white/10 hover:text-white hover:border-white/25'
  }
  return isActive
    ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
    : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:border-white/10'
}

const cardBgClass = computed(() => {
  if (currentTheme.value === 'paper') return 'bg-[#f6f0e1] border border-[#5a4e38]/15'
  if (currentTheme.value === 'anime') return 'bg-slate-50 border border-slate-200'
  return 'bg-white/5 border border-white/10'
})

const descTextClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#6b6251]'
  if (currentTheme.value === 'anime') return 'text-[#554c66]'
  return 'text-gray-400'
})

const titleTextClass = computed(() => {
  if (currentTheme.value === 'paper') return 'text-[#353024]'
  if (currentTheme.value === 'anime') return 'text-[#1e192b]'
  return 'text-white'
})

const docTabs = computed(() => [
  { id: 'deploy', label: t('docs.tabs.deploy') },
  { id: 'patch', label: t('docs.tabs.patch') },
  { id: 'multiplayer', label: t('docs.tabs.multiplayer') },
  { id: 'dlc', label: t('docs.tabs.dlc') },
  { id: 'builtin', label: t('docs.tabs.builtin') },
  { id: 'faq', label: t('docs.tabs.faq') }
])

const faqItems = computed(() => [
  { code: 'ERR_NODE_FAIL', q: t('docs.faq.errNodeFail.q'), a: t('docs.faq.errNodeFail.a') },
  { code: 'QUOTA_EXHAUSTED', q: t('docs.faq.quotaExhausted.q'), a: t('docs.faq.quotaExhausted.a') },
  { code: 'ERR_ENGINE_DEPLOY_FAIL', q: t('docs.faq.engineDeployFail.q'), a: t('docs.faq.engineDeployFail.a') },
  { code: 'ERR_STEAM_MISSING', q: t('docs.faq.steamMissing.q'), a: t('docs.faq.steamMissing.a') },
  { code: 'ERR_INVALID_ENTRY', q: t('docs.faq.invalidEntry.q'), a: t('docs.faq.invalidEntry.a') },
  { code: 'ERR_NO_INTERNET', q: t('docs.faq.noInternet.q'), a: t('docs.faq.noInternet.a') },
  { code: 'ERR_GAME_WONT_START', q: t('docs.faq.gameWontStart.q'), a: t('docs.faq.gameWontStart.a') },
  { code: 'ERR_UPDATE_FAIL', q: t('docs.faq.updateFail.q'), a: t('docs.faq.updateFail.a') }
])
</script>

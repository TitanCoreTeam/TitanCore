<template>
  <div 
    class="h-full w-full relative overflow-hidden select-none flex flex-col animate-fade-in transition-colors duration-300"
    :class="currentTheme === 'paper' ? 'is-paper bg-transparent text-[#353024]' : currentTheme === 'anime' ? 'bg-transparent text-[#1e192b]' : (currentTheme === 'minimal' ? 'bg-transparent text-white' : 'bg-[#020205] text-white')"
  >
    <!-- 顶栏 -->
    <div class="shrink-0 flex items-center justify-between px-8 py-5 z-20">
      <!-- 左侧：标题 + TAB -->
      <div class="flex items-center gap-6">
        <div 
          class="text-xl tracking-[0.15em] transition-all"
          :class="currentTheme === 'paper'
            ? 'font-bold text-[#353024]'
            : currentTheme === 'anime' 
            ? 'font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff66a3] to-[#ff98c3] drop-shadow-[0_2px_8px_rgba(255,107,157,0.28)]' 
            : 'font-black text-[#00f3ff]'" 
          :style="currentTheme !== 'anime' && currentTheme !== 'paper' ? 'text-shadow:0 0 12px rgba(0,243,255,0.4)' : ''"
        >
          ARCADE
        </div>

        <!-- TAB 切换 -->
        <div 
          class="flex items-center rounded-2xl p-1 border transition-all"
          :class="currentTheme === 'paper'
            ? 'bg-[#f6f0e1] border-[#5a4e38]/15 shadow-sm'
            : currentTheme === 'anime' 
            ? 'bg-white/85 border-[#ffd6e7] shadow-sm' 
            : (currentTheme === 'minimal'
              ? 'bg-[#0e1526]/72 border-white/20 shadow-[0_10px_28px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl'
              : 'bg-white/[0.03] border-white/[0.08]')"
        >
          <button 
            @click="activeTab = 'mini'"
            class="px-4 py-1.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer"
            :class="activeTab === 'mini' 
              ? (currentTheme === 'paper' ? 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ff98c3] text-white shadow-sm' : 'bg-[#00f3ff]/15 text-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.1)]') 
              : (currentTheme === 'paper' ? 'text-[#6b6251] hover:text-[#353024]' : currentTheme === 'anime' ? 'text-[#8a6a7b] hover:text-[#ff66a3]' : 'text-zinc-500 hover:text-zinc-300')"
          >
            {{ t('lobby.tabMini') }}
          </button>
          <button 
            @click="activeTab = 'indie'"
            class="px-4 py-1.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer"
            :class="activeTab === 'indie' 
              ? (currentTheme === 'paper' ? 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ff98c3] text-white shadow-sm' : 'bg-[#00f3ff]/15 text-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.1)]') 
              : (currentTheme === 'paper' ? 'text-[#6b6251] hover:text-[#353024]' : currentTheme === 'anime' ? 'text-[#8a6a7b] hover:text-[#ff66a3]' : 'text-zinc-500 hover:text-zinc-300')"
          >
            {{ t('lobby.tabIndie') }}
          </button>
        </div>
      </div>

      <!-- 右侧：兑换中心按钮 -->
      <button 
        @click="openRedeemModal"
        class="flex items-center gap-2 border rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
        :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#e4cca0] text-[#7d5619] hover:bg-[#f2dfb4]' : currentTheme === 'anime' ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' : 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-300'"
      >
        <svg class="w-4 h-4" :class="currentTheme === 'paper' ? 'text-[#a87628]' : 'text-yellow-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="text-sm font-bold tracking-wider">{{ t('lobby.redeemTitle') }}</span>
        <span
          v-if="redeemableCoresCount > 0"
          class="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md"
          :class="currentTheme === 'paper' ? 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b]/60' : currentTheme === 'anime' ? 'bg-amber-200/80 text-amber-900 font-black' : 'bg-yellow-400/20 text-yellow-300 font-black'"
        >
          {{ redeemableCoresCount }} CORE
        </span>
      </button>
    </div>

    <!-- 内容区 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide px-8 relative z-10" :class="currentTheme === 'minimal' ? 'pb-28' : 'pb-8'">

      <!-- ========== 小游戏 Tab ========== -->
      <div v-if="activeTab === 'mini'" class="animate-fade-in pt-2">
        <!-- 网格：默认 3 列，xl 以上 4 列 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl">
          <!-- 巴达布前哨 -->
          <div 
            class="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            :class="currentTheme === 'paper'
              ? 'bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_8px_24px_-10px_rgba(62,54,38,0.12)] hover:border-[#667b48]/60'
              : currentTheme === 'anime' 
              ? 'bg-white/95 border-2 border-[#ffc2d9] shadow-[0_8px_22px_rgba(255,140,185,0.18)] hover:border-[#ff85b3] hover:shadow-[0_14px_30px_rgba(255,133,179,0.28)]' 
              : (currentTheme === 'minimal'
                ? 'bg-[#0e1526]/72 border border-white/18 hover:border-[#7dd3fc]/50 shadow-[0_12px_34px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl'
                : 'bg-[#0a0a12] border border-white/[0.08] hover:border-[#00f3ff]/40')"
            @contextmenu.prevent="onCardContextMenu('badab', $event, 'mini')"
          >
            <div 
              class="relative w-full aspect-[3/2] overflow-hidden"
              :class="currentTheme === 'paper' ? 'bg-gradient-to-br from-[#ebf3f0] via-[#f4efe2] to-[#eef4e8]' : currentTheme === 'anime' ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-pink-50' : 'bg-black/60'"
            >
              <div 
                v-if="currentTheme !== 'anime' && currentTheme !== 'paper'" 
                class="absolute inset-0 bg-gradient-to-br from-[#2b8a3e]/10 via-transparent to-[#00f3ff]/10 group-hover:from-[#2b8a3e]/20 group-hover:to-[#00f3ff]/20 transition-all duration-500" 
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <svg 
                  class="w-24 h-24 transition-all duration-300 group-hover:scale-110" 
                  :class="currentTheme === 'paper' ? 'text-[#5c7d4c]/80 group-hover:text-[#5c7d4c]' : currentTheme === 'anime' ? 'text-emerald-600/70 group-hover:text-emerald-700' : 'text-[#2b8a3e]/50 group-hover:text-[#2b8a3e]/70'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div 
                class="absolute bottom-0 left-0 right-0 h-px transition-opacity opacity-0 group-hover:opacity-100" 
                :class="currentTheme === 'paper' ? 'bg-gradient-to-r from-transparent via-[#667b48]/60 to-transparent' : currentTheme === 'anime' ? 'bg-gradient-to-r from-transparent via-[#ff85b3] to-transparent' : 'bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent'"
              />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 
                  class="font-bold text-lg tracking-wide transition-colors font-sans"
                  :class="currentTheme === 'paper' ? 'text-[#353024] group-hover:text-[#56693b]' : currentTheme === 'anime' ? 'text-[#1e192b] group-hover:text-[#ff66b2]' : 'text-white group-hover:text-[#00f0ff]'"
                >
                  {{ t('lobby.badabTitle') }}
                </h3>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span
                    class="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
                    :class="authStore.minigameRewards.badab.claimed
                      ? (currentTheme === 'paper' ? 'text-[#3f5b32] bg-[#eef4e8] border border-[#c7d8b8]' : currentTheme === 'anime' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30')
                      : (currentTheme === 'paper' ? 'text-[#7d5619] bg-[#fbf3df] border border-[#e4cca0]' : currentTheme === 'anime' ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-amber-300 bg-amber-500/15 border border-amber-500/30')"
                  >
                    {{ authStore.minigameRewards.badab.claimed ? t('lobby.badgeDayCardClaimed') : t('lobby.badgeDayCard') }}
                  </span>
                  <span 
                    class="text-xs font-bold px-2 py-0.5 rounded font-mono"
                    :class="currentTheme === 'paper' ? 'text-[#3f5b32] bg-[#eef4e8] border border-[#c7d8b8]' : currentTheme === 'anime' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-zinc-500 border border-white/10'"
                  >
                    CARD
                  </span>
                </div>
              </div>
              <p 
                class="text-base mb-5 leading-relaxed"
                :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#4a425a]' : 'text-zinc-400'"
              >
                {{ t('lobby.badabDesc') }}
              </p>
              <div class="flex gap-2">
                <!-- R37b 安装态机：安装中 > 失败重试 > 未安装安装 > 已安装原按钮组 -->
                <button
                  v-if="miniGameInstalling['badab']"
                  disabled
                  class="flex-1 py-2.5 rounded-lg text-base font-bold tracking-wider cursor-wait overflow-hidden relative"
                  :class="currentTheme === 'paper' ? 'bg-[#ece4d2] border border-[#5a4e38]/20 text-[#6b6251]' : currentTheme === 'anime' ? 'bg-slate-100 border border-slate-300 text-slate-500' : 'bg-white/5 border border-white/20 text-white/50'"
                >
                  {{ t('lobby.installingBtn') }}
                  <span class="indet-track"><span class="indet-bar" /></span>
                </button>
                <button
                  v-else-if="miniGameError['badab']"
                  @click.stop="installMiniGame('badab')"
                  class="flex-1 py-2.5 border rounded-lg text-base font-bold tracking-wider transition-all"
                  :class="currentTheme === 'paper' ? 'bg-[#fbefe9] hover:bg-[#f5e1d8] border-[#e3bcb3] text-[#993e32]' : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-500'"
                >
                  {{ t('lobby.installRetry') }}
                </button>
                <button
                  v-else-if="!miniGameInstalled['badab']"
                  @click.stop="installMiniGame('badab')"
                  class="flex-1 py-2.5 rounded-lg text-base font-bold tracking-wider transition-all"
                  :class="currentTheme === 'paper'
                    ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                    : currentTheme === 'anime' 
                    ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white shadow-sm border border-white/75 rounded-xl' 
                    : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 text-[#00f3ff]'"
                >
                  {{ t('lobby.installGame') }}
                </button>
                <template v-else>
                <button 
                  v-if="hasBadabSave"
                  @click.stop="launchVueGame('badab', true)" 
                  class="flex-1 py-2.5 rounded-lg text-base font-bold tracking-wider transition-all"
                  :class="currentTheme === 'paper'
                    ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                    : currentTheme === 'anime'
                    ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ff98c3] text-white shadow-sm border border-white/75 rounded-xl'
                    : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 text-[#00f3ff]'"
                >
                  {{ t('lobby.continueBtn') }}
                </button>
                <button 
                  @click.stop="launchVueGame('badab', false)" 
                  class="flex-1 py-2.5 rounded-lg text-base font-bold tracking-wider transition-all"
                  :class="[
                    !hasBadabSave ? 'w-full' : '',
                    currentTheme === 'paper'
                      ? 'bg-[#f6f0e1] hover:bg-[#f6ebd0] border border-[#5a4e38]/20 text-[#353024]'
                      : currentTheme === 'anime'
                      ? 'bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#d6336c]'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white'
                  ]"
                >
                  {{ hasBadabSave ? t('lobby.newGame') : t('lobby.playBtn') }}
                </button>
                </template>
              </div>
              <div v-if="miniGameError['badab']" class="mt-2 text-xs font-code tracking-wider break-all" :class="currentTheme === 'paper' ? 'text-[#993e32]' : 'text-red-500'">{{ miniGameErrorMsg['badab'] }}</div>
            </div>
          </div>

          <!-- 太空猫 -->
          <div 
            class="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            :class="currentTheme === 'paper'
              ? 'bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_8px_24px_-10px_rgba(62,54,38,0.12)] hover:border-[#a87628]/60'
              : currentTheme === 'anime' 
              ? 'bg-white/95 border-2 border-[#ffc2d9] shadow-[0_8px_22px_rgba(255,140,185,0.18)] hover:border-[#ff85b3] hover:shadow-[0_14px_30px_rgba(255,133,179,0.28)]' 
              : (currentTheme === 'minimal'
                ? 'bg-[#0e1526]/72 border border-white/18 hover:border-[#7dd3fc]/50 shadow-[0_12px_34px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl'
                : 'bg-[#0a0a12] border border-white/[0.08] hover:border-[#fbbf24]/40')"
            @click="launchVueGame('starcat')"
            @contextmenu.prevent="onCardContextMenu('starcat', $event, 'mini')"
          >
            <div 
              class="relative w-full aspect-[3/2] overflow-hidden"
              :class="currentTheme === 'paper' ? 'bg-gradient-to-br from-[#fbf3df] via-[#f4efe2] to-[#eef4e8]' : currentTheme === 'anime' ? 'bg-gradient-to-br from-amber-50 via-pink-50 to-sky-50' : 'bg-black/60'"
            >
              <div 
                v-if="currentTheme !== 'anime' && currentTheme !== 'paper'"
                class="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/10 via-transparent to-[#f472b6]/10 group-hover:from-[#fbbf24]/20 group-hover:to-[#f472b6]/20 transition-all duration-500" 
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <svg 
                  class="w-24 h-24 transition-all duration-300 group-hover:scale-110" 
                  :class="currentTheme === 'paper' ? 'text-[#a87628]/80 group-hover:text-[#a87628]' : currentTheme === 'anime' ? 'text-amber-600/70 group-hover:text-amber-700' : 'text-[#fbbf24]/40 group-hover:text-[#fbbf24]/60'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div 
                class="absolute bottom-0 left-0 right-0 h-px transition-opacity opacity-0 group-hover:opacity-100" 
                :class="currentTheme === 'paper' ? 'bg-gradient-to-r from-transparent via-[#a87628]/60 to-transparent' : currentTheme === 'anime' ? 'bg-gradient-to-r from-transparent via-[#ff85b3] to-transparent' : 'bg-gradient-to-r from-transparent via-[#fbbf24]/50 to-transparent'"
              />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 
                  class="font-bold text-lg tracking-wide transition-colors font-sans"
                  :class="currentTheme === 'paper' ? 'text-[#353024] group-hover:text-[#7d5619]' : currentTheme === 'anime' ? 'text-[#1e192b] group-hover:text-[#ff66b2]' : 'text-white group-hover:text-[#fbbf24]'"
                >
                  {{ t('lobby.starcatTitle') }}
                </h3>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span
                    class="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
                    :class="getGameUsed('starcat') >= maxPerGame
                      ? (currentTheme === 'paper' ? 'text-[#3f5b32] bg-[#eef4e8] border border-[#c7d8b8]' : currentTheme === 'anime' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30')
                      : (currentTheme === 'paper' ? 'text-[#3e635b] bg-[#ebf3f0] border border-[#c1d7d1]' : currentTheme === 'anime' ? 'text-sky-700 bg-sky-50 border border-sky-200' : 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30')"
                  >
                    {{ t('lobby.redeemQuotaProgress', { used: getGameUsed('starcat'), max: maxPerGame }) }}
                  </span>
                  <span 
                    class="text-xs font-bold px-2 py-0.5 rounded font-mono"
                    :class="currentTheme === 'paper' ? 'text-[#7d5619] bg-[#fbf3df] border border-[#e4cca0]' : currentTheme === 'anime' ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-zinc-500 border border-white/10'"
                  >
                    STAR
                  </span>
                </div>
              </div>
              <p 
                class="text-base mb-5 leading-relaxed"
                :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#4a425a]' : 'text-zinc-400'"
              >
                {{ t('lobby.starcatDesc') }}
              </p>
              <button
                v-if="miniGameInstalling['starcat']"
                disabled
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider cursor-wait overflow-hidden relative"
                :class="currentTheme === 'paper' ? 'bg-[#ece4d2] border border-[#5a4e38]/20 text-[#6b6251]' : currentTheme === 'anime' ? 'bg-slate-100 border border-slate-300 text-slate-500' : 'bg-white/5 border border-white/20 text-white/50'"
              >
                {{ t('lobby.installingBtn') }}
                <span class="indet-track"><span class="indet-bar" /></span>
              </button>
              <button
                v-else-if="miniGameError['starcat']"
                @click.stop="installMiniGame('starcat')"
                class="w-full py-2.5 border rounded-lg text-base font-bold tracking-wider transition-all"
                :class="currentTheme === 'paper' ? 'bg-[#fbefe9] hover:bg-[#f5e1d8] border-[#e3bcb3] text-[#993e32]' : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-500'"
              >
                {{ t('lobby.installRetry') }}
              </button>
              <button
                v-else-if="!miniGameInstalled['starcat']"
                @click.stop="installMiniGame('starcat')"
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider transition-all"
                :class="currentTheme === 'paper'
                  ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                  : currentTheme === 'anime'
                  ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white shadow-sm border border-white/75 rounded-xl'
                  : 'bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24]'"
              >
                {{ t('lobby.installGame') }}
              </button>
              <button
                v-else
                @click.stop="launchVueGame('starcat')"
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider transition-all"
                :class="currentTheme === 'paper'
                  ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                  : currentTheme === 'anime'
                  ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white shadow-sm border border-white/75 rounded-xl'
                  : 'bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] group-hover:shadow-[0_0_12px_rgba(251,191,36,0.1)]'"
              >
                {{ t('lobby.playBtn') }}
              </button>
              <div v-if="miniGameError['starcat']" class="mt-2 text-xs font-code tracking-wider break-all" :class="currentTheme === 'paper' ? 'text-[#993e32]' : 'text-red-500'">{{ miniGameErrorMsg['starcat'] }}</div>
            </div>
          </div>

          <!-- 赛博电音少女 (Cyber Guitar) -->
          <div 
            class="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            :class="currentTheme === 'paper'
              ? 'bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_8px_24px_-10px_rgba(62,54,38,0.12)] hover:border-[#5b827a]/60'
              : currentTheme === 'anime' 
              ? 'bg-white/95 border-2 border-[#ffc2d9] shadow-[0_8px_22px_rgba(255,140,185,0.18)] hover:border-[#ff85b3] hover:shadow-[0_14px_30px_rgba(255,133,179,0.28)]' 
              : (currentTheme === 'minimal'
                ? 'bg-[#0e1526]/72 border border-white/18 hover:border-[#c4b5fd]/55 shadow-[0_12px_34px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl'
                : 'bg-[#0a0a12] border border-white/[0.08] hover:border-[#00f3ff]/50 shadow-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]')"
            @click="miniGameInstalled['cyberguitar'] ? launchVueGame('cyberguitar') : null"
            @contextmenu.prevent="onCardContextMenu('cyberguitar', $event, 'mini')"
          >
            <div 
              class="relative w-full aspect-[3/2] overflow-hidden"
              :class="currentTheme === 'paper' ? 'bg-gradient-to-br from-[#ebf3f0] via-[#f4efe2] to-[#fbf3df]' : currentTheme === 'anime' ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50' : 'bg-black/60'"
            >
              <div 
                v-if="currentTheme !== 'anime' && currentTheme !== 'paper'"
                class="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/20 via-transparent to-[#ff00a0]/20 group-hover:from-[#00f3ff]/30 group-hover:to-[#ff00a0]/30 transition-all duration-500" 
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <svg 
                  class="w-24 h-24 transition-all duration-300 group-hover:scale-110" 
                  :class="currentTheme === 'paper' ? 'text-[#5b827a]/85 group-hover:text-[#3e635b]' : 'text-cyan-400 group-hover:text-pink-400 filter drop-shadow-[0_0_12px_rgba(0,243,255,0.5)]'"
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                </svg>
              </div>
              <div 
                class="absolute bottom-0 left-0 right-0 h-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                :class="currentTheme === 'paper' ? 'bg-gradient-to-r from-[#c1d7d1] via-[#667b48]/60 to-[#d4b77b]' : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'"
              />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 
                  class="font-bold text-lg tracking-wide transition-colors font-sans"
                  :class="currentTheme === 'paper' ? 'text-[#353024] group-hover:text-[#3e635b]' : currentTheme === 'anime' ? 'text-[#1e192b] group-hover:text-[#ff00a0]' : 'text-white group-hover:text-[#00f3ff]'"
                >
                  {{ t('lobby.cyberGuitarTitle') }}
                </h3>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span
                    class="text-[11px] font-bold px-2 py-0.5 rounded font-mono"
                    :class="getGameUsed('cyber_guitar') >= maxPerGame
                      ? (currentTheme === 'paper' ? 'text-[#3f5b32] bg-[#eef4e8] border border-[#c7d8b8]' : currentTheme === 'anime' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30')
                      : (currentTheme === 'paper' ? 'text-[#3e635b] bg-[#ebf3f0] border border-[#c1d7d1]' : currentTheme === 'anime' ? 'text-sky-700 bg-sky-50 border border-sky-200' : 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30')"
                  >
                    {{ t('lobby.redeemQuotaProgress', { used: getGameUsed('cyber_guitar'), max: maxPerGame }) }}
                  </span>
                  <span 
                    class="text-xs font-bold px-2 py-0.5 rounded font-mono"
                    :class="currentTheme === 'paper' ? 'text-[#3e635b] bg-[#ebf3f0] border border-[#c1d7d1]' : 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'"
                  >
                    RHYTHM
                  </span>
                </div>
              </div>
              <p 
                class="text-base mb-5 leading-relaxed"
                :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#4a425a]' : 'text-zinc-400'"
              >
                {{ t('lobby.cyberGuitarDesc') }}
              </p>
              <button
                v-if="miniGameInstalling['cyberguitar']"
                disabled
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider cursor-wait overflow-hidden relative"
                :class="currentTheme === 'paper' ? 'bg-[#ece4d2] border border-[#5a4e38]/20 text-[#6b6251]' : currentTheme === 'anime' ? 'bg-slate-100 border border-slate-300 text-slate-500' : 'bg-white/5 border border-white/20 text-white/50'"
              >
                {{ t('lobby.installingBtn') }}
                <span class="indet-track"><span class="indet-bar" /></span>
              </button>
              <button
                v-else-if="miniGameError['cyberguitar']"
                @click.stop="installMiniGame('cyberguitar')"
                class="w-full py-2.5 border rounded-lg text-base font-bold tracking-wider transition-all"
                :class="currentTheme === 'paper' ? 'bg-[#fbefe9] hover:bg-[#f5e1d8] border-[#e3bcb3] text-[#993e32]' : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-500'"
              >
                {{ t('lobby.installRetry') }}
              </button>
              <button
                v-else-if="!miniGameInstalled['cyberguitar']"
                @click.stop="installMiniGame('cyberguitar')"
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider transition-all hover:scale-[1.02]"
                :class="currentTheme === 'paper' ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm' : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-cyan-500/20'"
              >
                {{ t('lobby.installGame') }}
              </button>
              <button
                v-else
                @click.stop="launchVueGame('cyberguitar')"
                class="w-full py-2.5 rounded-lg text-base font-bold tracking-wider transition-all hover:scale-[1.02]"
                :class="currentTheme === 'paper' ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm' : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-cyan-500/20'"
              >
                {{ t('lobby.cyberGuitarPlayBtn') }}
              </button>
              <div v-if="miniGameError['cyberguitar']" class="mt-2 text-xs font-code tracking-wider break-all" :class="currentTheme === 'paper' ? 'text-[#993e32]' : 'text-red-500'">{{ miniGameErrorMsg['cyberguitar'] }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 独立游戏 Tab ========== -->
      <div v-else class="animate-fade-in">
        <!-- 加载中 -->
        <div v-if="indieLoading" class="h-64 flex items-center justify-center">
          <div class="w-10 h-10 border-4 rounded-full animate-spin" :class="currentTheme === 'paper' ? 'border-[#5a4e38]/15 border-t-[#667b48]' : 'border-[#00f3ff]/20 border-t-[#00f3ff]'" />
        </div>

        <!-- 有数据 -->
        <div v-else-if="indieGames.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          <div 
            v-for="g in indieGames" 
            :key="g.appid" 
            @contextmenu.prevent="onCardContextMenu(g, $event, 'indie')"
            class="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            :class="currentTheme === 'paper'
              ? 'bg-[#fffdf7] border border-[#5a4e38]/15 shadow-[0_8px_24px_-10px_rgba(62,54,38,0.12)] hover:border-[#667b48]/60'
              : currentTheme === 'anime' 
              ? 'bg-white/95 border-2 border-[#ffc2d9] shadow-[0_8px_22px_rgba(255,140,185,0.18)] hover:border-[#ff85b3] hover:shadow-[0_14px_30px_rgba(255,133,179,0.28)]' 
              : (currentTheme === 'minimal'
                ? 'bg-[#0e1526]/72 border border-white/18 hover:border-[#7dd3fc]/50 shadow-[0_12px_34px_rgba(0,0,0,0.52),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl'
                : 'bg-[#0a0a12] border border-white/[0.08] hover:border-[#00f3ff]/40')"
          >
            <!-- 封面 2:3 -->
            <div 
              class="relative w-full aspect-[2/3] overflow-hidden"
              :class="currentTheme === 'paper' ? 'bg-[#ede5d4]' : currentTheme === 'anime' ? 'bg-pink-50/50' : 'bg-black/60'"
            >
              <img 
                :src="g.cover_url" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                loading="lazy"
                @error="onImgError"
              />
              <div 
                class="absolute inset-0"
                :class="currentTheme === 'paper' ? 'bg-gradient-to-t from-[#fffdf7] via-[#fffdf7]/20 to-transparent' : currentTheme === 'anime' ? 'bg-gradient-to-t from-white via-white/20 to-transparent' : 'bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent'" 
              />

              <!-- 安装中遮罩 -->
              <div 
                v-if="g.status === 'installing'" 
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
                :class="currentTheme === 'paper' ? 'bg-[#fffdf7]/88' : currentTheme === 'anime' ? 'bg-white/80' : 'bg-black/80'"
              >
                <div 
                  class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  :class="currentTheme === 'paper' ? 'border-[#667b48]' : currentTheme === 'anime' ? 'border-[#ff85b3]' : 'border-[#00f3ff]'" 
                />
                <span 
                  class="font-bold text-base font-mono"
                  :class="currentTheme === 'paper' ? 'text-[#56693b]' : currentTheme === 'anime' ? 'text-[#ff66b2]' : 'text-[#00f3ff]'"
                >
                  {{ t('lobby.installingBtn') }}
                </span>
              </div>

              <!-- 已安装角标 (浅色毛玻璃底) -->
              <div 
                v-if="g.status === 'installed'" 
                class="absolute top-2 right-2 text-sm font-bold px-2 py-0.5 rounded font-mono shadow-sm"
                :class="currentTheme === 'paper' ? 'bg-[#eef4e8]/95 backdrop-blur-md border border-[#c7d8b8] text-[#3f5b32]' : currentTheme === 'anime' ? 'bg-white/70 backdrop-blur-md border border-white/80 text-[#1e192b] font-black' : 'bg-[#00f3ff]/20 backdrop-blur border border-[#00f3ff]/40 text-[#00f3ff] font-black'"
              >
                READY
              </div>
            </div>

            <!-- 信息区 -->
            <div class="p-4">
              <h3 
                class="font-bold text-base mb-1 truncate transition-colors font-sans"
                :class="currentTheme === 'paper' ? 'text-[#353024] group-hover:text-[#56693b]' : currentTheme === 'anime' ? 'text-[#1e192b] group-hover:text-[#ff66b2]' : 'text-white group-hover:text-[#00f3ff]'"
              >
                {{ g.title }}
              </h3>
              <p 
                class="text-base mb-3 line-clamp-2 h-12 leading-relaxed"
                :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#4a425a]' : 'text-zinc-400'"
              >
                {{ g.desc }}
              </p>

              <!-- 安装进度条 -->
              <div 
                v-if="g.status === 'installing'" 
                class="w-full h-1 rounded-full overflow-hidden mb-3 relative"
                :class="currentTheme === 'paper' ? 'bg-[#ece4d2]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/10'"
              >
                <div 
                  style="position:absolute; top:0; bottom:0; width:40%; animation:indetFlow 1.1s ease-in-out infinite;" 
                  :style="currentTheme === 'paper'
                    ? 'background:linear-gradient(90deg, transparent, #667b48, transparent);'
                    : currentTheme === 'anime' 
                    ? 'background:linear-gradient(90deg, transparent, #ff85b3, transparent); box-shadow:0 0 8px rgba(255,133,179,0.8);' 
                    : 'background:linear-gradient(90deg, transparent, #00f3ff, transparent); box-shadow:0 0 8px rgba(0,243,255,0.8);'"
                />
              </div>

              <!-- 按钮 -->
              <button 
                v-if="g.status === 'not_installed'"
                @click="installGame(g)"
                class="w-full py-2.5 rounded-lg text-base font-bold transition-all"
                :class="currentTheme === 'paper'
                  ? 'bg-[#f6f0e1] hover:bg-[#f6ebd0] border border-[#5a4e38]/20 text-[#353024]'
                  : currentTheme === 'anime'
                  ? 'bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#d6336c]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white hover:border-white/30'"
              >
                {{ t('lobby.installBtn', { size: g.size }) }}
              </button>
              <button 
                v-else-if="g.status === 'update'"
                @click="installGame(g)"
                class="w-full py-2.5 rounded-lg text-base font-bold transition-all"
                :class="currentTheme === 'paper'
                  ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                  : currentTheme === 'anime'
                  ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ff98c3] text-white shadow-sm border border-white/75 rounded-xl animate-pulse'
                  : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/40 text-[#00f3ff] animate-pulse'"
              >
                {{ t('lobby.updateBtn') }}
              </button>
              <button 
                v-else-if="g.status === 'installed'"
                @click="launchGame(g)"
                class="w-full py-2.5 rounded-lg text-base font-bold transition-all shadow-sm"
                :class="currentTheme === 'paper'
                  ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] shadow-sm'
                  : currentTheme === 'anime'
                  ? 'bg-gradient-to-r from-[#ff7eb3] via-[#ff94c2] to-[#ffb1d2] text-white border border-white/75 rounded-xl'
                  : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 text-[#00f3ff] hover:shadow-[0_0_12px_rgba(0,243,255,0.1)]'"
              >
                {{ t('lobby.launchBtn') }}
              </button>
              <button 
                v-else-if="g.status === 'installing'"
                disabled
                class="w-full py-2.5 rounded-lg text-base font-bold cursor-not-allowed"
                :class="currentTheme === 'paper' ? 'bg-[#ece4d2] border border-[#5a4e38]/15 text-[#9b917e]' : currentTheme === 'anime' ? 'bg-slate-100 border border-slate-200 text-slate-400' : 'bg-white/5 border border-white/10 text-zinc-600'"
              >
                {{ t('lobby.installingBtn') }}
              </button>
            </div>

            <!-- 悬停光效 -->
            <div 
              class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
              :style="currentTheme === 'paper' ? 'box-shadow: inset 0 0 20px rgba(102,123,72,0.08)' : currentTheme === 'anime' ? 'box-shadow: inset 0 0 20px rgba(223,154,168,0.08)' : 'box-shadow: inset 0 0 40px rgba(0,243,255,0.03)'" 
            />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="h-64 flex flex-col items-center justify-center gap-4" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : 'text-zinc-600'">
          <svg class="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-base font-bold tracking-widest uppercase">{{ t('lobby.emptyTitle') }}</span>
          <span class="text-base" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : 'text-zinc-700'">{{ t('lobby.emptyDesc') }}</span>
        </div>
      </div>
    </div>

    <!-- ========== 右键卸载菜单 ========== -->
    <Teleport to="body">
      <div
        v-if="ctxMenu.show"
        class="fixed inset-0 z-[9998]"
        @click="closeCtxMenu"
        @contextmenu.prevent="closeCtxMenu"
      />
    </Teleport>
    <ContextMenu
      :visible="ctxMenu.show"
      :x="ctxMenu.x"
      :y="ctxMenu.y"
      :title="ctxMenu.game?.title || ''"
      variant="library"
      @close="closeCtxMenu"
    >
      <button
        class="w-full text-left px-4 py-3 text-sm font-bold transition-colors cursor-pointer"
        :class="currentTheme === 'paper' ? 'text-[#993e32] hover:bg-[#fbefe9]' : 'text-red-400 hover:bg-red-500/10'"
        @click="confirmUninstall"
      >
        {{ t('modal.uninstall') }}
      </button>
    </ContextMenu>

    <!-- ========== Vue 小游戏内嵌容器 ========== -->
    <Teleport to="body">
      <div v-if="currentVueGame" class="fixed inset-0 z-[999] bg-black paper-exempt-minigame">
        <component
          :is="vueGameComponents[currentVueGame]"
          :continue-game="shouldContinue"
          @exit="exitVueGame"
          @update:stats="updateGameStats"
        />
      </div>
    </Teleport>

    <!-- ========== 兑换中心弹窗（方案 1：按游戏分栏直兑） ========== -->
    <Teleport to="body">
    <div 
      v-if="showRedeemModal" 
      class="fixed inset-0 z-[999] backdrop-blur-sm flex items-center justify-center animate-fade-in p-4" 
      :class="currentTheme === 'paper' ? 'bg-[#353024]/30' : currentTheme === 'anime' ? 'bg-black/30' : 'bg-black/80'"
      @click.self="showRedeemModal = false"
    >
      <div 
        class="rounded-2xl p-6 sm:p-7 max-w-xl w-full transition-all max-h-[90vh] overflow-y-auto scrollbar-hide"
        :class="currentTheme === 'paper'
          ? 'bg-[#fffdf7] border border-[#5a4e38]/15 text-[#353024] shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)]'
          : currentTheme === 'anime' 
          ? 'bg-white/98 border-2 border-amber-300 text-[#1e192b] shadow-[0_16px_40px_rgba(251,191,36,0.2)]' 
          : 'bg-[#0a0a12] border border-yellow-500/20 text-white shadow-[0_0_60px_rgba(234,179,8,0.08)]'" 
        @click.stop
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2.5">
            <svg class="w-6 h-6" :class="currentTheme === 'paper' ? 'text-[#a87628]' : 'text-yellow-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 class="text-xl tracking-wide font-sans" :class="currentTheme === 'paper' ? 'font-bold text-[#353024]' : currentTheme === 'anime' ? 'font-black text-amber-600' : 'font-black text-yellow-400'">{{ t('lobby.redeemTitle') }}</h2>
          </div>
          <button
            @click="showRedeemModal = false"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            :class="currentTheme === 'paper' ? 'text-[#6b6251] hover:bg-[#f6ebd0] hover:text-[#353024]' : currentTheme === 'anime' ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-zinc-500 hover:bg-white/10 hover:text-white'"
          >
            ✕
          </button>
        </div>

        <p class="text-sm mb-5 leading-relaxed" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#4a425a]' : 'text-zinc-400'">
          {{ t('lobby.redeemDesc') }}
        </p>

        <!-- 按游戏分栏直兑卡片 -->
        <div class="space-y-3 mb-5">
          <!-- 太空猫 / 电音少女：终生累计上限 3 额度 -->
          <div
            v-for="item in redeemableGames"
            :key="item.id"
            class="rounded-xl p-4 border transition-all"
            :class="currentTheme === 'paper' ? 'bg-[#f6f0e1] border-[#5a4e38]/15' : currentTheme === 'anime' ? 'bg-amber-50/40 border-amber-200/80' : 'bg-white/[0.02] border-white/[0.08]'"
          >
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <div class="font-bold text-base" :class="currentTheme === 'paper' ? 'text-[#353024]' : currentTheme === 'anime' ? 'text-[#1e192b]' : 'text-white'">
                  {{ t(item.titleKey) }}
                </div>
                <div class="text-xs mt-0.5" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#6c647d]' : 'text-zinc-400'">
                  {{ t(item.ruleKey) }}
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span
                  class="text-xs font-mono font-bold px-2 py-0.5 rounded-md border"
                  :class="currentTheme === 'paper' ? 'bg-[#fbf3df] border-[#e4cca0] text-[#7d5619]' : currentTheme === 'anime' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'"
                >
                  {{ t('lobby.holdCoresShort', { n: player.getGameCores(item.id) }) }}
                </span>
                <span
                  class="text-xs font-mono font-bold px-2 py-0.5 rounded-md border"
                  :class="getGameUsed(item.id) >= maxPerGame
                    ? (currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#c7d8b8] text-[#3f5b32]' : currentTheme === 'anime' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300')
                    : (currentTheme === 'paper' ? 'bg-[#ebf3f0] border-[#c1d7d1] text-[#3e635b]' : currentTheme === 'anime' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300')"
                >
                  {{ t('lobby.redeemQuotaProgress', { used: getGameUsed(item.id), max: maxPerGame }) }}
                </span>
              </div>
            </div>

            <div v-if="getGameUsed(item.id) >= maxPerGame" class="text-xs font-bold font-mono py-1" :class="currentTheme === 'paper' ? 'text-[#3f5b32]' : 'text-emerald-500'">
              {{ t('lobby.redeemedFull') }}
            </div>
            <div v-else-if="player.getGameCores(item.id) <= 0" class="flex items-center justify-between gap-3 pt-1">
              <span class="text-xs" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-500' : 'text-zinc-500'">
                {{ t('lobby.noCoresHint') }}
              </span>
              <button
                @click="playFromRedeem(item.launchId)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                :class="currentTheme === 'paper' ? 'bg-[#fffdf7] border-[#5a4e38]/20 text-[#353024] hover:bg-[#f6ebd0]' : currentTheme === 'anime' ? 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50' : 'bg-white/5 border-white/15 text-zinc-200 hover:bg-white/10'"
              >
                {{ t('lobby.goToPlay') }}
              </button>
            </div>
            <div v-else class="flex items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-1.5">
                <button
                  v-for="n in [1, 2, 3]"
                  :key="n"
                  type="button"
                  :disabled="n > getGameMaxSelectable(item.id)"
                  @click="selectedAmountByGame[item.id] = n"
                  class="w-8 h-8 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  :class="getSelectedAmount(item.id) === n
                    ? (currentTheme === 'paper' ? 'bg-[#f2dfb4] border-[#d4b77b] text-[#352d1e]' : currentTheme === 'anime' ? 'bg-amber-400 border-amber-500 text-amber-950' : 'bg-yellow-500/25 border-yellow-400 text-yellow-300')
                    : (currentTheme === 'paper' ? 'bg-[#fffdf7] border-[#5a4e38]/20 text-[#6b6251] hover:border-[#667b48]' : currentTheme === 'anime' ? 'bg-white border-slate-200 text-slate-700 hover:border-amber-300' : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:border-white/25')"
                >
                  {{ n }}
                </button>
              </div>
              <button
                @click="doRedeemForGame(item.id)"
                :disabled="redeemingGameId !== null"
                class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                :class="currentTheme === 'paper'
                  ? 'bg-[#667b48] hover:bg-[#56693b] text-[#fffdf7] border-[#667b48]'
                  : currentTheme === 'anime'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 border-amber-300'
                  : 'bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/40 text-yellow-300'"
              >
                {{ redeemingGameId === item.id ? t('lobby.processing') : t('lobby.redeemBtnN', { n: getSelectedAmount(item.id) }) }}
              </button>
            </div>
          </div>

          <!-- 巴达布前哨（例外：通关赠送 1 张天卡） -->
          <div
            class="rounded-xl p-4 border transition-all"
            :class="currentTheme === 'paper' ? 'bg-[#eef4e8]/75 border-[#c7d8b8]' : currentTheme === 'anime' ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-white/[0.02] border-emerald-500/20'"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="font-bold text-base" :class="currentTheme === 'paper' ? 'text-[#353024]' : currentTheme === 'anime' ? 'text-[#1e192b]' : 'text-white'">
                  {{ t('lobby.badabRewardTitle') }}
                </div>
                <div class="text-xs mt-0.5 leading-relaxed" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-[#6c647d]' : 'text-zinc-400'">
                  {{ t('lobby.badabRewardDesc') }}
                </div>
              </div>
              <div class="shrink-0 flex flex-col items-end gap-1">
                <template v-if="authStore.minigameRewards.badab.claimed">
                  <span
                    class="text-xs font-bold font-mono px-2.5 py-1 rounded-lg border"
                    :class="currentTheme === 'paper' ? 'bg-[#eef4e8] border-[#c7d8b8] text-[#3f5b32]' : currentTheme === 'anime' ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'"
                  >
                    {{ t('lobby.badabClaimedTag') }}
                  </span>
                  <span v-if="authStore.minigameRewards.badab.claimedAt" class="text-[11px] font-mono" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : 'text-zinc-500'">
                    {{ authStore.minigameRewards.badab.claimedAt }}
                  </span>
                </template>
                <template v-else>
                  <button
                    @click="playFromRedeem('badab')"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                    :class="currentTheme === 'paper' ? 'bg-[#5c7d4c] text-[#fffdf7] border-[#5c7d4c] hover:bg-[#4d6a3f]' : currentTheme === 'anime' ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600' : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25'"
                  >
                    {{ t('lobby.goToPlay') }}
                  </button>
                  <span class="text-[11px] font-mono" :class="currentTheme === 'paper' ? 'text-[#7d5619]' : currentTheme === 'anime' ? 'text-amber-700' : 'text-amber-300/80'">
                    {{ t('lobby.badabUnclaimedTag') }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div v-if="redeemError" class="text-sm mb-3 text-center font-mono border rounded-lg py-2 px-3" :class="currentTheme === 'paper' ? 'text-[#993e32] bg-[#fbefe9] border-[#e3bcb3]' : 'text-red-500 bg-red-500/10 border-red-500/30'">
          {{ redeemError }}
        </div>
        <div v-if="redeemSuccessMsg" class="text-sm mb-3 text-center font-mono border rounded-lg py-2 px-3 font-bold" :class="currentTheme === 'paper' ? 'text-[#3f5b32] bg-[#eef4e8] border-[#c7d8b8]' : 'text-emerald-600 bg-emerald-50 border-emerald-300'">
          {{ redeemSuccessMsg }}
        </div>

        <button 
          @click="showRedeemModal = false"
          class="w-full py-2.5 rounded-xl transition-all text-sm font-bold tracking-wider border cursor-pointer"
          :class="currentTheme === 'paper' ? 'bg-[#f6f0e1] border-[#5a4e38]/20 text-[#353024] hover:bg-[#f6ebd0]' : currentTheme === 'anime' ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'border-white/15 text-zinc-400 hover:text-white hover:border-white/30'"
        >
          {{ t('common.close') }}
        </button>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, watch, defineAsyncComponent } from 'vue';
import { usePlayerStore } from '../stores/playerStore';
import { useTelemetryStore } from '../stores/telemetryStore';
import { useMiniGameStore } from '../stores/miniGameStore';
import { useAuthStore } from '../stores/authStore';
import { redeemGameQuota, type RedeemableGameId } from '../utils/minigameRedeem';
import * as MiniGameService from '../main/services/miniGameService';
import BadabGame from './games/badab/BadabGame.vue';
import StarCatGame from './games/StarCat/StarCatGame.vue';
import CyberGuitarGame from './games/CyberGuitar/CyberGuitarGame.vue';
import { t } from '../i18n';
import Swal from 'sweetalert2';
import { tcToast } from '../utils/tcToast';
import ContextMenu from './common/ContextMenu.vue';
import { useTheme } from '../composables/useTheme';

const { currentTheme } = useTheme();
const player = usePlayerStore();
const telemetryStore = useTelemetryStore();
const miniGameStore = useMiniGameStore();
const authStore = useAuthStore();

// TAB 状态
const activeTab = ref<'mini' | 'indie'>('mini');

// Vue 小游戏状态
const currentVueGame = ref<string | null>(null);
const shouldContinue = ref(false);
const hasBadabSave = ref(false);

const vueGameComponents: Record<string, any> = {
  badab: markRaw(BadabGame),
  starcat: markRaw(StarCatGame),
  cyberguitar: markRaw(CyberGuitarGame)
};

// ===== 小游戏素材安装状态机（任务B R37a） =====
const miniGameInstalled = ref<Record<string, boolean>>({});
const miniGameInstalling = ref<Record<string, boolean>>({});
const miniGameError = ref<Record<string, boolean>>({});
const miniGameErrorMsg = ref<Record<string, string>>({});
const miniGameLinks = ref<Record<string, string | string[]>>({});
let unsubMiniProgress: (() => void) | null = null;
let unsubMiniDone: (() => void) | null = null;

async function refreshMiniGameState() {
  try {
    const st = await window.electron.minigame.getState();
    const map: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(st || {})) {
      map[k] = !!(v as any)?.installed;
    }
    miniGameInstalled.value = map;
  } catch { /* 静默：读不到按未安装处理 */ }
}

async function ensureMiniGameLinks() {
  if (Object.keys(miniGameLinks.value).length > 0) return;
  const res = await window.electron.minigame.fetchLinks();
  if (res?.success && Array.isArray(res.data)) {
    const map: Record<string, string> = {};
    for (const g of res.data) {
      const urlOrUrls = Array.isArray(g?.download_urls) && g.download_urls.length ? g.download_urls : g?.download_url;
      if (g?.id && urlOrUrls) map[g.id] = urlOrUrls;
    }
    miniGameLinks.value = map;
  }
}

async function installMiniGame(id: string) {
  if (miniGameInstalling.value[id]) return;
  miniGameError.value = { ...miniGameError.value, [id]: false };
  try {
    await ensureMiniGameLinks();
    const urls = miniGameLinks.value[id];
    if (!urls || (Array.isArray(urls) && urls.length === 0)) throw new Error('ERR_DOWNLOAD_URL_MISSING');
    miniGameInstalling.value = { ...miniGameInstalling.value, [id]: true };
    // R57: 镜像数组全量透传, aria2 原生多源竞速；脱敏转纯原生对象防克隆阻断
    const rawUrls = typeof urls === 'string' ? urls : JSON.parse(JSON.stringify(urls));
    const res = await window.electron.minigame.install(id, rawUrls);
    if (!res?.success) throw new Error(res?.error || 'ERR_INSTALL_FAIL');
    // 事件可能因窗口重载等丢失，成功后以主进程 meta.json 为准回读一次状态
    await refreshMiniGameState();
  } catch (e: any) {
    const msg = String(e?.message || e || 'ERR_UNKNOWN');
    miniGameInstalling.value = { ...miniGameInstalling.value, [id]: false };
    miniGameError.value = { ...miniGameError.value, [id]: true };
    miniGameErrorMsg.value = { ...miniGameErrorMsg.value, [id]: t(msg) };
  }
}

// 独立游戏列表（状态直接内联在组件中）
const indieGames = ref<any[]>([]);
const indieLoading = ref(false);

// 兑换中心状态（方案 1：按游戏分栏独立兑换 + 终生 3 额度追踪）
const showRedeemModal = ref(false);
const redeemingGameId = ref<RedeemableGameId | null>(null);
const redeemSuccessMsg = ref('');
const redeemError = ref('');
const selectedAmountByGame = ref<Record<RedeemableGameId, number>>({ starcat: 1, cyber_guitar: 1 });

const maxPerGame = computed(() => authStore.minigameRewards.maxPerGame || 3);
const redeemableGames: Array<{ id: RedeemableGameId; launchId: string; titleKey: string; ruleKey: string }> = [
  { id: 'starcat', launchId: 'starcat', titleKey: 'lobby.starcatTitle', ruleKey: 'lobby.starcatRewardRule' },
  { id: 'cyber_guitar', launchId: 'cyberguitar', titleKey: 'lobby.cyberGuitarTitle', ruleKey: 'lobby.cyberGuitarRewardRule' }
];

function getGameUsed(gameId: RedeemableGameId): number {
  return Math.min(maxPerGame.value, authStore.getGameRedeemedCount(gameId));
}

function getGameRemaining(gameId: RedeemableGameId): number {
  return Math.max(0, maxPerGame.value - getGameUsed(gameId));
}

function getGameMaxSelectable(gameId: RedeemableGameId): number {
  return Math.min(getGameRemaining(gameId), player.getGameCores(gameId));
}

const redeemableCoresCount = computed(() =>
  redeemableGames.reduce((sum, g) => sum + getGameMaxSelectable(g.id), 0)
);

function getSelectedAmount(gameId: RedeemableGameId): number {
  const maxAvail = getGameMaxSelectable(gameId);
  if (maxAvail <= 0) return 0;
  return Math.max(1, Math.min(selectedAmountByGame.value[gameId] || 1, maxAvail));
}

function openRedeemModal() {
  redeemError.value = '';
  redeemSuccessMsg.value = '';
  for (const g of redeemableGames) {
    const maxAvail = getGameMaxSelectable(g.id);
    selectedAmountByGame.value[g.id] = maxAvail > 0 ? Math.min(selectedAmountByGame.value[g.id] || 1, maxAvail) : 1;
  }
  showRedeemModal.value = true;
}

function playFromRedeem(launchId: string) {
  showRedeemModal.value = false;
  if (miniGameInstalled.value[launchId]) {
    launchVueGame(launchId, launchId === 'badab' && hasBadabSave.value);
  } else {
    installMiniGame(launchId);
  }
}

function launchVueGame(id: string, continueGame = false) {
  // 未安装的小游戏禁止启动（R37a）
  if ((id === 'badab' || id === 'starcat' || id === 'cyberguitar') && !miniGameInstalled.value[id]) return;
  // 🟢 埋点：小游戏启动
  telemetryStore.trackLobbyEvent('lobby_game_launch', { game_id: id, game_title: id, source: 'mini' });
  if (id === 'badab' && !continueGame) {
    MiniGameService.deleteSave('badab');
  }
  shouldContinue.value = continueGame;
  currentVueGame.value = id;
}

function exitVueGame() {
  currentVueGame.value = null;
  shouldContinue.value = false;
  hasBadabSave.value = !!MiniGameService.load('badab');
}

function updateGameStats(stats: { scrap?: number; cores?: number; gameId?: string }) {
  if (stats.scrap) player.scrap += stats.scrap;
  if (stats.cores && stats.gameId) player.addGameCores(stats.gameId, stats.cores);
}

// 拉取独立游戏列表并合并本地安装状态
async function loadIndieGames() {
  indieLoading.value = true;
  try {
    const [listRes, libRes] = await Promise.all([
      window.electron.invoke('tcgame:fetch-list'),
      window.electron.invoke('tcgame:get-library')
    ]);
    if (listRes?.success && Array.isArray(listRes.data)) {
      const lib = libRes || {};
      indieGames.value = listRes.data.map((g: any) => ({
        appid: g.appid,
        title: g.title,
        desc: g.desc || g.description || '',
        version: g.version,
        size: g.size,
        cover_url: g.cover_url || g.cover,
        exe_name: g.exe_name || g.entry_exe || 'game.exe',
        download_url: g.download_url || (Array.isArray(g.download_urls) ? g.download_urls[0] : ''),
        status: !lib[g.appid] ? 'not_installed' : (String((lib[g.appid] as any)?.version || '') !== String(g.version || '') ? 'update' : 'installed'),
      }));
    }
  } catch (e) {
    console.error('[Arcade] 拉取独立游戏列表失败:', e);
  } finally {
    indieLoading.value = false;
  }
}


// ========== 右键卸载（小游戏 / 独立游戏） ==========
const ctxMenu = ref({ show: false, x: 0, y: 0, game: null as any, type: '' as 'mini' | 'indie' | '' });
const uninstalling = ref(false);

function closeCtxMenu() {
  ctxMenu.value.show = false;
}

function clampCtxMenuPos() {
  ctxMenu.value.x = Math.max(10, Math.min(ctxMenu.value.x, window.innerWidth - 266));
  ctxMenu.value.y = Math.max(10, Math.min(ctxMenu.value.y, window.innerHeight - 300));
}

function onCardContextMenu(target: any, e: MouseEvent, type: 'mini' | 'indie') {
  if (type === 'mini') {
    const id = target as string;
    if (!miniGameInstalled.value[id] || miniGameInstalling.value[id] || currentVueGame.value) return;
    const titleMap: Record<string, string> = {
      badab: t('lobby.badabTitle'),
      starcat: t('lobby.starcatTitle'),
      cyberguitar: '电音少女'
    };
    ctxMenu.value = { show: true, x: e.clientX, y: e.clientY, game: { id, title: titleMap[id] || id }, type };
    clampCtxMenuPos();
    return;
  }
  const g = target as any;
  if (g.status !== 'installed' && g.status !== 'update') return;
  ctxMenu.value = { show: true, x: e.clientX, y: e.clientY, game: g, type };
  clampCtxMenuPos();
}

function titanAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
  tcToast(title, text, icon);
}

async function confirmUninstall() {
  const m = ctxMenu.value;
  if (!m.game || uninstalling.value) return;
  closeCtxMenu();

  // 统一二次确认（小游戏与独立游戏一致）
  const isPaper = currentTheme.value === 'paper'
  const confirmed = await Swal.fire({
    icon: 'warning',
    title: t('common.warning'),
    text: `${t('library.uninstall.title')} (${m.game.title})`,
    showCancelButton: true,
    confirmButtonText: t('modal.uninstall'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#ba5243' : '#ef4444',
    cancelButtonColor: isPaper ? '#efe8d8' : undefined,
  });
  if (!confirmed.isConfirmed) return;

  uninstalling.value = true;
  try {
    if (m.type === 'mini') {
      telemetryStore.trackLobbyEvent('lobby_uninstall_click', { game_id: m.game.id, game_title: m.game.title, source: 'minigame' });
      const res = await window.electron.invoke('minigame:uninstall', m.game.id);
      if (!res?.success) throw new Error(res?.error || 'ERR_UNKNOWN');
      miniGameInstalled.value[m.game.id] = false;
      miniGameError.value[m.game.id] = false;
      miniGameErrorMsg.value[m.game.id] = '';
      titanAlert(t('modal.uninstall'), t('common.success'), 'success');
    } else {
      telemetryStore.trackLobbyEvent('lobby_uninstall_click', { game_id: m.game.appid, game_title: m.game.title, source: 'indie' });
      const res = await window.electron.invoke('tcgame:uninstall', m.game.appid, m.game.exe_name);
      if (!res?.success) throw new Error(res?.error || 'ERR_UNKNOWN');
      m.game.status = 'not_installed';
      titanAlert(t('modal.uninstall'), t('common.success'), 'success');
    }
  } catch (e: any) {
    titanAlert(t('modal.uninstall'), e?.message ? t(e.message) : t('common.error'), 'error');
  } finally {
    uninstalling.value = false;
  }
}

// 安装独立游戏
async function installGame(g: any) {
  if (g.status === 'installing') return;
  // 🟢 埋点：独立游戏安装点击
  telemetryStore.trackLobbyEvent('lobby_install_click', { game_id: g.appid, game_title: g.title, source: 'indie' });
  g.status = 'installing';
    try {
    const meta = {
      title: g.title,
      version: g.version,
      exe_name: g.exe_name,
      download_urls: Array.isArray(g.download_urls) && g.download_urls.length ? g.download_urls : (g.download_url ? [g.download_url] : []),
      cover_url: g.cover_url
    };
    const res = await window.electron.invoke('tcgame:install', g.appid, meta);
    if (!res?.success) throw new Error(res?.error || 'ERR_INSTALL_FAIL');
  } catch (e: any) {
    g.status = 'not_installed';
    // fix42(A6): surface install failure - this catch used to swallow everything.
    // Aligned with the confirmUninstall pattern: t() translates error codes,
    // already-translated text passes through untouched.
    titanAlert(t('lobby.installFailed'), e?.message ? t(e.message) : t('common.error'), 'error');
  }
}

// 启动独立游戏
async function launchGame(g: any) {
  // 🟢 埋点：独立游戏启动
  telemetryStore.trackLobbyEvent('lobby_game_launch', { game_id: g.appid, game_title: g.title, source: 'indie' });
  try {
    const res = await window.electron.invoke('tcgame:launch', g.appid, g.exe_name);
    if (!res?.success) throw new Error(res?.error || t('lobby.launchFailed'));
  } catch (e: any) {
    alert(t('lobby.launchFailedMsg', { msg: t(e.message) }));
  }
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22900%22%3E%3Crect fill=%22%230a0a12%22 width=%22600%22 height=%22900%22/%3E%3Ctext fill=%22%23333%22 font-family=%22sans-serif%22 font-size=%2240%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENO COVER%3C/text%3E%3C/svg%3E';
}

async function doRedeemForGame(gameId: RedeemableGameId) {
  if (redeemingGameId.value) return;
  const amount = getSelectedAmount(gameId);
  if (amount <= 0) return;

  redeemingGameId.value = gameId;
  redeemError.value = '';
  redeemSuccessMsg.value = '';

  try {
    const res = await redeemGameQuota(gameId, amount * 10000, amount);
    if (res.ok) {
      telemetryStore.trackLobbyEvent('lobby_redeem', { game_id: gameId, amount: res.redeemed, cost: res.cost });
      player.consumeGameCores(gameId, res.redeemed);
      const nextMax = getGameMaxSelectable(gameId);
      if (nextMax > 0) selectedAmountByGame.value[gameId] = Math.min(selectedAmountByGame.value[gameId] || 1, nextMax);
      redeemSuccessMsg.value = res.message;
      setTimeout(() => { redeemSuccessMsg.value = ''; }, 3500);
    } else {
      redeemError.value = res.message;
    }
  } finally {
    redeemingGameId.value = null;
  }
}

// 独立游戏事件监听清理函数
let unsubProgress: (() => void) | null = null;
let unsubDone: (() => void) | null = null;

watch(activeTab, (tab) => {
  if (tab === 'indie') loadIndieGames();
});

onMounted(() => {
  // 初始化积分 Store（检查每日清空）
  miniGameStore.init();

  // 侦测巴达布前哨是否存在本地存档
  hasBadabSave.value = !!MiniGameService.load('badab');

  // 小游戏素材安装状态机（R37a）
  refreshMiniGameState();
  unsubMiniProgress = window.electron.minigame.onProgress((data: any) => {
    if (!data?.gameId) return;
    miniGameInstalling.value = { ...miniGameInstalling.value, [data.gameId]: true };
  });
  unsubMiniDone = window.electron.minigame.onInstallDone((data: any) => {
    if (!data?.gameId) return;
    miniGameInstalling.value = { ...miniGameInstalling.value, [data.gameId]: false };
    if (data.success) {
      miniGameInstalled.value = { ...miniGameInstalled.value, [data.gameId]: true };
    } else {
      miniGameError.value = { ...miniGameError.value, [data.gameId]: true };
      miniGameErrorMsg.value = { ...miniGameErrorMsg.value, [data.gameId]: t(String(data.error || 'ERR_UNKNOWN')) };
    }
  });

  // 独立游戏进度事件监听
  unsubProgress = window.electron.on('tcgame:install-progress', (data: any) => {
    const g = indieGames.value.find((x: any) => x.appid === data.appid);
    if (g) {
      g.status = 'installing';
    }
  });

  unsubDone = window.electron.on('tcgame:install-done', (data: any) => {
    const g = indieGames.value.find((x: any) => x.appid === data.appid);
    if (g) {
      if (data.success) {
        g.status = 'installed';
        } else {
        g.status = 'not_installed';
                alert(t('errors.installFailTpl', { msg: t(String(data.error || 'ERR_UNKNOWN')) }));
      }
    }
  });

  // 如果当前在独立游戏 Tab，立即加载列表
  if (activeTab.value === 'indie') {
    loadIndieGames();
  }
});

onUnmounted(() => {
  // 清理独立游戏事件监听
  unsubProgress?.();
  unsubDone?.();
  unsubMiniProgress?.();
  unsubMiniDone?.();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
/* R64: 不确定进度 = 赛博青流动动画, 全程零数字 */
.indet-track { position: absolute; left: 14px; right: 14px; bottom: 7px; height: 3px; background: rgba(0,243,255,0.10); border-radius: 2px; overflow: hidden; }
.indet-bar { position: absolute; top: 0; bottom: 0; width: 40%; border-radius: 2px; background: linear-gradient(90deg, transparent, #00f3ff, transparent); box-shadow: 0 0 8px rgba(0,243,255,0.8); animation: indetFlow 1.1s ease-in-out infinite; }
.is-paper .indet-track { background: rgba(102, 123, 72, 0.16); }
.is-paper .indet-bar { background: linear-gradient(90deg, transparent, #667b48, transparent); box-shadow: none; }
@keyframes indetFlow { 0% { left: -40%; } 100% { left: 100%; } }
</style>

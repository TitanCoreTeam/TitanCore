<!-- 文件名: src/components/LibraryView.vue -->
<template>
  <div 
    class="h-full flex flex-col relative overflow-hidden select-none animate-fade-in transition-colors duration-300" 
    :class="[
      currentTheme === 'minimal' ? 'px-7 pt-2' : (currentTheme === 'paper' || currentTheme === 'anime' ? 'px-5 pt-2.5' : 'px-8 pt-5'),
      currentTheme === 'anime' ? 'bg-transparent text-[#4a2c40]' : '',
      currentTheme === 'paper' ? 'bg-transparent text-[#353024]' : '',
      currentTheme === 'minimal' ? 'bg-transparent text-slate-100' : '',
      currentTheme !== 'anime' && currentTheme !== 'minimal' && currentTheme !== 'paper' ? 'bg-[#0d0e12] text-white' : ''
    ]"
    style="font-family: 'MiSans', 'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif;"
  >

    <!-- 管理态操作条：排序 + 批量操作 -->
    <div v-if="manageMode" class="flex items-center gap-3 mb-5 z-20 shrink-0 h-9 animate-fade-in">
      <span class="text-xs font-code tracking-wider whitespace-nowrap" :class="currentTheme === 'paper' ? 'text-[#56693b] font-semibold' : currentTheme === 'anime' ? 'text-pink-600 font-bold' : currentTheme === 'minimal' ? 'text-[#00f2ff] font-bold' : 'text-[#00f3ff]'">{{ t('library.selectedCount', { count: selectedIds.size }) }}</span>
      <button 
        type="button"
        @click="toggleSelectAllCards"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/10 text-white bg-white/[0.06] hover:bg-white/[0.12]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ t('library.selectAll') }}
      </button>
      <select 
        v-model="sortMode"
        class="h-9 px-3 border font-code cursor-pointer focus:outline-none"
        :class="[
          currentTheme === 'paper' ? 'text-[13px] font-medium bg-[#fffdf7] border-[rgba(90,78,56,0.16)] rounded-xl text-[#353024] focus:border-[#667b48] shadow-sm' : currentTheme === 'anime' ? 'text-xs bg-white border-pink-200 rounded-full text-slate-700 focus:border-pink-400 shadow-sm' : currentTheme === 'minimal' ? 'text-xs bg-[#0a0e17] border-white/10 rounded-xl text-white' : 'text-xs bg-[#0e1118] border-white/[0.1] rounded-lg text-white/80 focus:border-white/30'
        ]"
      >
        <option value="newest">{{ t('library.sortNewest') }}</option>
        <option value="oldest">{{ t('library.sortOldest') }}</option>
        <option value="name">{{ t('library.sortName') }}</option>
      </select>
      <button 
        type="button"
        @click="batchRedeploy"
        :disabled="selectedIds.size === 0"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/10 text-white bg-white/[0.06] hover:bg-white/[0.12]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ t('library.batchRedeploy') }}
      </button>
      <button 
        type="button"
        @click="batchToggleAutoUpdate"
        :disabled="selectedIds.size === 0"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/10 text-white bg-white/[0.06] hover:bg-white/[0.12]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ allSelectedAutoUpdateOn ? t('library.contextMenu.disableUpdate') : t('library.contextMenu.enableUpdate') }}
      </button>
      <button 
        type="button"
        @click="batchUninstall"
        :disabled="selectedIds.size === 0"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/10 text-white bg-white/[0.06] hover:bg-white/[0.12]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ t('library.batchUninstall') }}
      </button>
      <button 
        type="button"
        @click="batchRemoveRecords"
        :disabled="selectedIds.size === 0"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] bg-[#fffdf7] shadow-sm !text-[#ba5243] hover:!bg-[#fbefe9] hover:!border-[#e3bcb3]' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider !text-red-500 hover:!bg-red-500/10 hover:!border-red-500/40 rounded-full border-pink-200 bg-white/80 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider !text-red-500 hover:!bg-red-500/10 hover:!border-red-500/40 rounded-xl border-red-500/30 bg-red-500/15' : 'text-xs font-bold tracking-wider !text-red-500 hover:!bg-red-500/10 hover:!border-red-500/40 rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02]'
        ]"
      >
        {{ t('library.contextMenu.deleteRecord') }}
      </button>
      <div class="w-px h-5 mx-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.13)]' : currentTheme === 'anime' ? 'bg-pink-200' : 'bg-white/10'"></div>
      <button 
        type="button"
        @click="showBatchDeployModal"
        class="h-9 px-4 flex items-center border transition-all duration-200 cursor-pointer whitespace-nowrap"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/10 text-white bg-white/[0.06] hover:bg-white/[0.12]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ t('library.batchDeploy') }}
      </button>
      <div class="flex-1"></div>
      <span class="text-xs font-code mr-1" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : currentTheme === 'anime' ? 'text-slate-400' : 'text-zinc-600'">{{ t('library.escExit') }}</span>
      <button 
        type="button"
        @click="exitManageMode"
        class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        :class="[
          currentTheme === 'paper' ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.14)] text-[#353024] bg-[#fffdf7] hover:bg-[#f6ebd0] hover:text-[#352d1e] hover:border-[#d4b77b] shadow-sm' : currentTheme === 'anime' ? 'text-xs font-bold tracking-wider rounded-full border-pink-200 text-slate-700 bg-white/80 hover:bg-white hover:text-pink-600 shadow-sm' : currentTheme === 'minimal' ? 'text-xs font-bold tracking-wider rounded-xl border-white/15 text-white bg-white/[0.1] hover:bg-white/[0.18]' : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
        ]"
      >
        {{ t('library.exitManage') }}
      </button>
    </div>

    <!-- 顶部工具行：正常态 (!manageMode && !searchMode) -->
    <div v-else-if="!searchMode" class="flex items-center gap-2.5 mb-3 z-20 shrink-0 h-9">
      <!-- 左侧分类频段 -->
      <div class="flex items-center gap-2.5">
        <button 
          v-for="tab in TABS"
          :key="tab"
          @click="activeFilter = tab"
          class="relative transition-all duration-200 flex items-center overflow-hidden group cursor-pointer whitespace-nowrap active:scale-95"
          :class="[
            currentTheme === 'anime' 
              ? 'h-9 px-5 text-[13px] font-bold tracking-wide rounded-full' 
              : currentTheme === 'paper'
                ? 'h-9 px-4 rounded-xl text-[13px] font-semibold tracking-[0.02em]'
                : currentTheme === 'minimal' 
                  ? 'h-9 px-5 rounded-full text-[13px] tracking-wide backdrop-blur-xl' 
                  : 'h-10 px-6 text-xs font-bold tracking-wider uppercase rounded-[4px] border',
            activeFilter === tab 
              ? (currentTheme === 'anime' 
                  ? 'bg-gradient-to-b from-[#ff7eb3] to-[#ff98c3] text-white border-[1.5px] border-white/95 shadow-[0_6px_16px_rgba(255,126,179,0.34),inset_0_1.5px_1px_rgba(255,255,255,0.75)]' 
                  : currentTheme === 'paper'
                    ? 'bg-[#f2dfb4] text-[#352d1e] border border-[#d4b77b] shadow-[0_2px_8px_rgba(140,118,76,0.20)] font-semibold'
                    : currentTheme === 'minimal' 
                      ? 'text-white font-bold bg-gradient-to-b from-white/[0.22] to-white/[0.08] border border-white/45 shadow-[0_8px_22px_rgba(56,189,248,0.24),inset_0_1.5px_1px_rgba(255,255,255,0.6)]' 
                      : 'bg-[#00f3ff]/15 text-[#00f3ff] border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.15)] tab-active-glow') 
              : (currentTheme === 'anime' 
                  ? 'bg-white/90 text-[#7a4e6b] border-[1.5px] border-[#ffd6e7] hover:bg-white hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]' 
                  : currentTheme === 'paper'
                    ? 'bg-[#fffdf7]/95 text-[#6b6251] border border-[rgba(90,78,56,0.13)] hover:bg-[#f6ebd0] hover:text-[#353024] hover:border-[rgba(140,118,76,0.28)]'
                    : currentTheme === 'minimal' 
                      ? 'text-[#a3b8cc] hover:text-white bg-white/[0.06] hover:bg-white/[0.13] border border-white/[0.14] hover:border-white/30 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22)] font-medium' 
                      : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/15 hover:text-zinc-200 hover:bg-white/[0.04]')
          ]"
        >
          <!-- 经典主题扫光 -->
          <span v-if="currentTheme !== 'anime' && currentTheme !== 'minimal' && currentTheme !== 'paper' && activeFilter === tab" class="absolute inset-0 pointer-events-none sweep-animation bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
          <span class="relative z-10">{{ getTabLabel(tab) }}</span>
        </button>
      </div>

      <!-- 排列对齐：业务动作区与 tab 统一左排 -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="showCloudSave"
          class="h-9 px-4 flex items-center border transition-all duration-200 cursor-pointer active:scale-95"
          :class="[
            currentTheme === 'anime' 
              ? 'text-[12.5px] font-bold tracking-wide rounded-full border-[1.5px] border-[#ffd6e7] text-[#7a4e6b] bg-white/90 hover:bg-white hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]' 
              : currentTheme === 'paper'
                ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.13)] text-[#3e635b] bg-[#fffdf7]/95 hover:bg-[#ebf3f0] hover:border-[#c1d7d1]'
                : currentTheme === 'minimal'
                  ? 'text-[12.5px] font-semibold tracking-wide rounded-full border-white/[0.16] text-[#c8d7e8] hover:text-white bg-white/[0.06] hover:bg-white/[0.13] backdrop-blur-xl shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.25)]'
                  : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
          ]"
        >
          {{ t('cloud.title') }}
        </button>
        <button 
          :disabled="activeFilter !== 'titan_protocol'"
          @click="enterManageMode"
          class="h-9 px-4 flex items-center border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          :class="[
            currentTheme === 'anime' 
              ? 'text-[12.5px] font-bold tracking-wide rounded-full border-[1.5px]' 
              : currentTheme === 'paper'
                ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em]'
                : currentTheme === 'minimal'
                  ? 'text-[12.5px] font-semibold tracking-wide rounded-full border-white/[0.16] text-[#c8d7e8] hover:text-white bg-white/[0.06] hover:bg-white/[0.13] backdrop-blur-xl shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.25)]'
                  : 'text-xs font-bold tracking-wider rounded-[4px]',
            manageMode 
              ? (currentTheme === 'anime' ? 'bg-[#ffe4ef] text-[#d63b7c] border-[#ff9ec7] shadow-sm' : currentTheme === 'paper' ? 'bg-[#f2dfb4] text-[#352d1e] border-[#d4b77b]' : currentTheme === 'minimal' ? 'bg-white/[0.18] text-white' : 'bg-white/[0.15] text-white border-white/30 font-semibold') 
              : (currentTheme === 'anime' ? 'border-[#ffd6e7] text-[#7a4e6b] bg-white/90 hover:bg-white hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]' : currentTheme === 'paper' ? 'border-[rgba(90,78,56,0.13)] text-[#353024] bg-[#fffdf7]/95 hover:bg-[#f6ebd0] hover:border-[#d4b77b] hover:text-[#352d1e]' : currentTheme === 'minimal' ? 'border-white/[0.16] text-[#c8d7e8] hover:text-white bg-white/[0.06] hover:bg-white/[0.13]' : 'border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30')
          ]"
          :title="activeFilter !== 'titan_protocol' ? t('library.steamOnlyTip') : ''"
        >
          {{ manageMode ? t('library.exitManage') : t('library.batchManage') }}
        </button>
        <button 
          @click="handleRedeployAll"
          class="h-9 px-4 flex items-center border transition-all duration-200 cursor-pointer active:scale-95"
          :class="[
            currentTheme === 'anime' 
              ? 'text-[12.5px] font-bold tracking-wide rounded-full border-[1.5px] border-[#ffd6e7] text-[#7a4e6b] bg-white/90 hover:bg-white hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]' 
              : currentTheme === 'paper'
                ? 'rounded-xl text-[13px] font-semibold tracking-[0.02em] border-[rgba(90,78,56,0.13)] text-[#353024] bg-[#fffdf7]/95 hover:bg-[#f6ebd0] hover:border-[#d4b77b] hover:text-[#352d1e]'
                : currentTheme === 'minimal'
                  ? 'text-[12.5px] font-semibold tracking-wide rounded-full border-white/[0.16] text-[#c8d7e8] hover:text-white bg-white/[0.06] hover:bg-white/[0.13] backdrop-blur-xl shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.25)]'
                  : 'text-xs font-bold tracking-wider rounded-[4px] border-white/10 text-zinc-400 bg-white/[0.02] hover:bg-[#00f3ff]/[0.04] hover:text-[#00f3ff] hover:border-[#00f3ff]/30'
          ]"
        >
          {{ t('library.redeployAll') }}
        </button>
      </div>
      <div class="flex-1"></div>
      <button 
        @click="enterSearchMode"
        class="h-9 w-9 border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
        :class="[
          currentTheme === 'anime' 
            ? 'rounded-full border-[1.5px] border-[#ffd6e7] bg-white/90 text-[#7a4e6b] hover:text-[#d63b7c] hover:border-[#ffa8ce] shadow-[0_3px_10px_rgba(244,140,184,0.12),inset_0_1px_0_#ffffff]' 
            : currentTheme === 'paper'
              ? 'rounded-xl border-[rgba(90,78,56,0.13)] bg-[#fffdf7]/95 text-[#353024] hover:bg-[#f6ebd0] hover:border-[#d4b77b] hover:text-[#352d1e]'
              : currentTheme === 'minimal'
                ? 'rounded-full border-white/[0.16] bg-white/[0.06] text-[#c8d7e8] hover:text-white hover:bg-white/[0.14] backdrop-blur-xl shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.25)]'
                : 'rounded-[4px] border-white/10 bg-white/[0.02] text-zinc-400 hover:text-[#00f3ff] hover:border-[#00f3ff]/40'
        ]"
        :title="t('library.searchMode.entry')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>

    <!-- 检索模式 -->
    <div v-else class="flex items-center gap-3 mb-5 z-20 shrink-0 h-9 animate-fade-in">
      <div 
        class="flex-1 h-full flex items-center gap-3 px-4 border transition-all duration-300"
        :class="currentTheme === 'anime' 
          ? 'bg-white border-pink-300 rounded-full shadow-[0_4px_20px_rgba(244,114,182,0.15)] text-slate-800' 
          : currentTheme === 'paper'
            ? 'bg-white border-[rgba(90,78,56,0.18)] focus-within:border-[#667b48] rounded-xl text-[#353024] shadow-sm'
            : currentTheme === 'minimal'
              ? 'bg-[#0a0e17] rounded-xl border-cyan-400/40 text-white shadow-lg'
              : 'bg-[#0e1118] rounded-lg border-white/20 shadow-sm text-white'"
      >
        <svg class="w-4 h-4 shrink-0" :class="currentTheme === 'anime' ? 'text-pink-500' : currentTheme === 'paper' ? 'text-[#667b48]' : currentTheme === 'minimal' ? 'text-[#00f2ff]' : 'text-white/50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
          ref="searchInputRef"
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('library.searchMode.placeholder', { count: libraryStore.items.length })"
          class="flex-1 h-full bg-transparent focus:outline-none font-code"
          :class="currentTheme === 'paper' ? 'text-[13px] text-[#353024] placeholder-[#9b917e]' : (currentTheme === 'anime' ? 'text-xs text-slate-800 placeholder-slate-400' : 'text-xs text-white placeholder-zinc-600')"
          @keyup.esc="exitSearchMode"
        />
        <span class="text-xs font-code whitespace-nowrap shrink-0" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-500' : 'text-zinc-500'">
          {{ t('library.searchMode.results', { count: filteredList.length }) }}
        </span>
        <button @click="exitSearchMode" class="transition-colors shrink-0 flex items-center cursor-pointer" :class="currentTheme === 'paper' ? 'text-[#6b6251] hover:text-[#353024]' : currentTheme === 'anime' ? 'text-slate-400 hover:text-slate-800' : 'text-zinc-500 hover:text-white'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- 资产卡片网格容器 -->
    <div class="flex-1 overflow-hidden relative z-10" :class="currentTheme === 'minimal' ? '-mx-7' : (currentTheme === 'paper' || currentTheme === 'anime' ? '-mx-5' : 'pb-2')">
      <VirtualList
        v-if="filteredList.length > 0"
        :items="filteredList"
        :columns="currentColumns"
        :aspectRatio="themeAspectRatio"
        :gap="currentTheme === 'minimal' ? 22 : (currentTheme === 'paper' || currentTheme === 'anime' ? 18 : 24)"
        :paddingX="currentTheme === 'minimal' ? 28 : (currentTheme === 'paper' || currentTheme === 'anime' ? 20 : 24)"
        :paddingTop="currentTheme === 'paper' || currentTheme === 'anime' || currentTheme === 'minimal' ? 12 : 24"
        :paddingBottom="currentTheme === 'minimal' ? 116 : 32"
      >
        <template #default="{ items }">
          <div
            v-for="item in items"
            :key="item.id"
            class="relative transition-all duration-200"
            :class="[
              currentTheme === 'paper' ? 'rounded-[14px]' : currentTheme === 'anime' ? 'rounded-[24px]' : currentTheme === 'minimal' ? 'rounded-[16px]' : 'rounded-theme',
              manageMode && selectedIds.has(item.id) 
                ? (currentTheme === 'paper'
                    ? 'ring-2 ring-[#667b48] shadow-[0_6px_18px_rgba(102,123,72,0.22)]'
                    : currentTheme === 'anime' 
                    ? 'ring-3 ring-[#ea8fb4] shadow-[0_0_24px_rgba(234,143,180,0.4)]' 
                    : currentTheme === 'minimal' 
                      ? 'ring-2 ring-[#bae6fd]/75 shadow-[0_0_20px_rgba(186,230,253,0.25)]' 
                      : 'ring-2 ring-white/50 rounded-xl') 
                : ''
            ]"
            @click="manageMode && toggleSelectCard(item.id)"
          >
            <!-- 多选管理模式下的勾选框 -->
            <div
              v-if="manageMode"
              class="absolute top-3 left-3 z-30 w-5 h-5 flex items-center justify-center cursor-pointer transition-colors backdrop-blur-md"
              :class="[
                currentTheme === 'paper' ? 'rounded-md' : currentTheme === 'anime' ? 'rounded-full' : currentTheme === 'minimal' ? 'rounded-md' : 'rounded',
                selectedIds.has(item.id) 
                  ? (currentTheme === 'paper' ? 'bg-[#667b48] border border-[#667b48] text-[#fffdf7]' : currentTheme === 'anime' ? 'bg-[#ea8fb4] border-2 border-[#ea8fb4] text-white shadow-[0_0_8px_rgba(234,143,180,0.6)]' : currentTheme === 'minimal' ? 'bg-[#00f2ff] border border-[#00f2ff] text-[#06080e] shadow-[0_0_10px_#00f2ff]' : 'bg-[#00f3ff] border border-[#00f3ff]') 
                  : (currentTheme === 'paper' ? 'bg-white/92 border border-[rgba(90,78,56,0.28)] hover:border-[#667b48] text-transparent' : currentTheme === 'anime' ? 'bg-white/90 border border-[#f5cbdc] hover:border-[#ea8fb4] text-transparent' : currentTheme === 'minimal' ? 'bg-black/60 border border-white/30 hover:border-[#00f2ff] text-transparent' : 'bg-black/60 border border-white/30 hover:border-white/60')
              ]"
              @click.stop="toggleSelectCard(item.id)"
            >
              <svg v-if="selectedIds.has(item.id)" class="w-3.5 h-3.5" :class="currentTheme === 'paper' || currentTheme === 'anime' ? 'text-white' : currentTheme === 'minimal' ? 'text-black' : 'text-black'" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <!-- 卡片分发 -->
            <AnimeGameCard 
              v-if="currentTheme === 'anime'"
              :id="String(item.id)"
              :title="item.title"
              :tags="[item.type.toUpperCase()]"
              :image="item.cover"
              :type="item.type"
              :is-in-library="true"
              :is-installed="true"
              :hide-controls="true"
              :local-steam-first="true"
              :show-launch-button="true"
              @launch="() => handleCardLaunch(item)"
              @contextmenu="handleCardContextMenu"
            />
            <TechGameCard
              v-else-if="currentTheme === 'minimal'"
              :id="String(item.id)"
              :title="item.title"
              :tags="[item.type.toUpperCase()]"
              :image="item.cover"
              :type="item.type"
              :is-in-library="true"
              :is-installed="true"
              :hide-controls="true"
              :local-steam-first="true"
              :show-launch-button="true"
              @launch="() => handleCardLaunch(item)"
              @contextmenu="handleCardContextMenu"
            />
            <PaperGameCard
              v-else-if="currentTheme === 'paper'"
              :id="String(item.id)"
              :title="item.title"
              :tags="[item.type.toUpperCase()]"
              :image="item.cover"
              :type="item.type"
              :is-in-library="true"
              :is-installed="true"
              :hide-controls="true"
              :local-steam-first="true"
              :show-launch-button="true"
              @launch="() => handleCardLaunch(item)"
              @contextmenu="handleCardContextMenu"
            />
            <GameCard 
              v-else
              :id="item.id"
              :title="item.title"
              :tags="[item.type.toUpperCase()]"
              :image="item.cover"
              :type="item.type"
              :isInLibrary="true"
              :isInstalled="true"
              :hideControls="true"
              :showTopRightBadge="true"
              :local-steam-first="true"
              :show-launch-button="true"
              @launch="() => handleCardLaunch(item)"
              @contextmenu="handleCardContextMenu"
            />
          </div>
        </template>
      </VirtualList>
      
      <div v-else class="h-32 flex flex-col items-center justify-center" :class="currentTheme === 'paper' ? '' : 'opacity-40'">
        <svg class="w-12 h-12 mb-4" :class="currentTheme === 'paper' ? 'text-[#9b917e]' : 'text-zinc-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <p :class="currentTheme === 'paper' ? 'text-[13px] font-medium text-[#6b6251]' : 'text-xs font-bold text-zinc-400 uppercase tracking-widest'">{{ t('library.noAssets') }}</p>
      </div>
    </div>

    <!-- 管理态批量操作菜单 -->
    <ContextMenu 
      v-if="manageMode"
      :visible="menu.show" 
      :x="menu.x" 
      :y="menu.y" 
      title="BATCH OPS"
      variant="library"
      @close="closeMenu"
    >
      <button 
        @click="batchRedeploy"
        class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'text-[13px] font-semibold text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
          : currentTheme === 'anime' 
          ? 'text-sm font-bold text-[#1e192b] hover:bg-gradient-to-r hover:from-[#ffd1e6]/70 hover:to-[#d4f4ff]/70 hover:text-[#d6336c]' 
          : 'text-sm font-bold text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black'"
      >
        <span class="w-5 text-center">🚀</span> {{ t('library.ctxRedeploy', { count: selectedIds.size }) }}
      </button>
      <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      <button 
        @click="batchToggleAutoUpdate"
        class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
          : currentTheme === 'anime' 
          ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
          : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
      >
        <span class="w-5 text-center">{{ allSelectedAutoUpdateOn ? '⏸️' : '▶️' }}</span> {{ allSelectedAutoUpdateOn ? t('library.contextMenu.disableUpdate') : t('library.contextMenu.enableUpdate') }}
      </button>
      <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      <button 
        @click="batchUninstall"
        class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
          : currentTheme === 'anime' 
          ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
          : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
      >
        <span class="w-5 text-center">🔧</span> {{ t('library.batchUninstall') }}
      </button>
      <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      <button 
        @click="batchRemoveRecords"
        class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'text-[13px] font-medium text-[#ba5243] hover:bg-[#fbefe9] hover:text-[#993e32]'
          : currentTheme === 'anime' 
          ? 'text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600' 
          : 'text-sm font-bold text-red-500 hover:bg-red-900/50 hover:text-white'"
      >
        <span class="w-5 text-center">➖</span> {{ t('library.contextMenu.deleteRecord') }}
      </button>
    </ContextMenu>

    <!-- 右键上下文菜单 -->
    <ContextMenu 
      v-if="!manageMode"
      :visible="menu.show" 
      :x="menu.x" 
      :y="menu.y" 
      :title="menu.item?.type === 'titan_protocol' ? 'MANAGER' : t('library.contextMenu.title')" 
      variant="library"
      @close="closeMenu"
    >
      <template v-if="menu.item?.type === 'titan_protocol' && prefOnlineLaunch">
        <button 
          @click="handleAction('onlineLaunch')" 
          class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'text-[13px] font-semibold text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
            : currentTheme === 'anime' 
            ? 'text-sm font-bold text-[#1e192b] hover:bg-gradient-to-r hover:from-[#ffd1e6]/70 hover:to-[#d4f4ff]/70 hover:text-[#d6336c]' 
            : 'text-sm font-bold text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black'"
        >
          <span class="w-5 text-center text-base">🎮</span> {{ t('library.contextMenu.onlineLaunch') }}
        </button>
        <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      </template>

      <button 
        @click="handleAction('redownload')" 
        class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
        :class="currentTheme === 'paper'
          ? 'text-[13px] font-semibold text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
          : currentTheme === 'anime' 
          ? 'text-sm font-bold text-[#1e192b] hover:bg-gradient-to-r hover:from-[#ffd1e6]/70 hover:to-[#d4f4ff]/70 hover:text-[#d6336c]' 
          : 'text-sm font-bold text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black'"
      >
        <span class="w-5 text-center">⬇️</span> {{ t('library.contextMenu.redownload') }}
      </button>
      <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      
      <template v-if="menu.item?.type === 'titan_protocol'">
        <button 
          @click="handleAction('uninstall')" 
          class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
            : currentTheme === 'anime' 
            ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
            : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
        >
          <span class="w-5 text-center">🔧</span> {{ t('library.contextMenu.uninstall') }}
        </button>
        <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
      </template>
      
      <template v-if="menu.item?.type === 'titan_protocol'">
        <button 
          @click="handleAction('toggleAutoUpdate')" 
          class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
            : currentTheme === 'anime' 
            ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
            : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
        >
          <span class="w-5 text-center">{{ menu.item?.meta?.autoUpdate === true ? '⏸️' : '▶️' }}</span> 
          {{ menu.item?.meta?.autoUpdate === true ? t('library.contextMenu.disableUpdate') : t('library.contextMenu.enableUpdate') }}
        </button>
      </template>

      <template v-if="menu.item?.type === 'titan_protocol' && prefDlcVisible && dlcInstalled">
        <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
        <button
          @click="handleAction('dlcManage')"
          class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
            : currentTheme === 'anime' 
            ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
            : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
        >
          <span class="w-5 text-center">🧩</span> {{ t('library.contextMenu.dlcManage') }}
        </button>
      </template>
      <template v-if="menu.item?.type === 'titan_protocol' && isPatchSupported(menu.item)">
        <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
        <template v-if="!authStore.isVip || (authStore.user?.vipLevel ?? 0) === 0">
          <button 
            @click="handleAction('gotoPatchCommunity')" 
            class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
            :class="currentTheme === 'paper'
              ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
              : currentTheme === 'anime' 
              ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
              : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
          >
            <span class="w-5 text-center">🌐</span> {{ t('library.contextMenu.gotoPatchCommunity') }}
          </button>
        </template>
        <template v-else>
          <button 
            @click="handleAction('autoInstallPatch')" 
            class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
            :class="currentTheme === 'paper'
              ? 'text-[13px] font-semibold text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
              : currentTheme === 'anime' 
              ? 'text-sm font-bold text-[#1e192b] hover:bg-gradient-to-r hover:from-[#ffd1e6]/70 hover:to-[#d4f4ff]/70 hover:text-[#d6336c]' 
              : 'text-sm font-bold text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black'"
          >
            <span class="w-5 text-center">⚡</span> {{ t('library.contextMenu.autoInstallPatch') }}
          </button>
          <div class="h-px my-1" :class="currentTheme === 'paper' ? 'bg-[rgba(90,78,56,0.12)]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/5'"></div>
          <button 
            @click="handleAction('openPatcher')" 
            class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
            :class="currentTheme === 'paper'
              ? 'text-[13px] font-medium text-[#353024] hover:bg-[#f6ebd0] hover:text-[#352d1e]'
              : currentTheme === 'anime' 
              ? 'text-sm font-bold text-[#262133] hover:bg-pink-50/80 hover:text-[#ff66b2]' 
              : 'text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white'"
          >
            <span class="w-5 text-center">🛠️</span> {{ t('library.contextMenu.openPatcher') }}
          </button>
        </template>
      </template>
      <!-- fix50g: 非 protocol 类型恢复右键"移除记录"(继承上方原生分割线, 无双杠) -->
      <template v-if="menu.item?.type !== 'titan_protocol'">
        <button
          @click="handleAction('deleteRecord')"
          class="w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
          :class="currentTheme === 'paper'
            ? 'text-[13px] font-medium text-[#ba5243] hover:bg-[#fbefe9] hover:text-[#993e32]'
            : currentTheme === 'anime' 
            ? 'text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600' 
            : 'text-sm font-bold text-red-500 hover:bg-red-900/50 hover:text-white'"
        >
          <span class="w-5 text-center">➖</span> {{ t('library.contextMenu.deleteRecord') }}
        </button>
      </template>
    </ContextMenu>

    <!-- 补丁杀软前置告知模态框 -->
    <PatchNoticeModal
      :visible="showPatchNoticeModal"
      @confirm="onPatchNoticeConfirm"
      @cancel="onPatchNoticeCancel"
    />

    <!-- 资产详情模态框 -->
    <ShareGameModal
      v-if="isShareModalVisible"
      :visible="isShareModalVisible"
      :item="selectedItem"
      @close="isShareModalVisible = false"
    />

    <GameDetailModal 
      v-if="isDetailVisible"
      :visible="isDetailVisible"
      :gameId="selectedItem?.id || ''"
      :cover="selectedItem?.cover || ''"
      :title="selectedItem?.title || ''"
      :tags="[selectedItem?.type || 'GAME']"
      :rating="9.9"
      :description="selectedItem?.desc || (t('library.defaultDesc'))"
      :isInstalled="true"
      :isInLibrary="true"
      :isDownloading="false"
      :isInstalling="false"
      :progress="0"
      statusText="READY"
      downloadText=""
      :type="selectedItem?.type || ''"
      @close="isDetailVisible = false"
    />

    <CloudSave v-if="cloudSaveVisible" :visible="cloudSaveVisible" @close="cloudSaveVisible = false" />

    <!-- 批量部署进度模态框 -->
    <Teleport to="body">
    <div v-if="batchProgress.visible" class="fixed inset-0 flex items-center justify-center z-[999] animate-fade-in" :class="currentTheme === 'paper' ? 'bg-[#353024]/30 backdrop-blur-md' : currentTheme === 'anime' ? 'bg-slate-900/30 backdrop-blur-md' : currentTheme === 'minimal' ? 'bg-black/80 backdrop-blur-xl' : 'bg-black/70'">
      <div 
        class="border p-6 rounded-2xl w-[420px] transition-all duration-300"
        :class="currentTheme === 'paper'
          ? 'bg-[#fffdf7] border-[rgba(90,78,56,0.14)] shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] text-[#353024]'
          : currentTheme === 'anime' 
          ? 'bg-white border-pink-200/90 shadow-[0_12px_40px_rgba(244,114,182,0.2)] text-slate-800' 
          : currentTheme === 'minimal'
          ? 'bg-[#0b101b]/95 border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white backdrop-blur-2xl'
          : 'bg-[#121212] border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.15)] text-white'"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" :class="currentTheme === 'paper' ? 'border-[#667b48]' : currentTheme === 'anime' ? 'border-pink-500' : currentTheme === 'minimal' ? 'border-sky-400' : 'border-[#00f3ff]'"></div>
          <h3 class="text-sm font-bold uppercase tracking-wider" :class="currentTheme === 'paper' ? 'text-[#353024]' : currentTheme === 'anime' ? 'text-slate-800' : 'text-white'">{{ batchProgress.title }}</h3>
        </div>
        
        <div class="relative w-full h-1.5 rounded-full overflow-hidden mb-3" :class="currentTheme === 'paper' ? 'bg-[#ece4d2]' : currentTheme === 'anime' ? 'bg-pink-100' : 'bg-white/10'">
          <div 
            class="h-full transition-all duration-300 rounded-full" 
            :class="currentTheme === 'paper' ? 'bg-[#667b48]' : currentTheme === 'anime' ? 'bg-gradient-to-r from-[#ff7eb3] to-[#ffb1d2] shadow-[0_0_8px_#ff85b3]' : currentTheme === 'minimal' ? 'bg-gradient-to-r from-white to-[#c8e6ff]' : 'bg-gradient-to-r from-[#00f3ff] to-[#0088ff]'"
            :style="{ width: batchProgress.percent + '%' }"
          ></div>
        </div>
        
        <div class="flex justify-between items-center font-code text-sm mb-4" :class="currentTheme === 'paper' ? 'text-[#6b6251]' : currentTheme === 'anime' ? 'text-slate-500' : 'text-gray-500'">
          <span>{{ batchProgress.percent }}%</span>
          <span>[{{ batchProgress.current }}/{{ batchProgress.total }}]</span>
        </div>

        <div class="max-h-40 overflow-y-auto border-t pt-2 font-code text-sm space-y-1 scrollbar-hide" :class="currentTheme === 'paper' ? 'border-[rgba(90,78,56,0.10)]' : currentTheme === 'anime' ? 'border-pink-100' : 'border-white/5'">
          <div v-for="(log, i) in batchProgress.logs" :key="i" class="flex justify-between items-start py-0.5 border-b" :class="currentTheme === 'paper' ? 'border-[rgba(90,78,56,0.06)]' : currentTheme === 'anime' ? 'border-pink-50' : 'border-white/[0.02]'">
            <span class="truncate max-w-[260px]" :class="currentTheme === 'paper' ? 'text-[#353024]' : currentTheme === 'anime' ? 'text-slate-600' : 'text-gray-400'">{{ log.displayName }}</span>
            <span :class="log.success ? (currentTheme === 'paper' ? 'text-[#3f5b32]' : currentTheme === 'anime' ? 'text-emerald-600' : (currentTheme === 'minimal' ? 'text-sky-300' : 'text-[#00f3ff]')) : (currentTheme === 'paper' ? 'text-[#ba5243]' : 'text-red-500')" class="font-bold shrink-0">
              {{ log.success ? '✓ ' + (t('library.batch.successCount')) : `✕ ${log.reason || (t('library.batch.failCount'))}` }}
            </span>
          </div>
        </div>

        <div class="mt-5 flex justify-end">
          <button 
            @click="cancelCurrentDeploy" 
            class="px-4 py-1.5 text-sm font-bold transition-colors border"
            :class="currentTheme === 'paper'
              ? 'rounded-xl bg-[#fbefe9] hover:bg-[#f5dfd9] border-[#e3bcb3] text-[#993e32] font-semibold'
              : currentTheme === 'anime' 
              ? 'rounded bg-red-50 hover:bg-red-100 border-red-200 text-red-600' 
              : 'rounded bg-red-950/40 hover:bg-red-900/60 border-red-900/50 text-red-400'"
          >
            {{ t('library.batch.cancel') }}
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { t } from '../i18n'
import { useLibraryStore, appIdOf, type LibraryItem } from '../stores/libraryStore'
import { useAuthStore } from '../stores/authStore'
import { useSearchStore } from '../stores/searchStore'
import { useTheme } from '../composables/useTheme'
import ContextMenu from "./common/ContextMenu.vue"
import GameCard from './GameCard.vue'
import AnimeGameCard from '../themes/anime/AnimeGameCard.vue'
import TechGameCard from '../themes/minimal/TechGameCard.vue'
import PaperGameCard from '../themes/paper/PaperGameCard.vue'
import PatchNoticeModal from './modals/PatchNoticeModal.vue'
import GameDetailModal from './GameDetailModal.vue'
import ShareGameModal from './modals/ShareGameModal.vue'
import CloudSave from './CloudSave.vue'
import VirtualList from './VirtualList.vue'
import Swal from 'sweetalert2'

const { currentTheme } = useTheme()

import { tcToast } from '../utils/tcToast'
function titanAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
  tcToast(title, text, icon)
}

type LibraryType = 'titan_protocol' | 'game' | 'patch'

const TABS = ['titan_protocol'] as const

const libraryTabs = computed(() => [
  { id: 'titan_protocol', label: t('library.tabSteamLib') },

])

const handleCardClick = (item: any) => {
  if (manageMode.value) {
    toggleSelectCard(item.id)
  } else {
    openGameDetail(item)
  }
}

const handleCardLaunch = async (item: any) => {
  let appId = ''
  if (typeof item === 'string') {
    const m = item.match(/(\d+)$/)
    appId = m ? m[1] : ''
  } else if (item && typeof item === 'object') {
    appId = appIdOf(item)
  }
  if (!appId) {
    tcToast(t('library.launch.failTitle'), t('library.launch.noAppId'), 'error')
    return
  }

  try {
    const res = await window.electron.invoke('titan:launch-game', appId) as { success: boolean; notInstalled?: boolean; msg?: string }
    if (!res.success) {
      if (res.notInstalled) {
        // 核心防呆：未在 Steam 安装
        const currentThemeAttr = document.documentElement.getAttribute('data-theme')
        const isPaperTheme = currentThemeAttr === 'paper'
        const isAnimeTheme = currentThemeAttr === 'anime'
        const isMinimalTheme = currentThemeAttr === 'minimal'

        await Swal.fire({
          title: t('library.launch.notInstalledTitle'),
          text: t('library.launch.notInstalledDesc'),
          icon: 'info',
          confirmButtonText: t('common.confirm') || '知道了',
          background: isPaperTheme ? '#fffdf7' : (isAnimeTheme ? '#ffffff' : (isMinimalTheme ? 'rgba(16, 22, 35, 0.95)' : '#121212')),
          color: isPaperTheme ? '#353024' : (isAnimeTheme ? '#1e293b' : '#fff'),
          confirmButtonColor: isPaperTheme ? '#667b48' : (isAnimeTheme ? '#ea8fb4' : (isMinimalTheme ? '#00f2ff' : '#00f3ff')),
          customClass: {
            popup: isPaperTheme
              ? 'border border-[#5a4e38]/15 shadow-[0_24px_60px_-14px_rgba(62,54,38,0.22)] rounded-2xl'
              : (isAnimeTheme 
                ? 'border border-pink-200/90 shadow-[0_8px_25px_rgba(244,114,182,0.25)] rounded-2xl' 
                : (isMinimalTheme ? 'border border-[#00f2ff]/35 shadow-[0_0_25px_rgba(0,242,255,0.2)] rounded-xl' : 'border border-white/10 rounded-lg'))
          }
        })
      } else {
        tcToast(t('library.launch.failTitle'), res.msg || t('library.launch.unknownError'), 'error')
      }
    } else {
      libraryStore.setAppRunning(appId, true)
      tcToast(t('library.launch.successTitle') || '启动中', t('library.launch.successDesc') || '已唤起 Steam 启动游戏', 'success')
    }
  } catch (e: any) {
    tcToast(t('library.launch.failTitle'), e.message || t('library.launch.errorDefault'), 'error')
  }
}

const libraryStore = useLibraryStore()
const authStore = useAuthStore()
const searchStore = useSearchStore()

const isPatchSupported = (item: any) => {
  if (!item) return false
  const aid = appIdOf(item)
  return searchStore.checkRadarStatus(aid) === 'yellow'
}

const currentColumns = ref(5)
const themeAspectRatio = computed(() => 2 / 3)
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
  if (w < 1024) currentColumns.value = 3
  else if (w < 1280) currentColumns.value = 4
  else if (w < 1600) currentColumns.value = 5
  else if (w < 2560) currentColumns.value = 6
  else if (w < 3840) currentColumns.value = 7
  else currentColumns.value = 8
}
watch(currentTheme, updateColumns)

const activeFilter = ref<LibraryType>('titan_protocol')
const searchQuery = ref('')

const searchMode = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

const enterSearchMode = async () => {
  exitManageMode()
  searchMode.value = true
  await nextTick()
  searchInputRef.value?.focus()
}
const exitSearchMode = () => {
  searchQuery.value = ''
  searchMode.value = false
}
// fix43(C1): the library view is always mounted (v-show in App.vue); gate global
// hotkeys on the active prop so hidden views never hijack Ctrl+F etc.
const props = withDefaults(defineProps<{ active?: boolean }>(), { active: true })

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (Swal.isVisible()) return
  if (!props.active) return
  if (e.key === 'Escape') {
    if (menu.value.show) { closeMenu(); return }
    if (manageMode.value) { exitManageMode(); return }
    if (searchMode.value) { exitSearchMode(); return }
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    enterSearchMode()
  }
}
const menu = ref<{ show: boolean; x: number; y: number; item: LibraryItem | null }>({ show: false, x: 0, y: 0, item: null })
const isDetailVisible = ref(false)
const isShareModalVisible = ref(false)
const selectedItem = ref<LibraryItem | null>(null)
// TITAN-EXP: 实验功能开关预载（挂载 + 视图激活刷新；右键 0ms 同步渲染，无点击时 IPC）
const prefOnlineLaunch = ref(false)
const prefDlcVisible = ref(false)
const dlcInstalled = ref(false)
async function loadExpPrefs() {
  try {
    prefOnlineLaunch.value = !!(await window.electron.invoke('sys:get-config', 'pref_enable_online_launch'))
  } catch { /* 读取失败按默认关 */ }
  await loadToolPrefs()
}
// fix50: DLC 工具显隐预载 + 安装态探测(零状态存储,exe 文件存在即已安装)
async function loadToolPrefs() {
  try {
    prefDlcVisible.value = !!(await window.electron.invoke('sys:get-config', 'pref_tool_dlc_visible'))
  } catch { /* 读取失败按默认关 */ }
  await refreshDlcStatus()
}
async function refreshDlcStatus() {
  try {
    const st = await window.electron.invoke('tools:status', 'dlc_manager') as { installed?: boolean }
    dlcInstalled.value = !!st?.installed
  } catch { /* 读取失败按未安装 */ }
}
loadExpPrefs()
watch(() => props.active, (v) => { if (v) { loadExpPrefs(); libraryStore.load() } })

// fix50(CTO): 跨组件状态一致 —— ExpFeaturesModal 安装/卸载后经 tools:changed 广播联动,右键菜单不呈现陈旧状态
let offToolsChanged: (() => void) | null = null
onMounted(() => {
  offToolsChanged = window.electron.on('tools:changed', (payload: { toolId?: string; installed?: boolean }) => {
    if (payload?.toolId === 'dlc_manager') dlcInstalled.value = !!payload?.installed
  })
})
onUnmounted(() => { if (offToolsChanged) { offToolsChanged(); offToolsChanged = null } })

const cloudSaveVisible = ref(false)
const showCloudSave = () => { cloudSaveVisible.value = true }

const batchProgress = ref({
  visible: false,
  title: '',
  percent: 0,
  current: 0,
  total: 0,
  logs: [] as Array<{appId: string; displayName: string; success: boolean; reason?: string}>
})

let isCancelled = false

const filteredList = computed(() => {
  const q = searchQuery.value.toLowerCase()
  const list = libraryStore.items
    .filter(i => (!activeFilter.value || i.type === activeFilter.value) && (!q || i.title.toLowerCase().includes(q)))
  switch (sortMode.value) {
    case 'oldest': return [...list].sort((a, b) => a.addTime - b.addTime)
    case 'name': return [...list].sort((a, b) => a.title.localeCompare(b.title))
    default: return [...list].sort((a, b) => b.addTime - a.addTime)
  }
})

const tabKeys: Record<string, string> = { titan_protocol: 'library.tabSteamLib', game: 'library.tabGame', patch: 'library.tabPatch' }
const getTabLabel = (tab: LibraryType) => tabKeys[tab] ? t(tabKeys[tab]) : tab

const handleCardContextMenu = (data: { id: string; x: number; y: number; title: string; type: string; installed: boolean }) => {
  const foundItem = libraryStore.items.find(i => i.id === data.id)
  if (!foundItem) return
  if (manageMode.value && !selectedIds.value.has(data.id)) {
    const next = new Set(selectedIds.value)
    next.add(data.id)
    selectedIds.value = next
  }
  menu.value = { 
    show: true, 
    x: Math.max(10, Math.min(data.x, window.innerWidth - 266)), 
    y: Math.max(10, Math.min(data.y, window.innerHeight - 300)), 
    item: foundItem 
  }
}

const openGameDetail = (item: LibraryItem) => {
  selectedItem.value = item
  if (item.type === 'sharegame') {
    isShareModalVisible.value = true
    return
  }
  isDetailVisible.value = true
}

const closeMenu = () => {
  menu.value.show = false
}

const cancelCurrentDeploy = () => {
  isCancelled = true
}

const handleOnlineLaunch = async (item: LibraryItem) => {
  const appId = appIdOf(item)
  if (!appId) {
    titanAlert(t('library.launch.failTitle'), t('library.launch.noAppId'), 'error')
    return
  }

  const isPaper = currentTheme.value === 'paper'
  const result = await Swal.fire({
    title: t('library.launch.title'),
    html: `
      <div style="text-align:left; color:${isPaper ? '#6b6251' : '#aaa'}; font-size:14px; line-height:1.8;">
        <p style="margin-bottom:12px;">${t('library.launch.rule1')}</p>
        <p style="margin-bottom:12px;">${t('library.launch.rule2')}</p>
        <p style="margin-bottom:14px;">${t('library.launch.rule3')}</p>
        <label for="tc-online-realappid" style="display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:8px; background:${isPaper ? 'rgba(102,123,72,0.08)' : 'rgba(255,255,255,0.05)'}; border:1px solid ${isPaper ? 'rgba(90,78,56,0.15)' : 'rgba(255,255,255,0.1)'}; color:${isPaper ? '#353024' : '#ddd'}; font-size:13px; cursor:pointer; user-select:none;">
          <input id="tc-online-realappid" type="checkbox" style="width:15px; height:15px; accent-color:${isPaper ? '#667b48' : '#00f3ff'}; cursor:pointer;" />
          <span>${t('library.launch.realAppIdOpt')}</span>
        </label>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('library.launch.btn'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
    cancelButtonColor: isPaper ? '#efe8d8' : '#333',
    reverseButtons: true,
    allowOutsideClick: false,
    preConfirm: () => ({
      realAppId: Boolean((document.getElementById('tc-online-realappid') as HTMLInputElement | null)?.checked)
    })
  })

  if (!result.isConfirmed) return

  try {
    const res = await window.electron.invoke('titan:launch-game', appId, {
      onlineFix: true,
      realAppId: Boolean(result.value?.realAppId)
    })
    if (!res.success) {
      const errText = res.msg === 'ERR_PURE_STEAM_NOT_RUNNING'
        ? t('library.launch.pureNeedSteamFirst')
        : (res.msg || t('library.launch.unknownError'))
      tcToast(t('library.launch.failTitle'), errText, 'error')
    }
  } catch (e: any) {
    tcToast(t('library.launch.failTitle'), e.message || (t('library.launch.errorDefault')), 'error')
  }
}

// 补丁杀软前置告知弹窗控制状态与流程
const showPatchNoticeModal = ref(false)
const targetPatchAppId = ref<number | null>(null)

const onPatchNoticeConfirm = () => {
  showPatchNoticeModal.value = false
  if (targetPatchAppId.value) {
    startPatchInstallFlow(targetPatchAppId.value)
  }
}

const onPatchNoticeCancel = () => {
  showPatchNoticeModal.value = false
  targetPatchAppId.value = null
}

const startPatchInstallFlow = async (appId: number) => {
  if (!appId) return
  tcToast(
    t('library.patchNotice.installingTitle') || '正在检索并部署补丁...', 
    t('library.patchNotice.installingDesc') || '请稍候，这可能需要一点时间', 
    'info'
  )
  try {
    const res = await window.electron.invoke('titan:install-patch', { appid: appId }) as { success?: boolean; error?: string }
    if (res?.success) {
      tcToast(
        t('library.patchNotice.dispatchedTitle') || '⚡ 官方补丁助手已就绪', 
        t('library.patchNotice.dispatchedDesc') || '请在弹出的补丁助手窗口中点击【立即部署】即可', 
        'success'
      )
    } else {
      tcToast(res?.error || t('library.patchNotice.failTitle') || '部署补丁失败', '', 'error')
    }
  } catch (e: any) {
    tcToast(e?.message || t('library.patchNotice.errorTitle') || '部署补丁异常', '', 'error')
  }
}

const handleAction = async (action: string) => {
  const target = menu.value.item
  if (!target) return

  menu.value.show = false

  if (action === 'gotoPatchCommunity') {
    window.electron.sys.openExternal(import.meta.env.VITE_COMMUNITY_URL || 'https://example.com')
  } else if (action === 'openPatcher') {
    tcToast('正在准备官方补丁助手...', '', 'info')
    const res = await window.electron.invoke('titan:open-patcher') as { success?: boolean; error?: string }
    if (!res?.success) {
      tcToast(res?.error || '打开补丁助手失败', '', 'error')
    }
  } else if (action === 'autoInstallPatch') {
    targetPatchAppId.value = Number(appIdOf(target))
    const dismissed = localStorage.getItem('tc_pref_patch_notice_dismissed') === '1'
    if (dismissed) {
      startPatchInstallFlow(targetPatchAppId.value)
    } else {
      showPatchNoticeModal.value = true
    }
  } else if (action === 'onlineLaunch') {
    await handleOnlineLaunch(target)
  } else if (action === 'dlcManage') {
    const res = await window.electron.invoke('tools:launch', 'dlc_manager', { appid: appIdOf(target) }) as { success?: boolean; error?: string }
    if (!res?.success) tcToast(t('settings.exp.tools.launchFail', { error: res?.error || 'UNKNOWN' }), '', 'error')
  } else if (action === 'redownload') {
    openGameDetail(target)
  } else if (action === 'deleteRecord') {
    const isPaper = currentTheme.value === 'paper'
    const confirm = await Swal.fire({
      title: t('library.deleteConfirm.title'),
      text: t('library.deleteConfirm.desc'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('library.deleteConfirm.btn'),
      background: isPaper ? '#fffdf7' : '#121212',
      color: isPaper ? '#353024' : '#fff',
      confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
      cancelButtonColor: isPaper ? '#efe8d8' : '#333'
    })
    if (confirm.isConfirmed) {
      try {
        await libraryStore.removeItem(target.id)
      } catch (e) {
        console.error('[LibraryView] 移除痕迹异常:', e)
      }
    }
  } else if (action === 'uninstall') {
    const isPaper = currentTheme.value === 'paper'
    const confirm = await Swal.fire({
      title: t('library.uninstall.title'),
      text: t('library.uninstall.desc', { title: target.title }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('library.uninstall.btn'),
      cancelButtonText: t('common.cancel'),
      background: isPaper ? '#fffdf7' : '#121212',
      color: isPaper ? '#353024' : '#fff',
      confirmButtonColor: isPaper ? '#ba5243' : '#ef4444',
      cancelButtonColor: isPaper ? '#efe8d8' : '#333'
    })
    if (confirm.isConfirmed) {
      try {
        const detectRes = await window.electron.invoke('steam:detect')
        if (!detectRes?.path) {
           throw new Error(t('library.steamNotFound'))
        }
        
        // 引擎切换已移除：全局静默锁定 OST
        const currentEngine = 'ost'
        const res = await window.electron.invoke('titan:uninstall-game', detectRes.path, appIdOf(target), currentEngine)
        
        if (res?.success) {
          await libraryStore.removeItem(target.id)
          titanAlert(t('library.uninstall.successTitle'), t('library.uninstall.successDesc'), 'success')
        } else {
          titanAlert(t('library.uninstall.failTitle'), res?.msg || (t('library.uninstall.failDefault')), 'error')
        }
      } catch(e: any) {
        titanAlert(t('library.uninstall.errorTitle'), e.message, 'error')
      }
    }
  } else if (action === 'toggleAutoUpdate') {
    const newState = target.meta?.autoUpdate === true ? false : true
    try {
      await libraryStore.toggleAutoUpdate(target.id, newState)
      titanAlert(
        newState ? t('library.autoUpdate.enabledTitle') : t('library.autoUpdate.disabledTitle'),
        newState ? t('library.autoUpdate.enabledDesc') : t('library.autoUpdate.disabledDesc'),
        'success'
      )
    } catch (e: any) {
      titanAlert(t('library.autoUpdate.errorTitle'), e.message, 'error')
    }
  }
}

const getQuotaLeft = () => Math.max(0, (authStore.dailyQuota?.remaining ?? 0) + (authStore.dailyQuota?.extraRemaining ?? 0))

async function showBatchDeployModal() {
  const isPaper = currentTheme.value === 'paper'
  const { value: text } = await Swal.fire({
    title: `<span style="font-size:18px; font-weight:700; color:${isPaper ? '#353024' : '#fff'}; letter-spacing:${isPaper ? '0.02em' : '0.05em'};">${t('library.batch.modalTitle')}</span>`,
    html: `
      <div style="text-align:left; margin-bottom:16px;">
        <div style="color:${isPaper ? '#6b6251' : '#888'}; font-size:14px; line-height:1.6;">
          ${t('library.batch.modalDesc')}<br>
          <span style="color:${isPaper ? '#56693b' : '#00f3ff'}; font-weight:600;">${t('library.batch.modalLimit')}</span>
        </div>
      </div>
    `,
    input: 'textarea',
    inputPlaceholder: t('library.batch.inputPlaceholder'),
    inputAttributes: {
      style: isPaper
        ? 'background:#f6f0e1; color:#353024; border:1px solid rgba(90,78,56,0.18); border-radius:10px; padding:12px; font-family:inherit; font-size:13px; width:calc(100% - 24px); box-sizing:border-box; margin:0 auto; display:block; min-height:160px; resize:vertical; outline:none;'
        : 'background:#0a0a0a; color:#00f3ff; border:1px solid #333; border-radius:6px; padding:12px; font-family:monospace; font-size:13px; width:calc(100% - 24px); box-sizing:border-box; margin:0 auto; display:block; min-height:160px; resize:vertical; outline:none;'
    },
    showCancelButton: true,
    confirmButtonText: t('library.batch.next'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
    cancelButtonColor: isPaper ? '#efe8d8' : '#333',
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    reverseButtons: true,
    allowOutsideClick: false
  })

  if (!text) return

  const appIds = text
    .split('\n')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0 && /^\d+$/.test(s))

  if (appIds.length === 0) {
    tcToast(t('library.batch.emptyTitle'), t('library.batch.emptyDesc'), 'warning')
    return
  }

  if (appIds.length > 50) {
    tcToast(t('library.batch.tooManyTitle'), t('library.batch.tooManyDesc'), 'warning')
    return
  }

  const totalNeed = appIds.length
  const totalLeft = getQuotaLeft()

  const confirm = await Swal.fire({
    title: `<span style="font-size:18px; font-weight:700; color:${isPaper ? '#353024' : '#fff'}; letter-spacing:${isPaper ? '0.02em' : '0.05em'};">${t('library.batch.confirmTitle')}</span>`,
    html: `
      <div style="text-align:left; color:${isPaper ? '#6b6251' : '#888'}; font-size:14px; line-height:1.6; margin-bottom:16px;">
        ${t('library.batch.confirmDescPrefix')} <span style="color:${isPaper ? '#56693b' : '#00f3ff'}; font-weight:700;">${totalNeed}</span> ${t('library.batch.confirmDescSuffix')}
      </div>
      <div style="background:${isPaper ? '#f6f0e1' : '#0a0a0a'}; border:1px solid ${isPaper ? 'rgba(90,78,56,0.14)' : '#333'}; border-radius:10px; padding:16px; text-align:left;">
        <div style="color:${isPaper ? '#6b6251' : '#aaa'}; font-size:13px; margin-bottom:4px;">${t('library.batch.quotaLabel')}</div>
        <div style="color:${isPaper ? '#353024' : '#fff'}; font-size:18px; font-weight:700;">
          ${t('library.batch.quotaDeduct')} <span style="color:${isPaper ? '#56693b' : '#00f3ff'};">${totalNeed}</span> ${t('library.batch.quotaPoint')}
          <span style="color:${isPaper ? '#6b6251' : '#666'}; font-size:13px; font-weight:400;"> ${t('library.batch.quotaLeft')} <span style="color:${totalLeft >= totalNeed ? (isPaper ? '#5c7d4c' : '#00f3ff') : (isPaper ? '#ba5243' : '#ff4444')};">${totalLeft}</span> ${t('library.batch.quotaPoint')}</span>
        </div>
        <div style="color:${isPaper ? '#9b917e' : '#666'}; font-size:12px; margin-top:8px;">${t('library.batch.quotaHint')}</div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: t('library.batch.startBtn'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: isPaper ? '#667b48' : '#00f3ff',
    cancelButtonColor: isPaper ? '#efe8d8' : '#333',
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    reverseButtons: true,
    allowOutsideClick: false
  })

  if (!confirm.isConfirmed) return

  await handleBatchDeploy(appIds)
}

async function handleBatchDeploy(appIds: string[]) {
  isCancelled = false
  batchProgress.value = {
    visible: true,
    title: t('library.batch.deploying'),
    percent: 0,
    current: 0,
    total: appIds.length,
    logs: []
  }

  const detectRes = await window.electron.invoke('steam:detect')
  if (!detectRes?.path) {
    batchProgress.value.visible = false
    titanAlert(t('library.batch.blockedTitle'), t('library.steamNotFound'), 'error')
    return
  }

  const results = await libraryStore.batchDeploy(appIds, {
    onProgress: (resList) => {
      batchProgress.value.current = resList.length
      batchProgress.value.percent = Math.round((resList.length / appIds.length) * 100)
      batchProgress.value.logs = resList
    },
    isCancelled: () => isCancelled
  })

  batchProgress.value.visible = false

  if (isCancelled) {
    isCancelled = false
    return
  }

  const successCount = results.filter(r => r.success).length
  tcToast(t('library.batch.doneTitle'), `${t('library.batch.successCount')} ${successCount} / ${t('library.batch.failCount')} ${results.length - successCount}`, successCount === results.length ? 'success' : (successCount > 0 ? 'warning' : 'info'))
}

const handleRedeployAll = async () => {
  const protocols = libraryStore.items.filter(i => i.type === 'titan_protocol')
  if (protocols.length === 0) {
    titanAlert(t('library.redeploy.noProtocolTitle'), t('library.redeploy.noProtocolDesc'), 'info')
    return
  }

  const detectRes = await window.electron.invoke('steam:detect')
  if (!detectRes?.path) {
    titanAlert(t('library.batch.blockedTitle'), t('library.steamNotFound'), 'error')
    return
  }

  const totalNeed = protocols.length
  const totalLeft = getQuotaLeft()

  const isPaper = currentTheme.value === 'paper'
  const confirm = await Swal.fire({
    title: t('library.redeploy.confirmTitle'),
    html: `
      <div style="color:${isPaper ? '#6b6251' : '#888'}; font-size:14px; line-height:1.6; margin-bottom:12px;">
        ${t('library.redeploy.confirmDescPrefix')} <span style="color:${isPaper ? '#56693b' : '#fff'}; font-weight:700;">${protocols.length}</span> ${t('library.redeploy.confirmDescSuffix')}
      </div>
      <div style="background:${isPaper ? '#f6f0e1' : '#0a0a0a'}; border:1px solid ${isPaper ? 'rgba(90,78,56,0.14)' : '#333'}; border-radius:10px; padding:12px; text-align:left;">
        <div style="color:${isPaper ? '#353024' : '#fff'}; font-size:14px; font-weight:700;">
          ${t('library.batch.quotaDeduct')} <span style="color:${isPaper ? '#56693b' : '#00f3ff'};">${totalNeed}</span> ${t('library.redeploy.quotaUnit')}
          <span style="color:${isPaper ? '#6b6251' : '#666'}; font-size:12px; font-weight:400;"> ${t('library.batch.quotaLeft')} <span style="color:${totalLeft >= totalNeed ? (isPaper ? '#5c7d4c' : '#00f3ff') : (isPaper ? '#ba5243' : '#ff4444')};">${totalLeft}</span> ${t('library.batch.quotaPoint')}</span>
        </div>
        <div style="color:${isPaper ? '#9b917e' : '#666'}; font-size:12px; margin-top:6px;">${t('library.redeploy.quotaHint')}</div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('library.redeploy.confirmBtn'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#ba5243' : '#ef4444'
  })
  if (!confirm.isConfirmed) return

  isCancelled = false
  batchProgress.value = {
    visible: true,
    title: t('library.redeploy.deploying'),
    percent: 0,
    current: 0,
    total: protocols.length,
    logs: []
  }

  const results = await libraryStore.redeployAll(protocols, {
    onProgress: (resList) => {
      batchProgress.value.current = resList.length
      batchProgress.value.percent = Math.round((resList.length / protocols.length) * 100)
      batchProgress.value.logs = resList
    },
    isCancelled: () => isCancelled
  })

  batchProgress.value.visible = false

  if (isCancelled) {
    isCancelled = false
    return
  }

  const successCount = results.filter(r => r.success).length
  tcToast(t('library.redeploy.doneTitle'), `${t('library.batch.successCount')} ${successCount} / ${t('library.batch.failCount')} ${results.length - successCount}`, successCount === results.length ? 'success' : (successCount > 0 ? 'warning' : 'info'))
}

// ================= 批量管理（仅 titan_protocol tab） =================
const manageMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())
const sortMode = ref<'newest' | 'oldest' | 'name'>('newest')

// 切 tab / 改搜索词 = 跨页面，清空选中集
watch(activeFilter, () => { if (activeFilter.value !== 'titan_protocol') exitManageMode() })
watch([activeFilter, searchQuery], () => { selectedIds.value = new Set() })
watch(sortMode, (v) => { window.electron.invoke('sys:set-config', 'library_sort_mode', v).catch(() => {}) })

const enterManageMode = () => { exitSearchMode(); manageMode.value = true }
const exitManageMode = () => { manageMode.value = false; selectedIds.value = new Set() }

const toggleSelectCard = (id: string) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  selectedIds.value = next
}

const toggleSelectAllCards = () => {
  const ids = filteredList.value.map(i => i.id)
  const allSelected = ids.length > 0 && ids.every(id => selectedIds.value.has(id))
  const next = new Set(selectedIds.value)
  if (allSelected) ids.forEach(id => next.delete(id))
  else ids.forEach(id => next.add(id))
  selectedIds.value = next
}

const getSelectedProtocols = () => libraryStore.items.filter(i => selectedIds.value.has(i.id) && i.type === 'titan_protocol')

const dropSucceededFromSelection = (ids: string[]) => {
  const next = new Set(selectedIds.value)
  ids.forEach(id => next.delete(id))
  selectedIds.value = next
}

const batchRedeploy = async () => {
  const targets = getSelectedProtocols()
  if (targets.length === 0 || batchProgress.value.visible) return
  closeMenu()
  const detectRes = await window.electron.invoke('steam:detect')
  if (!detectRes?.path) {
    titanAlert(t('library.batch.blockedTitle'), t('library.steamNotFound'), 'error')
    return
  }
  const totalNeed = targets.length
  const totalLeft = getQuotaLeft()
  const isPaper = currentTheme.value === 'paper'
  const confirm = await Swal.fire({
    title: t('library.redeploy.confirmTitle'),
    html: `
      <div style="color:${isPaper ? '#6b6251' : '#888'}; font-size:14px; line-height:1.6; margin-bottom:12px;">
        ${t('library.redeploy.confirmDescPrefix')} <span style="color:${isPaper ? '#56693b' : '#fff'}; font-weight:700;">${totalNeed}</span> ${t('library.redeploy.confirmDescSuffix')}
      </div>
      <div style="background:${isPaper ? '#f6f0e1' : '#0a0a0a'}; border:1px solid ${isPaper ? 'rgba(90,78,56,0.14)' : '#333'}; border-radius:10px; padding:12px; text-align:left;">
        <div style="color:${isPaper ? '#353024' : '#fff'}; font-size:14px; font-weight:700;">
          ${t('library.batch.quotaDeduct')} <span style="color:${isPaper ? '#56693b' : '#00f3ff'};">${totalNeed}</span> ${t('library.redeploy.quotaUnit')}
          <span style="color:${isPaper ? '#6b6251' : '#666'}; font-size:12px; font-weight:400;"> ${t('library.batch.quotaLeft')} <span style="color:${totalLeft >= totalNeed ? (isPaper ? '#5c7d4c' : '#00f3ff') : (isPaper ? '#ba5243' : '#ff4444')};">${totalLeft}</span> ${t('library.batch.quotaPoint')}</span>
        </div>
        <div style="color:${isPaper ? '#9b917e' : '#666'}; font-size:12px; margin-top:6px;">${t('library.redeploy.quotaHint')}</div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('library.redeploy.confirmBtn'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#ba5243' : '#ef4444'
  })
  if (!confirm.isConfirmed) return

  isCancelled = false
  batchProgress.value = {
    visible: true,
    title: t('library.redeploy.deploying'),
    percent: 0,
    current: 0,
    total: targets.length,
    logs: []
  }
  const results = await libraryStore.redeployAll(targets, {
    onProgress: (resList) => {
      batchProgress.value.current = resList.length
      batchProgress.value.percent = Math.round((resList.length / targets.length) * 100)
      batchProgress.value.logs = resList
    },
    isCancelled: () => isCancelled
  })
  batchProgress.value.visible = false
  if (isCancelled) { isCancelled = false; return }

  const successCount = results.filter(r => r.success).length
  tcToast(t('library.redeploy.doneTitle'), `${t('library.batch.successCount')} ${successCount} / ${t('library.batch.failCount')} ${results.length - successCount}`, successCount === results.length ? 'success' : (successCount > 0 ? 'warning' : 'info'))
}

// 切换语义对齐单卡右键：选中集全部已开启 -> 批量关；否则 -> 批量开（向统一状态收敛）
const allSelectedAutoUpdateOn = computed(() => {
  const targets = getSelectedProtocols()
  return targets.length > 0 && targets.every(t => t.meta?.autoUpdate === true)
})

const batchToggleAutoUpdate = async () => {
  const targets = getSelectedProtocols()
  if (targets.length === 0) return
  const enable = !allSelectedAutoUpdateOn.value
  closeMenu()
  let ok = 0
  for (const item of targets) {
    try {
      const res = await window.electron.sys.toggleAutoUpdate(item.id, enable)
      if (res?.success) ok++
    } catch { /* 单条失败静默计数 */ }
  }
  await libraryStore.load()
  const label = enable ? t('library.contextMenu.enableUpdate') : t('library.contextMenu.disableUpdate')
  titanAlert(t(enable ? 'library.toggleDoneOn' : 'library.toggleDoneOff'), t('library.toggleDoneDesc', { ok, total: targets.length, label }), ok === targets.length ? 'success' : 'warning')
}

const formatBatchSwalHtml = (rawHtml: string) => {
  if (currentTheme.value !== 'paper') return rawHtml
  return rawHtml
    .replace(/color:#aaa/gi, 'color:#6b6251')
    .replace(/color:#fff/gi, 'color:#353024')
    .replace(/color:#00f3ff/gi, 'color:#56693b')
    .replace(/color:#ff4444/gi, 'color:#993e32')
}

const batchUninstall = async () => {
  const targets = getSelectedProtocols()
  if (targets.length === 0 || batchProgress.value.visible) return
  closeMenu()
  const isPaper = currentTheme.value === 'paper'
  const confirm = await Swal.fire({
    title: t('library.uninstallBatchTitle'),
    html: formatBatchSwalHtml(t('library.uninstallBatchHtml', { count: targets.length })),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('library.uninstallBatchConfirm'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#ba5243' : '#ef4444',
    cancelButtonColor: isPaper ? '#efe8d8' : undefined
  })
  if (!confirm.isConfirmed) return

  const detectRes = await window.electron.invoke('steam:detect')
  if (!detectRes?.path) {
    titanAlert(t('library.batch.blockedTitle'), t('library.steamNotFound'), 'error')
    return
  }
  let ok = 0
  let fail = 0
  for (const item of targets) {
    try {
      const res = await window.electron.invoke('titan:uninstall-game', detectRes.path, appIdOf(item), 'ost')
      if (res?.success) {
        await window.electron.invoke('sys:remove-user-library', item.id)
        ok++
      } else {
        fail++
      }
    } catch {
      fail++
    }
  }
  await libraryStore.load()
  void libraryStore.pushCloud()
  dropSucceededFromSelection(targets.map(i => i.id))
  titanAlert(t('library.batch.uninstallDoneTitle'), t('library.batch.statOkFail', { ok, fail }), fail > 0 ? 'warning' : 'success')
}

const batchRemoveRecords = async () => {
  const targets = libraryStore.items.filter(i => selectedIds.value.has(i.id))
  if (targets.length === 0) return
  closeMenu()
  const isPaper = currentTheme.value === 'paper'
  const confirm = await Swal.fire({
    title: t('library.removeBatchTitle'),
    html: formatBatchSwalHtml(t('library.removeBatchHtml', { count: targets.length })),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('library.removeBatchConfirm'),
    cancelButtonText: t('common.cancel'),
    background: isPaper ? '#fffdf7' : '#121212',
    color: isPaper ? '#353024' : '#fff',
    confirmButtonColor: isPaper ? '#ba5243' : '#ef4444',
    cancelButtonColor: isPaper ? '#efe8d8' : undefined
  })
  if (!confirm.isConfirmed) return

  let fail = 0
  for (const item of targets) {
    try {
      await window.electron.invoke('sys:remove-user-library', item.id)
    } catch {
      fail++
    }
  }
  await libraryStore.load()
  void libraryStore.pushCloud()
  dropSucceededFromSelection(targets.map(i => i.id))
  titanAlert(t('library.batch.removeDoneTitle'), t('library.batch.statOkFail', { ok: targets.length - fail, fail }), fail > 0 ? 'warning' : 'success')
}

let unsubLibUpdate: (() => void) | null = null

onMounted(() => {
  updateColumns()
  window.addEventListener('resize', updateColumns)
  libraryStore.load()
  window.electron.invoke('sys:get-config', 'library_sort_mode').then((savedSort: any) => {
    if (savedSort === 'newest' || savedSort === 'oldest' || savedSort === 'name') sortMode.value = savedSort
  }).catch(() => {})
  window.addEventListener('click', closeMenu)
  window.addEventListener('keydown', handleGlobalKeydown)
  unsubLibUpdate = window.electron.on('titan:library-updated', () => {
    libraryStore.load()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
  window.removeEventListener('click', closeMenu)
  window.removeEventListener('keydown', handleGlobalKeydown)
  unsubLibUpdate?.()
  isCancelled = true
})
</script>

<style scoped>
@keyframes lightSweep {
  0% { transform: translateX(-100%); opacity: 0.9; }
  100% { transform: translateX(100%); opacity: 0; }
}
.sweep-animation {
  animation: lightSweep 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@media (min-width: 3840px) {
  .grid-4k {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
</style>
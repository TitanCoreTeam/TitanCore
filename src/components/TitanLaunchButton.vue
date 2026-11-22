<template>
  <button
    type="button"
    class="titan-launch-btn"
    :class="[
      `is-${status}`,
      `theme-${resolvedTheme}`,
      { 'force-hover': forceHover }
    ]"
    :disabled="status === 'running'"
    @click.stop="handleClick"
  >
    <!-- 顶部环境高光反射层 -->
    <span class="btn-gloss"></span>

    <!-- 左侧：图标 + 主文案 -->
    <span class="btn-main">
      <svg
        v-if="status !== 'running'"
        class="play-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7 5.5v13l11-6.5-11-6.5z" />
      </svg>
      <span v-else class="running-indicator"></span>
      <span class="main-text">
        {{ displayText }}
      </span>
    </span>

    <!-- 右侧：协议/状态副标签 -->
    <span class="btn-sub">
      {{ displaySubText }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme, type ThemeName } from '../composables/useTheme'
import { t } from '../i18n'

interface Props {
  /** 按钮状态: 'ready' (默认就绪) | 'running' (运行中) */
  status?: 'ready' | 'running'
  /** 显式指定主题，未传入时自动同步全局 useTheme */
  theme?: ThemeName
  /** 仅用于UI展板调试或父卡片联动：强制锁定 Hover 亮起效果 */
  forceHover?: boolean
  /** 自定义主标题文案（覆盖默认） */
  text?: string
  /** 自定义副标签文案（覆盖默认） */
  subText?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'ready',
  forceHover: false
})

const emit = defineEmits<{
  (e: 'launch'): void
}>()

const { currentTheme } = useTheme()

// 映射为 titan / minimal / anime / paper 四大核心主题体系
const resolvedTheme = computed(() => {
  if (props.theme) {
    if (props.theme === 'paper') return 'paper'
    if (props.theme === 'anime' || props.theme === 'pink') return 'anime'
    if (props.theme === 'minimal') return 'minimal'
    return 'titan'
  }
  const theme = currentTheme.value
  if (theme === 'paper') return 'paper'
  if (theme === 'anime' || theme === 'pink') return 'anime'
  if (theme === 'minimal') return 'minimal'
  return 'titan'
})

const displayText = computed(() => {
  if (props.text) return props.text
  if (props.status === 'running') {
    return t('library.launch.inGame') || '游戏中'
  }
  return t('library.launch.launchGame') || '启动游戏'
})

const displaySubText = computed(() => {
  if (props.subText) return props.subText
  return props.status === 'running' ? 'RUNNING' : 'READY'
})

const handleClick = () => {
  if (props.status === 'running') return
  emit('launch')
}
</script>

<style scoped>
/* ==========================================================
   基础骨架与工业级物理过渡 (严格按规范 Round corner: 6px)
   ========================================================== */
.titan-launch-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  outline: none;
  font-family: 'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  transition: 
    background 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.1s ease;
  backdrop-filter: blur(8px);
}

/* 顶部微弱玻璃高光带 */
.btn-gloss {
  position: absolute;
  top: 0;
  left: 6%;
  right: 6%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 0.22s ease;
}

/* 左侧主视觉区 (▶ 启动游戏) */
.btn-main {
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
  min-width: 0;
}

.play-icon {
  width: 13.5px;
  height: 13.5px;
  flex-shrink: 0;
  transition: all 0.22s ease;
}

.main-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.22s ease;
}

/* 右侧副标签区 (READY / RUNNING) - 战术仪表等宽字阶 */
.btn-sub {
  z-index: 1;
  font-family: 'JetBrains Mono', 'Rajdhani', 'Consolas', monospace;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  flex-shrink: 0;
  margin-left: 6px;
  transition: all 0.22s ease;
}

/* 点击下压物理反馈 (阻尼回弹) */
.titan-launch-btn.is-ready:active {
  transform: scale(0.982);
}

/* 运行中呼吸指示点 */
.running-indicator {
  width: 6.5px;
  height: 6.5px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: titan-pulse 1.6s infinite ease-in-out;
}

@keyframes titan-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.82); }
}

/* ==========================================================
   主题一：TITAN (赛博工业 / 经典电光青)
   ========================================================== */
.titan-launch-btn.theme-titan {
  /* 常规/未悬停状态 (idle) */
  background: linear-gradient(180deg, rgba(14, 38, 46, 0.88) 0%, rgba(8, 22, 28, 0.96) 100%);
  border: 1px solid rgba(0, 216, 214, 0.35);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 0 10px rgba(0, 216, 214, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.6);
}

.titan-launch-btn.theme-titan .play-icon {
  color: #20e3e3;
  filter: drop-shadow(0 0 4px rgba(32, 227, 227, 0.4));
}

.titan-launch-btn.theme-titan .main-text {
  color: #2ce0e0;
  text-shadow: 0 0 8px rgba(44, 224, 224, 0.25);
}

.titan-launch-btn.theme-titan .btn-sub {
  color: rgba(44, 224, 224, 0.7);
}

/* Titan: 悬停/就绪状态 (hover) */
.titan-launch-btn.theme-titan.is-ready:hover,
.titan-launch-btn.theme-titan.is-ready.force-hover {
  background: linear-gradient(90deg, #00d8d6 0%, #0097e6 55%, #0052d4 100%);
  border-color: #7ef9ff;
  box-shadow: 
    0 0 16px rgba(0, 216, 214, 0.55),
    0 0 4px rgba(126, 249, 255, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    inset 0 -1px 2px rgba(0, 30, 80, 0.5);
}

.titan-launch-btn.theme-titan.is-ready:hover .btn-gloss,
.titan-launch-btn.theme-titan.is-ready.force-hover .btn-gloss {
  opacity: 0.95;
}

.titan-launch-btn.theme-titan.is-ready:hover .play-icon,
.titan-launch-btn.theme-titan.is-ready.force-hover .play-icon {
  color: #ffffff;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
  transform: translateX(1px);
}

.titan-launch-btn.theme-titan.is-ready:hover .main-text,
.titan-launch-btn.theme-titan.is-ready.force-hover .main-text {
  color: #ffffff;
  text-shadow: 0 1px 6px rgba(0, 40, 80, 0.65), 0 0 10px rgba(255, 255, 255, 0.5);
}

.titan-launch-btn.theme-titan.is-ready:hover .btn-sub,
.titan-launch-btn.theme-titan.is-ready.force-hover .btn-sub {
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 4px rgba(0, 30, 70, 0.6);
}

.titan-launch-btn.theme-titan.is-ready:active {
  box-shadow: 
    0 0 10px rgba(0, 216, 214, 0.4),
    inset 0 2px 4px rgba(0, 0, 0, 0.35);
}

/* Titan: 运行中状态 (running) */
.titan-launch-btn.theme-titan.is-running {
  cursor: default;
  background: linear-gradient(90deg, #88b01b 0%, #3d8b37 58%, #195427 100%);
  border-color: #b8e944;
  box-shadow: 
    0 0 14px rgba(136, 176, 27, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.45);
}

.titan-launch-btn.theme-titan.is-running .main-text {
  color: #f4ff81;
  text-shadow: 0 1px 4px rgba(0, 30, 0, 0.6), 0 0 8px rgba(244, 255, 129, 0.35);
}

.titan-launch-btn.theme-titan.is-running .btn-sub {
  color: #a5d6a7;
  text-shadow: 0 1px 2px rgba(0, 20, 0, 0.5);
}

.titan-launch-btn.theme-titan.is-running .running-indicator {
  background-color: #f4ff81;
  box-shadow: 0 0 6px #f4ff81;
}

/* ==========================================================
   主题二：MINIMAL / TECH (深空黑曜钛银 · 极简空间流体胶囊)
   ========================================================== */
.titan-launch-btn.theme-minimal {
  /* 常规/未悬停状态 (idle) - 深空半透钛银玻璃 */
  border-radius: 9999px;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.78) 100%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    inset 0 1px 0.5px rgba(255, 255, 255, 0.38),
    0 6px 18px rgba(0, 0, 0, 0.55);
}

.titan-launch-btn.theme-minimal .play-icon {
  color: #e2e8f0;
  filter: none;
}

.titan-launch-btn.theme-minimal .main-text {
  color: #f8fafc;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.55);
}

.titan-launch-btn.theme-minimal .btn-sub {
  color: rgba(186, 230, 253, 0.78);
}

/* Minimal: 悬停/就绪状态 (hover) - 液态冷银高光实体 */
.titan-launch-btn.theme-minimal.is-ready:hover,
.titan-launch-btn.theme-minimal.is-ready.force-hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(200, 230, 255, 0.92) 100%);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: 
    0 10px 24px rgba(0, 0, 0, 0.5),
    0 0 14px rgba(186, 230, 253, 0.28),
    inset 0 1px 0.5px rgba(255, 255, 255, 0.95);
}

.titan-launch-btn.theme-minimal.is-ready:hover .btn-gloss,
.titan-launch-btn.theme-minimal.is-ready.force-hover .btn-gloss {
  opacity: 0.5;
}

.titan-launch-btn.theme-minimal.is-ready:hover .play-icon,
.titan-launch-btn.theme-minimal.is-ready.force-hover .play-icon {
  color: #050811;
  filter: none;
  transform: translateX(1px);
}

.titan-launch-btn.theme-minimal.is-ready:hover .main-text,
.titan-launch-btn.theme-minimal.is-ready.force-hover .main-text {
  color: #050811;
  text-shadow: none;
}

.titan-launch-btn.theme-minimal.is-ready:hover .btn-sub,
.titan-launch-btn.theme-minimal.is-ready.force-hover .btn-sub {
  color: rgba(5, 8, 17, 0.75);
  text-shadow: none;
}

.titan-launch-btn.theme-minimal.is-ready:active {
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.45),
    inset 0 2px 4px rgba(0, 0, 0, 0.25);
}

/* Minimal: 运行中状态 (running) */
.titan-launch-btn.theme-minimal.is-running {
  cursor: default;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.55) 0%, rgba(5, 150, 105, 0.62) 100%);
  border-color: rgba(110, 231, 183, 0.6);
  box-shadow: 
    0 0 16px rgba(52, 211, 153, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.52);
}

.titan-launch-btn.theme-minimal.is-running .main-text {
  color: #ecfdf5;
  text-shadow: 0 1px 4px rgba(0, 30, 20, 0.5);
}

.titan-launch-btn.theme-minimal.is-running .btn-sub {
  color: #a7f3d0;
  text-shadow: 0 1px 2px rgba(0, 20, 10, 0.45);
}

.titan-launch-btn.theme-minimal.is-running .running-indicator {
  background-color: #34d399;
  box-shadow: 0 0 6px #34d399;
}

/* ==========================================================
   主题三：ANIME (初樱奶冻 / 草莓牛奶果冻圆润胶囊)
   ========================================================== */
.titan-launch-btn.theme-anime {
  /* 常规/未悬停状态 (idle) - 草莓牛奶果冻胶囊质感 */
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 250, 252, 0.96) 0%, rgba(255, 232, 242, 0.98) 100%);
  border: 1.5px solid rgba(255, 182, 211, 0.75);
  box-shadow: 
    inset 0 1.5px 0 rgba(255, 255, 255, 0.98),
    0 4px 12px rgba(255, 133, 179, 0.22);
}

.titan-launch-btn.theme-anime .play-icon {
  color: #c24b78;
  filter: drop-shadow(0 0 4px rgba(194, 75, 120, 0.3));
}

.titan-launch-btn.theme-anime .main-text {
  color: #be3b6f;
  text-shadow: 0 0 6px rgba(190, 59, 111, 0.15);
}

.titan-launch-btn.theme-anime .btn-sub {
  color: rgba(190, 59, 111, 0.75);
}

/* Anime: 悬停/就绪状态 (hover) */
.titan-launch-btn.theme-anime.is-ready:hover,
.titan-launch-btn.theme-anime.is-ready.force-hover {
  background: linear-gradient(90deg, #f472b6 0%, #fb7185 55%, #ec4899 100%);
  border-color: #fbcfe8;
  box-shadow: 
    0 0 16px rgba(244, 114, 182, 0.6),
    0 0 6px rgba(251, 113, 133, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.65),
    inset 0 -1px 2px rgba(131, 24, 67, 0.4);
}

.titan-launch-btn.theme-anime.is-ready:hover .btn-gloss,
.titan-launch-btn.theme-anime.is-ready.force-hover .btn-gloss {
  opacity: 0.95;
}

.titan-launch-btn.theme-anime.is-ready:hover .play-icon,
.titan-launch-btn.theme-anime.is-ready.force-hover .play-icon {
  color: #ffffff;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.95));
  transform: translateX(1px);
}

.titan-launch-btn.theme-anime.is-ready:hover .main-text,
.titan-launch-btn.theme-anime.is-ready.force-hover .main-text {
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(80, 7, 36, 0.6), 0 0 8px rgba(255, 255, 255, 0.5);
}

.titan-launch-btn.theme-anime.is-ready:hover .btn-sub,
.titan-launch-btn.theme-anime.is-ready.force-hover .btn-sub {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 3px rgba(80, 7, 36, 0.5);
}

.titan-launch-btn.theme-anime.is-ready:active {
  box-shadow: 
    0 0 10px rgba(244, 114, 182, 0.4),
    inset 0 2px 4px rgba(157, 23, 77, 0.25);
}

/* Anime: 运行中状态 (running) */
.titan-launch-btn.theme-anime.is-running {
  cursor: default;
  background: linear-gradient(90deg, #10b981 0%, #059669 55%, #047857 100%);
  border-color: #6ee7b7;
  box-shadow: 
    0 0 14px rgba(16, 185, 129, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.titan-launch-btn.theme-anime.is-running .main-text {
  color: #d1fae5;
  text-shadow: 0 1px 4px rgba(6, 78, 59, 0.6), 0 0 8px rgba(209, 250, 229, 0.35);
}

.titan-launch-btn.theme-anime.is-running .btn-sub {
  color: #a7f3d0;
  text-shadow: 0 1px 2px rgba(6, 78, 59, 0.5);
}

.titan-launch-btn.theme-anime.is-running .running-indicator {
  background-color: #34d399;
  box-shadow: 0 0 6px #34d399;
}

/* ==========================================================
   4. Paper 纸境主题样式 (吉卜力暖阳米黄 + 苔藓草木绿水彩质感)
   ========================================================== */
.titan-launch-btn.theme-paper {
  background: rgba(255, 253, 247, 0.96);
  border: 1px solid rgba(90, 78, 56, 0.18);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(62, 54, 38, 0.12);
}
.titan-launch-btn.theme-paper .play-icon,
.titan-launch-btn.theme-paper .main-text {
  color: #353024;
  font-weight: 600;
}
.titan-launch-btn.theme-paper .btn-sub {
  color: #6B6251;
  font-weight: 600;
}
.titan-launch-btn.theme-paper.is-ready:hover,
.titan-launch-btn.theme-paper.is-ready.force-hover {
  background: #667B48;
  border-color: #56693B;
  box-shadow: 0 4px 12px rgba(102, 123, 72, 0.26);
}
.titan-launch-btn.theme-paper.is-ready:hover .play-icon,
.titan-launch-btn.theme-paper.is-ready:hover .main-text,
.titan-launch-btn.theme-paper.is-ready:hover .btn-sub,
.titan-launch-btn.theme-paper.is-ready.force-hover .play-icon,
.titan-launch-btn.theme-paper.is-ready.force-hover .main-text,
.titan-launch-btn.theme-paper.is-ready.force-hover .btn-sub {
  color: #FFFDF7;
}
.titan-launch-btn.theme-paper.is-running {
  cursor: default;
  background: #5C7D4C;
  border-color: #4D6A3F;
}
.titan-launch-btn.theme-paper.is-running .main-text,
.titan-launch-btn.theme-paper.is-running .btn-sub {
  color: #FFFDF7;
}
.titan-launch-btn.theme-paper.is-running .running-indicator {
  background-color: #EEF4E8;
}

/* ==========================================================
   多分辨率多尺寸显示器自适应规则 (Micro-Responsive)
   ========================================================== */
@media (max-width: 1366px) {
  .titan-launch-btn {
    height: 34px;
    padding: 0 10px;
  }
  .main-text {
    font-size: 12px;
  }
  .btn-sub {
    font-size: 9.5px;
    letter-spacing: 0.5px;
  }
}
</style>

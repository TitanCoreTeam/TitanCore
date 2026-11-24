import { ref, watch } from 'vue'

export type ThemeName = 'titan' | 'minimal' | 'anime' | 'paper' | 'warning' | 'pink'

const currentTheme = ref<ThemeName>('titan')

const THEME_BG_MAP: Record<ThemeName, string> = {
  titan: '#000000',
  minimal: '#04060b',
  anime: '#fff6fa',
  paper: '#f4efe2',
  warning: '#000000',
  pink: '#000000'
}

const syncWindowBackground = (theme: ThemeName) => {
  const bg = THEME_BG_MAP[theme] || '#000000'
  window.electron?.invoke?.('sys:set-window-bg', bg).catch(() => {})
}

watch(currentTheme, (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  syncWindowBackground(theme)
}, { immediate: true })

export function setTheme(name: ThemeName) {
  currentTheme.value = name
  document.documentElement.setAttribute('data-theme', name)
  localStorage.setItem('titan-theme', name)
  syncWindowBackground(name)
}

export function initTheme() {
  const saved = localStorage.getItem('titan-theme') as ThemeName | null
  if (saved && ['titan', 'minimal', 'anime', 'paper', 'warning', 'pink'].includes(saved)) {
    setTheme(saved)
  } else {
    setTheme('titan')
  }
}

export function useTheme() {
  return {
    currentTheme,
    setTheme,
    initTheme
  }
}

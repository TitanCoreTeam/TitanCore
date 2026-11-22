import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const CORES_STORAGE_KEY = 'tc_arcade_game_cores_v1';

function loadGameCores(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CORES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const out: Record<string, number> = {};
        for (const [k, v] of Object.entries(parsed)) {
          const n = Math.max(0, Math.floor(Number(v) || 0));
          if (n > 0) out[k] = n;
        }
        return out;
      }
    }
  } catch {}
  return {};
}

function saveGameCores(map: Record<string, number>): void {
  try {
    localStorage.setItem(CORES_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export const usePlayerStore = defineStore('arcadePlayer', () => {
  const scrap = ref(0);
  const gameCores = ref<Record<string, number>>(loadGameCores());
  const cores = computed(() => Object.values(gameCores.value).reduce((sum, n) => sum + n, 0));
  const totalPlayTime = ref(0); // 分钟，由主进程扫描 playtime.json 累加

  function getGameCores(gameId: string): number {
    return Math.max(0, gameCores.value[gameId] || 0);
  }

  function addGameCores(gameId: string, delta: number): void {
    const n = Math.floor(Number(delta) || 0);
    if (!gameId || n <= 0) return;
    const next = { ...gameCores.value, [gameId]: (gameCores.value[gameId] || 0) + n };
    gameCores.value = next;
    saveGameCores(next);
  }

  function consumeGameCores(gameId: string, delta: number): void {
    const n = Math.floor(Number(delta) || 0);
    if (!gameId || n <= 0) return;
    const cur = gameCores.value[gameId] || 0;
    const nextVal = Math.max(0, cur - n);
    const next = { ...gameCores.value };
    if (nextVal > 0) next[gameId] = nextVal;
    else delete next[gameId];
    gameCores.value = next;
    saveGameCores(next);
  }

  function $reset() {
    scrap.value = 0;
    gameCores.value = {};
    saveGameCores({});
    totalPlayTime.value = 0;
  }

  return { scrap, cores, gameCores, totalPlayTime, getGameCores, addGameCores, consumeGameCores, $reset };
});
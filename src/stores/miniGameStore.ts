/**
 * MiniGameStore - Pinia Store
 * 
 * 职责:
 *   1. 跨组件共享 session 积分
 *   2. 每日清空 totalScore（委托 MiniGameService）
 *   3. claim 结算时写入 playerStore.cores
 *   4. 代理存档方法
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlayerStore } from './playerStore'
import * as MiniGameService from '../main/services/miniGameService'

export const useMiniGameStore = defineStore('miniGame', () => {
  // ===== State =====
  const sessionScore = ref(0)
  const scoreRecord = ref(MiniGameService.checkDailyReset())

  // ===== Getters =====
  const totalScore = computed(() => scoreRecord.value.totalScore)
  const lastDate = computed(() => scoreRecord.value.lastDate)
  const isNewDay = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return scoreRecord.value.lastDate !== today
  })

  // ===== Actions =====

  /** 启动时调用：检查每日清空 */
  function init() {
    scoreRecord.value = MiniGameService.checkDailyReset()
  }

  /** 扣减当前 session 积分（如游戏内直兑） */
  function consumeSessionScore(delta: number) {
    if (delta <= 0) return
    sessionScore.value = Math.max(0, sessionScore.value - delta)
  }

  /** 游戏内实时累加积分（仅内存，不持久化；传入负数时安全扣减） */
  function addSessionScore(delta: number) {
    if (delta < 0) {
      consumeSessionScore(-delta)
      return
    }
    if (delta === 0) return
    sessionScore.value += delta
  }

  /** 读取当前 session 积分 */
  function getSessionScore(): number {
    return sessionScore.value
  }

  /** 手动清空 session（如游戏内放弃） */
  function resetSession() {
    sessionScore.value = 0
    MiniGameService.resetSessionScore()
  }

  /**
   * 结算：
   *   - 使用统一响应式的 sessionScore（10000:1）换算 CORE
   *   - 仅写入指定游戏的 playerStore.addGameCores（消除双倍叠加与脱节）
   *   - 同步刷新本地 totalScore 缓存
   */
  function claim(targetGameId?: string) {
    const score = sessionScore.value
    if (score <= 0) {
      return { cores: 0, scoreConsumed: 0 }
    }
    const cores = Math.floor(score / 10000)
    // 通过 MiniGameService 累加今日统计并清空底层缓存
    MiniGameService.resetSessionScore()
    MiniGameService.addSessionScore(score)
    MiniGameService.claim()
    sessionScore.value = 0

    if (cores > 0 && targetGameId) {
      const player = usePlayerStore()
      player.addGameCores(targetGameId, cores)
    }
    scoreRecord.value = MiniGameService.checkDailyReset()
    return { cores, scoreConsumed: score }
  }

  // ===== 存档代理 =====

  function save(gameId: string, data: any) {
    MiniGameService.save(gameId, data)
  }

  function load(gameId: string): any {
    return MiniGameService.load(gameId)
  }

  function deleteSave(gameId: string) {
    MiniGameService.deleteSave(gameId)
  }

  function clearAll() {
    MiniGameService.clearAll()
  }

  return {
    // state
    sessionScore,
    // getters
    totalScore,
    lastDate,
    isNewDay,
    // actions
    init,
    addSessionScore,
    consumeSessionScore,
    getSessionScore,
    resetSession,
    claim,
    save,
    load,
    deleteSave,
    clearAll
  }
})

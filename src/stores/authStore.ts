// 文件名: src/stores/authStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

let _titanUnsubscribers: (() => void)[] = []

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    _titanUnsubscribers.forEach(unsub => { try { unsub() } catch {} })
    _titanUnsubscribers = []
  })
}

export const useAuthStore = defineStore('auth', () => {
  const isConnected = ref(false)
  const selectedNode = ref('node1')
  const isProcessing = ref(false)
  const connectionError = ref<string | null>(null)
  const user = ref<any>(null)
  const isVaultAuthorized = ref(false)
  const endpoints = ref<Record<string, string>>({})
  const sidebar = ref<any[]>([])
  const appConfig = ref<any>(null)
  const dailyQuota = ref({ used: 0, limit: 0, remaining: 0, extraRemaining: 0 })
  const minigameRewards = ref<{
    maxPerGame: number
    games: Record<string, number>
    badab: { claimed: boolean; route?: string; claimedAt?: string }
  }>({ maxPerGame: 3, games: {}, badab: { claimed: false } })
  
  const nodeList = [
    { id: 'node1', label: 'auth.NODE_1' },
    { id: 'node2', label: 'auth.NODE_2' },
    { id: 'node3', label: 'auth.NODE_3' }
  ]

  const isVip = computed(() => user.value?.isVip ?? false)
  const isLoggedIn = computed(() => !!user.value)

  if (window.electron?.on && _titanUnsubscribers.length === 0) {
    _titanUnsubscribers.push(
      window.electron.on('auth:status', (d: any) => {
        isConnected.value = d?.isConnected ?? false
        if (d?.selectedNode) selectedNode.value = d.selectedNode
        connectionError.value = d?.error || null
        isProcessing.value = false
      })
    )

    _titanUnsubscribers.push(
      window.electron.on('sys:heartbeat-failed', (data: any) => {
        console.warn('[AuthStore] 心跳断线，token 可能已过期:', data)
      })
    )

    _titanUnsubscribers.push(
      window.electron.on('sys:heartbeat-recovered', () => {
        console.log('[AuthStore] 心跳恢复')
      })
    )

    _titanUnsubscribers.push(window.electron.on('auth:login-success', () => { isProcessing.value = false }))
    
    const resetState = () => {
        user.value = null
        endpoints.value = {}
        sidebar.value = []
        appConfig.value = null
        dailyQuota.value = { used: 0, limit: 0, remaining: 0, extraRemaining: 0 }
        minigameRewards.value = { maxPerGame: 3, games: {}, badab: { claimed: false } }
        isVaultAuthorized.value = false
        isProcessing.value = false
    }

    _titanUnsubscribers.push(window.electron.on('auth:session-invalid', resetState))
    _titanUnsubscribers.push(window.electron.on('auth:ready-guest', () => { isProcessing.value = false }))
    _titanUnsubscribers.push(window.electron.on('auth:logout-success', resetState))

    _titanUnsubscribers.push(
      window.electron.on('auth:update-quota', (q: any) => {
        if (q) {
          if (q.limit !== undefined) dailyQuota.value.limit = q.limit
          const nextUsed = q.current ?? q.used
          if (nextUsed !== undefined) dailyQuota.value.used = nextUsed
          if (q.remaining !== undefined) {
            dailyQuota.value.remaining = q.remaining
          } else if (q.limit !== undefined) {
            dailyQuota.value.remaining = Math.max(0, q.limit - dailyQuota.value.used)
          }
          dailyQuota.value.extraRemaining = q.extraRemaining ?? q.extra_remaining ?? dailyQuota.value.extraRemaining
        }
      })
    )

    _titanUnsubscribers.push(
      window.electron.on('auth:bootstrap', (d: any) => {
        if (d?.endpoints) endpoints.value = d.endpoints
        if (d?.sidebar) sidebar.value = d.sidebar
        if (d?.appConfig) appConfig.value = d.appConfig
        if (d?.minigameRewards) {
          minigameRewards.value = {
            maxPerGame: Number(d.minigameRewards.max_per_game) || 3,
            games: { ...(d.minigameRewards.games || {}) },
            badab: {
              claimed: !!d.minigameRewards.badab?.claimed,
              route: d.minigameRewards.badab?.route,
              claimedAt: d.minigameRewards.badab?.claimed_at
            }
          }
        }
        if (d?.userProfile) {
          const up = d.userProfile
          const q = d.quotaInfo || up.dailyQuota || {}
          user.value = {
            id: up.id,
            username: up.username,
            email: up.email || '',
            avatarUrl: up.avatarUrl || up.avatar || '',
            hbits: up.hbits || 0,
            groupIds: up.groupIds || [],
            mainGroup: up.mainGroup || up.level_label || 'Free',
            vipLevel: up.vipLevel || up.level_id || 0,
            isVip: up.isVip ?? (up.vipLevel || up.level_id || 0) > 0,
            vipExpireDate: up.vipExpireDate || up.expire_date || null,
            cores: up.cores || ((up.vipLevel || up.level_id || 0) > 1 ? 4 : 1)
          }
          dailyQuota.value = {
            used: q.used || 0,
            limit: q.limit || 0,
            remaining: q.remaining || 0,
            extraRemaining: q.extra_remaining || q.extraRemaining || 0
          }
        }
      })
    )
  }

  const connect = async (id: string, emergencyKey?: string) => {
    if (isProcessing.value) return
    isProcessing.value = true
    connectionError.value = null
    let res: any = null
    try { res = await window.electron.invoke('auth:connect', id, emergencyKey) } 
    catch (e: any) { connectionError.value = e.message || 'ERR_NODE_CONNECT_FAIL'; isProcessing.value = false; return null }
    if (res && res.success === false) isProcessing.value = false
    return res
  }

  const disconnect = async () => {
    if (isProcessing.value) return
    isProcessing.value = true
    try { await window.electron.invoke('auth:disconnect') } 
    catch { isProcessing.value = false }
  }

  const login = async (id: string, pass: string) => {
    if (isProcessing.value) return 'ERR_AUTH_PROCESSING'
    isProcessing.value = true
    try {
      const r = await window.electron.invoke('auth:login', id, pass)
      if (!r?.success) return r?.msg || 'ERR_LOGIN_FAILED'
      return null
    } catch (e: any) { return e.message || 'ERR_NETWORK_ERROR' } 
    finally { isProcessing.value = false }
  }

  const register = async (username: string, email: string, password: string) => {
    if (isProcessing.value) return 'ERR_AUTH_PROCESSING'
    isProcessing.value = true
    try {
      const r = await window.electron.invoke('auth:register', username, email, password)
      if (!r?.success) return r?.msg || 'ERR_REGISTER_FAILED'
      return null
    } catch (e: any) { return e.message || 'ERR_NETWORK_ERROR' } 
    finally { isProcessing.value = false }
  }

  const logout = async () => {
    if (isProcessing.value) return
    isProcessing.value = true
    try { await window.electron.invoke('auth:logout') } 
    catch { isProcessing.value = false }
  }

  const forgotSearch = async (u: string, e: string) => {
    if (isProcessing.value) return { ok: false, msg: 'ERR_AUTH_PROCESSING' }
    isProcessing.value = true
    try { return await window.electron.invoke('auth:forgot-search', u, e) } 
    catch (err: any) { return { ok: false, msg: err.message || 'ERR_NETWORK_ERROR' } } 
    finally { isProcessing.value = false }
  }

  const forgotReset = async (uid: number, p: string, e: string) => {
    if (isProcessing.value) return { ok: false, msg: 'ERR_AUTH_PROCESSING' }
    isProcessing.value = true
    try { return await window.electron.invoke('auth:forgot-reset', uid, p, e) } 
    catch (err: any) { return { ok: false, msg: err.message || 'ERR_NETWORK_ERROR' } } 
    finally { isProcessing.value = false }
  }

  const redeem = async (card: string, contact: string) => {
    if (isProcessing.value) return { success: false, msg: 'ERR_AUTH_PROCESSING' }
    isProcessing.value = true
    try { return await window.electron.invoke('auth:redeem', card, contact) } 
    catch (e: any) { return { success: false, msg: e.message || 'ERR_REDEEM_EXCEPTION' } } 
    finally { isProcessing.value = false }
  }

  const getGameRedeemedCount = (gameId: string) => {
    return Math.max(0, Number(minigameRewards.value.games[gameId] || 0))
  }

  const markGameRedeemed = (gameId: string, totalCount: number) => {
    minigameRewards.value = {
      ...minigameRewards.value,
      games: {
        ...minigameRewards.value.games,
        [gameId]: Math.max(0, Math.floor(totalCount))
      }
    }
  }

  const markBadabClaimed = (route?: string, claimedAt?: string) => {
    minigameRewards.value = {
      ...minigameRewards.value,
      badab: {
        claimed: true,
        route: route || minigameRewards.value.badab.route,
        claimedAt: claimedAt || minigameRewards.value.badab.claimedAt
      }
    }
  }

  return { isConnected, selectedNode, isProcessing, connectionError, nodeList, user, isVip, isLoggedIn, isVaultAuthorized, endpoints, sidebar, appConfig, dailyQuota, minigameRewards, getGameRedeemedCount, markGameRedeemed, markBadabClaimed, connect, disconnect, login, register, logout, forgotSearch, forgotReset, redeem }
})
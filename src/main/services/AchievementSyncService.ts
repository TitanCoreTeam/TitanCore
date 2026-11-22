import fs from 'node:fs'
import path from 'node:path'
import { Db } from '../db'
import { titanFetch } from '../TitanNet'
import { ModeSwitchService } from './ModeSwitchService'

export interface UpstreamAchievementItem {
  internal_name: string
  localized_name: string
  localized_desc: string
  icon: string
  icon_gray: string
  hidden: boolean
  internal_key: number
}

interface AchievementSchemaApiResponse {
  code?: number
  appid?: number
  base_appid?: number
  app_type?: string
  schema_version?: number
  achievements?: UpstreamAchievementItem[]
}

const NEGATIVE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 8000

/**
 * 纯本地成就定义同步服务（按需从握手节点代拉 + 本地编译 Binary VDF）。
 * 无论经典模式还是纯净模式，统一收口到 ModeSwitchService.ostDir\achievements\。
 */
export class AchievementSyncService {
  private static inflight = new Map<string, Promise<boolean>>()
  private static batchVipDenied = false

  static getAchievementsDir(): string {
    return path.join(ModeSwitchService.ostDir, 'achievements')
  }

  static getSchemaPath(appId: string): string {
    return path.join(this.getAchievementsDir(), `${appId}.bin`)
  }

  private static getNoneMarkerPath(appId: string): string {
    return path.join(this.getAchievementsDir(), `${appId}.none`)
  }

  /**
   * 过滤并归一化为游戏本体 AppID；若明确识别为 DLC/音乐集/演示版且无独立目标则跳过。
   */
  static resolveBaseGameAppId(rawAppId: string): string | null {
    const clean = String(rawAppId || '').replace(/^steam_gate_/i, '').trim()
    if (!/^[1-9]\d{0,9}$/.test(clean)) {
      return null
    }

    try {
      const row = Db.query<any>(
        'SELECT meta_json FROM titan_resources WHERE id = ? OR id = ? LIMIT 1',
        [`steam_gate_${clean}`, clean]
      )[0]
      if (row?.meta_json) {
        const meta = JSON.parse(row.meta_json)
        const appType = String(meta?.app_type || meta?.type || '').toLowerCase()
        if (appType === 'dlc' || appType === 'music' || appType === 'soundtrack' || appType === 'video') {
          const parentId = String(meta?.parent_appid || meta?.fullgame_appid || meta?.base_appid || '').trim()
          if (/^[1-9]\d{0,9}$/.test(parentId) && parentId !== clean) {
            return parentId
          }
          return null
        }
      }
    } catch {
      // 本地库未命中或 meta 异常时不阻断，交由后端兜底判定
    }

    return clean
  }

  private static getLocalGameTitle(appId: string): string {
    try {
      const row = Db.query<any>(
        'SELECT title FROM titan_resources WHERE id = ? OR id = ? LIMIT 1',
        [`steam_gate_${appId}`, appId]
      )[0]
      if (typeof row?.title === 'string' && row.title.trim()) {
        return row.title.trim()
      }
    } catch {}
    return `App ${appId}`
  }

  /**
   * 按 Steam 客户端 UserGameStatsSchema_<appid>.bin 格式构建标准 Binary VDF。
   */
  static buildUserGameStatsSchemaVdf(
    appId: string,
    gameName: string,
    schemaVersion: number,
    achievements: UpstreamAchievementItem[]
  ): Buffer {
    const chunks: Buffer[] = []
    const pushStr = (s: string) => {
      chunks.push(Buffer.from(s, 'utf-8'))
      chunks.push(Buffer.from([0]))
    }
    const pushMapBegin = (key: string) => {
      chunks.push(Buffer.from([0x00]))
      pushStr(key)
    }
    const pushMapEnd = () => {
      chunks.push(Buffer.from([0x08]))
    }
    const pushKvStr = (key: string, val: string) => {
      chunks.push(Buffer.from([0x01]))
      pushStr(key)
      pushStr(val)
    }
    const pushKvInt32 = (key: string, val: number) => {
      chunks.push(Buffer.from([0x02]))
      pushStr(key)
      const b = Buffer.allocUnsafe(4)
      b.writeInt32LE(val | 0, 0)
      chunks.push(b)
    }

    // 按 stat_id = internal_key >> 8 分组，每组下按 bit_id = internal_key & 0xff 排列
    const grouped = new Map<number, Array<{ bitId: number; item: UpstreamAchievementItem }>>()
    for (const item of achievements) {
      if (!item?.internal_name || typeof item.internal_key !== 'number') continue
      const statId = item.internal_key >>> 8
      const bitId = item.internal_key & 0xff
      if (statId < 0 || statId > 0xffff || bitId < 0 || bitId >= 32) continue
      let list = grouped.get(statId)
      if (!list) {
        list = []
        grouped.set(statId, list)
      }
      list.push({ bitId, item })
    }

    pushMapBegin(appId)
    pushMapBegin('stats')

    const sortedStatIds = Array.from(grouped.keys()).sort((a, b) => a - b)
    for (const statId of sortedStatIds) {
      const entries = grouped.get(statId)!.sort((a, b) => a.bitId - b.bitId)
      pushMapBegin(String(statId))
      pushKvStr('type', 'ACHIEVEMENTS')
      pushMapBegin('bits')

      for (const { bitId, item } of entries) {
        const title = item.localized_name || item.internal_name
        const desc = item.localized_desc || ''
        pushMapBegin(String(bitId))
        pushKvStr('name', item.internal_name)
        pushMapBegin('display')

        pushMapBegin('name')
        pushKvStr('schinese', title)
        pushKvStr('english', title)
        pushKvStr('token', `NEW_ACHIEVEMENT_${statId}_${bitId}_NAME`)
        pushMapEnd()

        pushMapBegin('desc')
        pushKvStr('schinese', desc)
        pushKvStr('english', desc)
        pushKvStr('token', `NEW_ACHIEVEMENT_${statId}_${bitId}_DESC`)
        pushMapEnd()

        pushKvInt32('hidden', item.hidden ? 1 : 0)
        if (item.icon) pushKvStr('icon', item.icon)
        if (item.icon_gray) pushKvStr('icon_gray', item.icon_gray)

        pushMapEnd() // display
        pushMapEnd() // bitId
      }

      pushMapEnd() // bits
      pushMapEnd() // statId
    }

    pushMapEnd() // stats
    pushKvInt32('version', schemaVersion > 0 ? schemaVersion : 1)
    pushKvStr('gamename', gameName)
    pushMapEnd() // appId
    pushMapEnd() // root sentinel

    return Buffer.concat(chunks)
  }

  private static writeFileAtomic(destPath: string, data: Buffer | string): void {
    const dir = path.dirname(destPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const tmpPath = `${destPath}.tmp-${process.pid}-${Date.now()}`
    if (typeof data === 'string') {
      fs.writeFileSync(tmpPath, data, 'utf-8')
    } else {
      fs.writeFileSync(tmpPath, data)
    }
    fs.renameSync(tmpPath, destPath)
  }

  private static hasFreshCache(appId: string): boolean {
    const schemaPath = this.getSchemaPath(appId)
    if (fs.existsSync(schemaPath) && fs.statSync(schemaPath).size > 0) {
      return true
    }
    const nonePath = this.getNoneMarkerPath(appId)
    if (fs.existsSync(nonePath)) {
      try {
        const ageMs = Date.now() - fs.statSync(nonePath).mtimeMs
        if (ageMs >= 0 && ageMs < NEGATIVE_CACHE_TTL_MS) {
          return true
        }
      } catch {}
    }
    return false
  }

  /**
   * 按需为单个游戏拉取成就定义并落盘至 \TitanCore\ost\achievements\<appId>.bin（永不阻塞外层流程）。
   */
  static async ensureSchemaForApp(rawAppId: string): Promise<boolean> {
    return this.ensureSchemaInternal(rawAppId, 0)
  }

  private static async ensureSchemaInternal(rawAppId: string, depth: number): Promise<boolean> {
    const appId = this.resolveBaseGameAppId(rawAppId)
    if (!appId) return false
    if (this.hasFreshCache(appId)) return true

    const existing = this.inflight.get(appId)
    if (existing) return existing

    const task = (async () => {
      try {
        const serverUrl = (Db.get<any>('app_seed_config')?.serverUrl || '').replace(/\/+$/, '')
        const token = Db.getEncrypted<any>('auth_ticket')?.token
        if (!serverUrl || !token) return false

        const res = await titanFetch(
          `${serverUrl}/titan/achievement_schema.php?appid=${appId}&lang=schinese`,
          {
            method: 'GET',
            headers: { 'X-Titan-Token': token },
            timeout: FETCH_TIMEOUT_MS
          }
        )
        if (!res.ok) {
          if (res.status === 401 || res.status === 403 || res.status === 429) {
            this.batchVipDenied = true
          }
          return false
        }

        const payload = (await res.json()) as AchievementSchemaApiResponse
        if (payload?.code !== 200) {
          return false
        }

        const list = Array.isArray(payload.achievements) ? payload.achievements : []
        if (list.length === 0) {
          this.writeFileAtomic(
            this.getNoneMarkerPath(appId),
            JSON.stringify({ appid: appId, type: payload.app_type || 'game', ts: Date.now() })
          )
          const baseId = payload.base_appid ? String(payload.base_appid).trim() : ''
          if (depth < 1 && /^[1-9]\d{0,9}$/.test(baseId) && baseId !== appId) {
            return await this.ensureSchemaInternal(baseId, depth + 1)
          }
          return false
        }

        const gameName = this.getLocalGameTitle(appId)
        const vdf = this.buildUserGameStatsSchemaVdf(
          appId,
          gameName,
          payload.schema_version || 1,
          list
        )
        this.writeFileAtomic(this.getSchemaPath(appId), vdf)
        const nonePath = this.getNoneMarkerPath(appId)
        if (fs.existsSync(nonePath)) {
          try { fs.unlinkSync(nonePath) } catch {}
        }
        console.log(`[AchievementSync] 已落盘本地成就 Schema: ${appId} (${list.length} 项)`)
        return true
      } catch (err: any) {
        console.warn(`[AchievementSync] 拉取成就 Schema(${appId}) 跳过:`, err?.message || err)
        return false
      } finally {
        this.inflight.delete(appId)
      }
    })()

    this.inflight.set(appId, task)
    return task
  }

  /**
   * 仅按 <appId>.lua 文件名补齐缺失的本地成就定义（绝不展开文件内 DLC/Depot 列表）。
   */
  static async warmupInstalledLuaSchemas(activeRoot: string): Promise<void> {
    try {
      if (!activeRoot) return
      const luaDir = path.join(activeRoot, 'config', 'lua')
      if (!fs.existsSync(luaDir)) return

      const appIds: string[] = []
      for (const name of fs.readdirSync(luaDir)) {
        const m = name.match(/^([1-9]\d{0,9})\.lua$/i)
        if (!m) continue
        const appId = this.resolveBaseGameAppId(m[1])
        if (appId && !this.hasFreshCache(appId)) {
          appIds.push(appId)
        }
      }

      this.batchVipDenied = false
      // 受控 2 并发逐个补齐缺失项，避免启动瞬时打满连接；若后端返回无权/限流立即停批
      let idx = 0
      const workers = Array.from({ length: Math.min(2, appIds.length) }, async () => {
        while (idx < appIds.length && !this.batchVipDenied) {
          const id = appIds[idx++]
          await this.ensureSchemaForApp(id)
        }
      })
      await Promise.allSettled(workers)
    } catch {}
  }
}

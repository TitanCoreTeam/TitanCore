import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { Db } from '../db'
import { SteamDetector } from './SteamDetector'
import { ModeSwitchService } from './ModeSwitchService'
import { titanFetch } from '../TitanNet'

interface PatternTarget {
  category: 'pattern' | 'ipc'
  dllType: 'steamclient' | 'steamui'
  hash: string
  relativePath: string
}

export class PatternSyncService {
  private static shaCache = new Map<string, { mtimeMs: number; size: number; hash: string }>()
  private static syncPromise: Promise<{ pulled: number; missing: string[]; error?: string }> | null = null

  /**
   * 计算指定文件的 SHA256 哈希值（小写 64 位十六进制）
   */
  private static calculateSha256(filePath: string): string | null {
    try {
      if (!fs.existsSync(filePath)) return null
      const stat = fs.statSync(filePath)
      const cached = this.shaCache.get(filePath)
      if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
        return cached.hash
      }
      // TC-P1: 4MB 分段读，大文件不再整体进内存；保持同步签名，调用方零改动
      const hash = crypto.createHash('sha256')
      const fd = fs.openSync(filePath, 'r')
      try {
        const buf = Buffer.allocUnsafe(4 * 1024 * 1024)
        let bytes = 0
        while ((bytes = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
          hash.update(buf.subarray(0, bytes))
        }
      } finally {
        fs.closeSync(fd)
      }
      const digest = hash.digest('hex').toLowerCase()
      this.shaCache.set(filePath, { mtimeMs: stat.mtimeMs, size: stat.size, hash: digest })
      return digest
    } catch (e: any) {
      console.warn('[PatternSyncService] 读取计算哈希失败: ' + filePath, e.message)
      return null
    }
  }

  /**
   * 校验拉取到的文本是否为合法 TOML（非空、非 HTML/XML 报错页、包含节头）
   */
  private static isValidTomlContent(content: string): boolean {
    const trimmed = content.trim()
    if (!trimmed) return false
    const lower = trimmed.toLowerCase()
    if (
      lower.startsWith('<') ||
      lower.startsWith('<!doctype') ||
      lower.startsWith('<html') ||
      lower.startsWith('<?xml')
    ) {
      return false
    }
    return trimmed.includes('[') && trimmed.includes(']')
  }

  /**
   * 从纯文本 TOML 源（GitHub 原生 / 国内 CDN 镜像）拉取
   */
  private static async fetchFromRawSource(
    sourceName: string,
    url: string,
    signal: AbortSignal
  ): Promise<{ source: string; content: string }> {
    const res = await titanFetch(url, {
      method: 'GET',
      timeout: 8000,
      signal
    })
    if (res.status === 404) {
      throw new Error('NOT_FOUND')
    }
    if (!res.ok) {
      throw new Error(`HTTP_${res.status}`)
    }
    const text = await res.text()
    if (!this.isValidTomlContent(text)) {
      throw new Error('INVALID_TOML')
    }
    return { source: sourceName, content: text }
  }

  /**
   * 从当前已连接 TC 节点 pattern_mirror.php 接口拉取
   */
  private static async fetchFromNodeMirror(
    serverUrl: string,
    token: string,
    target: PatternTarget,
    signal: AbortSignal
  ): Promise<{ source: string; content: string }> {
    const res = await titanFetch(`${serverUrl}/titan/pattern_mirror.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Titan-Token': token
      },
      body: JSON.stringify({
        category: target.category,
        dll_type: target.dllType,
        sha256: target.hash
      }),
      timeout: 8000,
      signal
    })
    if (res.status === 404) {
      throw new Error('NOT_FOUND')
    }
    if (!res.ok) {
      throw new Error(`HTTP_${res.status}`)
    }
    const json = await res.json() as { code?: number; data?: { content?: string } }
    const tomlContent = json?.data?.content
    if (json?.code !== 200 || typeof tomlContent !== 'string' || !this.isValidTomlContent(tomlContent)) {
      throw new Error('NOT_FOUND')
    }
    return { source: 'node', content: tomlContent }
  }

  /**
   * 单个 Pattern/IPC 文件的 4 源并发竞速拉取与安全落盘（落到 targetRoot 活根）
   * 竞速源：2 个国内 GitHub 镜像（ghfast.top、cdn.jsdelivr.net）+ 原生 raw.githubusercontent.com + 当前节点 pattern_mirror.php
   */
  private static async fetchAndWritePattern(
    serverUrl: string,
    token: string,
    target: PatternTarget,
    targetRoot: string
  ): Promise<'ok' | 'not_found' | 'network_error'> {
    const destPath = path.join(targetRoot, target.relativePath)
    try {
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
        return 'ok' // 本地已就绪且非空，跳过
      }
    } catch {
      // 容忍状态读取异常，继续尝试拉取
    }

    const rawPath = `${target.category}/${target.dllType}/${target.hash}.toml`
    const racers: Array<{ name: string; run: (signal: AbortSignal) => Promise<{ source: string; content: string }> }> = [
      {
        name: 'ghfast',
        run: (signal) =>
          this.fetchFromRawSource(
            'ghfast',
            `https://ghfast.top/https://raw.githubusercontent.com/gobaidu2023-lang/steam-monitor/${rawPath}`,
            signal
          )
      },
      {
        name: 'jsdelivr',
        run: (signal) =>
          this.fetchFromRawSource(
            'jsdelivr',
            `https://cdn.jsdelivr.net/gh/gobaidu2023-lang/steam-monitor@${target.category}/${target.dllType}/${target.hash}.toml`,
            signal
          )
      },
      {
        name: 'github',
        run: (signal) =>
          this.fetchFromRawSource(
            'github',
            `https://raw.githubusercontent.com/gobaidu2023-lang/steam-monitor/${rawPath}`,
            signal
          )
      }
    ]
    if (serverUrl && token) {
      racers.push({
        name: 'node',
        run: (signal) => this.fetchFromNodeMirror(serverUrl, token, target, signal)
      })
    }

    const controllers = racers.map(() => new AbortController())
    let hasNotFound = false
    let hasNetworkError = false
    const tasks = racers.map((racer, idx) =>
      racer.run(controllers[idx].signal).catch((err: any) => {
        const msg = String(err?.message || '')
        if (msg === 'NOT_FOUND' || msg === 'INVALID_TOML') {
          hasNotFound = true
        } else if (!controllers[idx].signal.aborted) {
          hasNetworkError = true
        }
        throw err
      })
    )

    const tmpPath = `${destPath}.tmp-${process.pid}-${Date.now()}`
    try {
      const winner = await Promise.any(tasks)
      controllers.forEach(c => c.abort())

      const parentDir = path.dirname(destPath)
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true })
      }
      // TC-P1: 临时文件 + rename，防写一半损坏目标文件，并带时间戳防并发冲突
      fs.writeFileSync(tmpPath, winner.content, 'utf-8')
      fs.renameSync(tmpPath, destPath)
      console.log(`[PatternSyncService] 兜底同步成功 (${winner.source}): ${target.relativePath}`)
      return 'ok'
    } catch {
      controllers.forEach(c => c.abort())
      try {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
      } catch {}
      console.warn(`[PatternSyncService] 4源竞速同步失败: ${target.relativePath}`)
      return hasNotFound && !hasNetworkError ? 'not_found' : 'network_error'
    } finally {
      await Promise.allSettled(tasks)
    }
  }

  /**
   * 核心校验与同步入口（零阻塞，永不向外抛错，带并发单例锁）
   * 铁律：原生 Steam DLL 哈希探测恒定走物理 Steam 根；落盘/复核恒定走 ModeSwitchService 活根
   */
  static async validatePatterns(): Promise<{ pulled: number; missing: string[]; error?: string }> {
    if (this.syncPromise) {
      return this.syncPromise
    }
    this.syncPromise = this.doValidatePatterns()
    try {
      return await this.syncPromise
    } finally {
      this.syncPromise = null
    }
  }

  private static async doValidatePatterns(): Promise<{ pulled: number; missing: string[]; error?: string }> {
    try {
      const serverUrl = Db.get<any>('app_seed_config')?.serverUrl || ''
      const token = Db.getEncrypted<any>('auth_ticket')?.token || ''

      const detectRes = await SteamDetector.detect()
      const realRoot = detectRes?.path
      if (!realRoot || typeof realRoot !== 'string' || !fs.existsSync(realRoot)) {
        return { pulled: 0, missing: [], error: 'PREREQ_MISSING' }
      }

      // 获取当前模式下的活动根目录（纯净模式为 TC\ost，经典模式为 Steam 物理目录）
      const activeRoot = ModeSwitchService.getActiveRoot(realRoot)
      if (!activeRoot || typeof activeRoot !== 'string') {
        return { pulled: 0, missing: [], error: 'PREREQ_MISSING' }
      }

      // 自动自愈：活根若在文件系统中尚未生成，立即创建，不触发假性 PREREQ_MISSING
      if (!fs.existsSync(activeRoot)) {
        try {
          fs.mkdirSync(activeRoot, { recursive: true })
        } catch (e: any) {
          return { pulled: 0, missing: [], error: 'DIR_CREATE_FAIL:' + e.message }
        }
      }

      // 1. 本地 DLL SHA256 计算：【必须且恒定从真实 Steam 根读取】
      const clientDllPath = path.join(realRoot, 'steamclient64.dll')
      const uiDllPath = path.join(realRoot, 'steamui.dll')

      const clientHash = this.calculateSha256(clientDllPath)
      const uiHash = this.calculateSha256(uiDllPath)

      // 2. 构造探测目标
      const targets: PatternTarget[] = []

      if (clientHash) {
        targets.push({
          category: 'pattern',
          dllType: 'steamclient',
          hash: clientHash,
          relativePath: path.join('opensteamtool', 'pattern', 'steamclient', `${clientHash}.toml`)
        })
        targets.push({
          category: 'ipc',
          dllType: 'steamclient',
          hash: clientHash,
          relativePath: path.join('opensteamtool', 'ipc', 'steamclient', `${clientHash}.toml`)
        })
      }

      if (uiHash) {
        targets.push({
          category: 'pattern',
          dllType: 'steamui',
          hash: uiHash,
          relativePath: path.join('opensteamtool', 'pattern', 'steamui', `${uiHash}.toml`)
        })
      }

      // 若两颗原生 DLL 都无法计算出哈希，显式向外抛出明确错误，防止前端全部落在 falsy 上导致界面静默
      if (targets.length === 0) {
        return { pulled: 0, missing: [], error: 'STEAM_DLL_NOT_FOUND' }
      }

      let hasNetworkError = false
      let hasNotFound = false

      const runBatch = async (batch: PatternTarget[]) => {
        const resList = await Promise.allSettled(
          batch.map(t => this.fetchAndWritePattern(serverUrl, token, t, activeRoot))
        )
        for (const item of resList) {
          if (item.status === 'fulfilled') {
            if (item.value === 'network_error') hasNetworkError = true
            if (item.value === 'not_found') hasNotFound = true
          } else {
            hasNetworkError = true
          }
        }
      }

      const isReady = (t: PatternTarget) => {
        try {
          const p = path.join(activeRoot, t.relativePath)
          return fs.existsSync(p) && fs.statSync(p).size > 0
        } catch {
          return false
        }
      }

      // 3. 并发拉取缺失项（落盘写入【活动活根 activeRoot】）
      await runBatch(targets)

      // 3.5 若仍有缺失项，间隔 800ms 自动重试 1 次（应对瞬时网络波动）
      const pending = targets.filter(t => !isReady(t))
      if (pending.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 800))
        await runBatch(pending)
      }

      // 4. 复核探测结果：【检查活动活根 activeRoot 中的落盘情况】
      const pulled = targets.filter(isReady).length
      const missing = targets.filter(t => !isReady(t)).map(t => t.relativePath)

      let error: string | undefined
      if (missing.length > 0) {
        // 若有缺失项：纯网络错误时如实返回 NETWORK_ERROR；若网络正常但服务端未收录/404，如实归因为云端未适配 (DIAG_PATTERN_STALE)
        error = (hasNetworkError && !hasNotFound) ? 'NETWORK_ERROR' : 'DIAG_PATTERN_STALE'
      }

      return { pulled, missing, ...(error ? { error } : {}) }
    } catch (e: any) {
      console.warn('[PatternSyncService] validatePatterns 运行被安全捕获:', e.message)
      return { pulled: 0, missing: [], error: e?.message || 'UNKNOWN' }
    }
  }

  /**
   * 纯检测：返回 TOML 配置对齐诊断项（严格校验文件存在且非空）
   */
  static diagnoseAlignment(steamPath: string): { name: string; ok: boolean; message: string } {
    try {
      // TC-P12: DLL/steamui 是 Steam 原生文件，永远查真实根；投递产物跟随活根 ostRoot
      const ostRoot = ModeSwitchService.getActiveRoot(steamPath)
      const clientDllPath = path.join(steamPath, 'steamclient64.dll')
      const uiDllPath = path.join(steamPath, 'steamui.dll')

      const clientHash = this.calculateSha256(clientDllPath)
      const uiHash = this.calculateSha256(uiDllPath)

      const checks: string[] = []
      if (clientHash) {
        checks.push(path.join(ostRoot, 'opensteamtool', 'pattern', 'steamclient', `${clientHash}.toml`))
        checks.push(path.join(ostRoot, 'opensteamtool', 'ipc', 'steamclient', `${clientHash}.toml`))
      }
      if (uiHash) {
        checks.push(path.join(ostRoot, 'opensteamtool', 'pattern', 'steamui', `${uiHash}.toml`))
      }

      const allOk = checks.length > 0 && checks.every(p => {
        try {
          return fs.existsSync(p) && fs.statSync(p).size > 0
        } catch {
          return false
        }
      })

      return {
        name: 'DIAG_TOML_ALIGN',
        ok: allOk,
        message: allOk
          ? 'DIAG_TOML_OK'
          : 'DIAG_TOML_MISMATCH'
      }
    } catch (e: any) {
      return { name: 'DIAG_TOML_ALIGN', ok: false, message: 'DIAG_EXCEPTION:' + e.message }
    }
  }
}
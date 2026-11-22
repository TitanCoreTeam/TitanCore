// 文件名: src/main/services/GatewayService.ts
import { BrowserWindow } from 'electron'
import { Db } from '../db'
import { SecurityService } from './SecurityService'
import { titanFetch } from '../TitanNet'

export class GatewayService {
  
  static pushQuotaUpdate(limit: number, remaining: number, extraRemaining: number) {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      windows[0].webContents.send('auth:update-quota', { limit, remaining, extraRemaining })
    }
  }

  static pushExtraQuotaUpdate(extraRemaining: number) {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      windows[0].webContents.send('auth:update-quota', { extraRemaining })
    }
  }

  private static unpackGatewayJson(json: any): { data: any; errMsg?: string } {
    if (!json || typeof json !== 'object') return { data: null }
    const hexPayload = typeof json.data === 'object' ? json.data?.data : json.data
    let decrypted = hexPayload ? SecurityService.decryptNetworkPayload<any>(hexPayload) : null
    if (typeof decrypted === 'string') {
      try { decrypted = JSON.parse(decrypted) } catch {}
    }
    if (!decrypted && json.data && typeof json.data === 'object') {
      decrypted = json.data
    }
    const actualData = decrypted && typeof decrypted === 'object' ? (decrypted.data || decrypted) : null
    const errMsg = actualData?.msg || json.msg || json.error
    return { data: actualData, errMsg }
  }

  static async fetchSecureLink(id: string, serverUrl: string) {
    const ticket = Db.getEncrypted<any>('auth_ticket')
    if (!serverUrl || !ticket?.token) return { success: false, error: 'NO_AUTH' }

    try {
      const res = await titanFetch(`${serverUrl}/titan/titan_gateway.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Titan-Token': ticket.token },
        body: JSON.stringify({ action: 'fetch_secure_link', resource_id: id })
      })
      
      if (res.status === 429) return { success: false, error: 'QUOTA_EXHAUSTED' }
      if (!res.ok) return { success: false, error: `GATEWAY_REJECTED_${res.status}` }

      const json = await res.json()
      
      if (json.code && json.code !== 200 && json.code !== 0) {
          return { success: false, error: json.msg || 'RESOURCE_NOT_FOUND' }
      }

      const hexPayload = typeof json.data === 'object' ? json.data?.data : json.data
      let decrypted = SecurityService.decryptNetworkPayload<any>(hexPayload)
      
      if (typeof decrypted === 'string') {
        try { decrypted = JSON.parse(decrypted) } catch (e) {}
      }
      if (!decrypted && json.data && typeof json.data === 'object') {
        decrypted = json.data
      }
      
      if (decrypted) {
        const actualData = decrypted.quota_limit !== undefined ? decrypted : (decrypted.data || decrypted)
        if (actualData.quota_limit !== undefined) {
           this.pushQuotaUpdate(actualData.quota_limit, actualData.quota_remaining, actualData.extra_remaining || 0)
        }
        return { success: true, mirrors: actualData.data || actualData }
      }
      return { success: false, error: 'PAYLOAD_DECRYPT_FAIL' }
    } catch (e: any) {
      console.error('[GatewayService] fetch-secure-link 异常:', e)
      return { success: false, error: 'NETWORK_ERROR' }
    }
  }


  static async redeemCores(score: number, amount: number, serverUrl: string, gameId: string = 'default') {
    const ticket = Db.getEncrypted<any>('auth_ticket')
    if (!serverUrl || !ticket?.token) return { success: false, error: 'NO_AUTH' }

    try {
      const res = await titanFetch(`${serverUrl}/titan/titan_gateway.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Titan-Token': ticket.token },
        body: JSON.stringify({ action: 'redeem_quota', score, amount, game_id: gameId })
      })

      let json: any = null
      try { json = await res.json() } catch {}

      if (json) {
        const { data: actualData, errMsg } = this.unpackGatewayJson(json)
        const errorCode = actualData?.error_code || json.error_code

        if (json.code && json.code !== 200 && json.code !== 0) {
          return { success: false, error: errMsg || (res.status === 429 ? 'QUOTA_EXHAUSTED' : 'REDEEM_FAILED'), errorCode, code: json.code }
        }
        if (actualData && actualData.redeemed !== undefined) {
          if (actualData.extra_quota_total !== undefined) {
            this.pushExtraQuotaUpdate(Number(actualData.extra_quota_total))
          }
          return { success: true, data: actualData }
        }
        if (errMsg) {
          return { success: false, error: errMsg, errorCode }
        }
      }

      if (res.status === 429) return { success: false, error: 'QUOTA_EXHAUSTED' }
      if (!res.ok) return { success: false, error: `GATEWAY_REJECTED_${res.status}` }
      return { success: false, error: 'PAYLOAD_DECRYPT_FAIL' }
    } catch (e: any) {
      console.error('[GatewayService] redeem-cores 异常:', e)
      return { success: false, error: 'NETWORK_ERROR' }
    }
  }

  static async claimBadabVictory(route: 'justice' | 'corruption', durationSeconds: number, starYear: number, serverUrl: string) {
    const ticket = Db.getEncrypted<any>('auth_ticket')
    if (!serverUrl || !ticket?.token) return { success: false, error: 'NO_AUTH' }

    try {
      const res = await titanFetch(`${serverUrl}/titan/titan_gateway.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Titan-Token': ticket.token },
        body: JSON.stringify({
          action: 'claim_badab_victory',
          route,
          duration_seconds: durationSeconds,
          star_year: starYear
        })
      })

      let json: any = null
      try { json = await res.json() } catch {}

      if (json) {
        const { data: actualData, errMsg } = this.unpackGatewayJson(json)
        const errorCode = actualData?.error_code || actualData?.status || json.error_code

        if (json.code && json.code !== 200 && json.code !== 0) {
          return { success: false, error: errMsg || 'CLAIM_FAILED', errorCode, code: json.code }
        }
        if (actualData && (actualData.status || actualData.days_added !== undefined)) {
          return { success: true, data: actualData }
        }
        if (errMsg) {
          return { success: false, error: errMsg, errorCode }
        }
      }

      if (!res.ok) return { success: false, error: `GATEWAY_REJECTED_${res.status}` }
      return { success: false, error: 'PAYLOAD_DECRYPT_FAIL' }
    } catch (e: any) {
      console.error('[GatewayService] claimBadabVictory 异常:', e)
      return { success: false, error: 'NETWORK_ERROR' }
    }
  }
}
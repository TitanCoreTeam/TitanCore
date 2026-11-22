import { useAuthStore } from '../stores/authStore';
import { t } from '../i18n';

export type RedeemableGameId = 'starcat' | 'cyber_guitar';

export interface RedeemResult {
  ok: boolean;
  redeemed: number;
  cost: number;
  totalRedeemed: number;
  isLimit: boolean;
  message: string;
}

/**
 * 统一小游戏额度兑换调用与错误归一化：
 * - 同步更新 authStore 中的终生已兑次数（与后端 titan_game_rewards 对齐）
 * - 对防刷类风控报错保持中性文案，不向界面暴露冷却时长/埋点/游玩时长阈值
 */
export async function redeemGameQuota(
  gameId: RedeemableGameId,
  score: number,
  amount: number
): Promise<RedeemResult> {
  const authStore = useAuthStore();
  const maxPerGame = authStore.minigameRewards.maxPerGame || 3;

  try {
    const res = await (window as any).electron?.invoke?.('sys:redeem-cores', score, amount, gameId);
    if (res?.success && res.data) {
      const redeemed = Math.max(0, Number(res.data.redeemed ?? amount));
      const cost = Math.max(0, Number(res.data.cost ?? redeemed * 10000));
      const totalRedeemed = Number(
        res.data.redeemed_total ??
        res.data.redeemed_today ??
        (authStore.getGameRedeemedCount(gameId) + redeemed)
      );
      authStore.markGameRedeemed(gameId, totalRedeemed);
      return {
        ok: true,
        redeemed,
        cost,
        totalRedeemed,
        isLimit: false,
        message: t('lobby.redeemOkCount', { n: redeemed })
      };
    }

    const errCode = String(res?.errorCode || '');
    const errRaw = String(res?.error || '');
    const errLower = errRaw.toLowerCase();
    const isLimit =
      errCode === 'LIFETIME_LIMIT_REACHED' ||
      res?.code === 429 ||
      errRaw === 'QUOTA_EXHAUSTED' ||
      errLower.includes('429') ||
      errRaw.includes('领满') ||
      errRaw.includes('上限');

    if (isLimit) {
      authStore.markGameRedeemed(gameId, maxPerGame);
      return {
        ok: false,
        redeemed: 0,
        cost: 0,
        totalRedeemed: maxPerGame,
        isLimit: true,
        message: t('lobby.redeemLimit')
      };
    }

    if (errCode === 'REQUIRE_STOCK_GAME') {
      return {
        ok: false,
        redeemed: 0,
        cost: 0,
        totalRedeemed: authStore.getGameRedeemedCount(gameId),
        isLimit: false,
        message: t('lobby.redeemNeedStock')
      };
    }

    if (errCode === 'REQUIRE_24H_AGE' || errCode === 'REQUIRE_ACTIVITY') {
      return {
        ok: false,
        redeemed: 0,
        cost: 0,
        totalRedeemed: authStore.getGameRedeemedCount(gameId),
        isLimit: false,
        message: t('lobby.redeemConditionNotMet')
      };
    }

    if (errRaw === 'NO_AUTH') {
      return {
        ok: false,
        redeemed: 0,
        cost: 0,
        totalRedeemed: authStore.getGameRedeemedCount(gameId),
        isLimit: false,
        message: t('lobby.redeemNeedLogin')
      };
    }

    if (errRaw === 'NETWORK_ERROR') {
      return {
        ok: false,
        redeemed: 0,
        cost: 0,
        totalRedeemed: authStore.getGameRedeemedCount(gameId),
        isLimit: false,
        message: t('lobby.redeemNetError')
      };
    }

    return {
      ok: false,
      redeemed: 0,
      cost: 0,
      totalRedeemed: authStore.getGameRedeemedCount(gameId),
      isLimit: false,
      message: t('lobby.redeemFailed')
    };
  } catch {
    return {
      ok: false,
      redeemed: 0,
      cost: 0,
      totalRedeemed: authStore.getGameRedeemedCount(gameId),
      isLimit: false,
      message: t('lobby.redeemNetError')
    };
  }
}

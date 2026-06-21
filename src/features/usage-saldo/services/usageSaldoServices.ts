import type { PayloadPostUsageSaldoTopup, PayloadGetUsageSaldoLogs } from '../types/usageSaldoTypes'
import { backendGet, backendPost } from '@/shared/lib/backendClient'

// ─── Balance Services ──────────────────────────────────────────────────────

export const getUsageSaldoBalance = async () => {
  try {
    return await backendGet('/usage-saldo/balance')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postUsageSaldoTopup = async (payload: PayloadPostUsageSaldoTopup) => {
  try {
    return await backendPost('/usage-saldo/topup', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

// ─── Usage Services ────────────────────────────────────────────────────────

export const getUsageSaldoLogs = async (payload?: PayloadGetUsageSaldoLogs) => {
  try {
    const query = payload ? (payload as Record<string, string>) : undefined
    return await backendGet('/usage-saldo/logs', query)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

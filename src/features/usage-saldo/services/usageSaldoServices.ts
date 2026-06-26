import type { PayloadPostUsageSaldoTopup, PayloadGetUsageSaldoLogs } from '../types/usageSaldoTypes'
import { api } from '@/shared/lib/api'
import { formattingQueryString } from '@/shared/lib/utils'

export const getUsageSaldoBalance = async () => {
  try {
    return await api('GET', '/usage-saldo/balance')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postUsageSaldoTopup = async (payload: PayloadPostUsageSaldoTopup) => {
  try {
    return await api('POST', '/usage-saldo/topup', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const getUsageSaldoLogs = async (payload?: PayloadGetUsageSaldoLogs) => {
  try {
    const queryString = formattingQueryString(payload ?? {})
    return await api('GET', `/usage-saldo/logs${queryString}`)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

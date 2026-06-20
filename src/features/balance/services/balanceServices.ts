import type { PayloadPostBalance } from '../types/balanceTypes'
import { backendGet, backendPost } from '@/shared/lib/backendClient'

export const getBalance = async () => {
  try {
    return await backendGet('/balance')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postBalance = async (payload: PayloadPostBalance) => {
  try {
    return await backendPost('/balance', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

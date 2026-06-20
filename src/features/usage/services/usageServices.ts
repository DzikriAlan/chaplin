import type { PayloadGetUsage } from '../types/usageTypes'
import { backendGet } from '@/shared/lib/backendClient'

export const getUsage = async (payload?: PayloadGetUsage) => {
  try {
    const query = payload ? (payload as Record<string, string>) : undefined
    return await backendGet('/usage', query)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

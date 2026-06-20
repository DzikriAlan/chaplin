import type { PayloadPostFaqManager } from '../types/faqManagerTypes'
import { backendGet, backendPost, backendDelete } from '@/shared/lib/backendClient'

export const getFaqManager = async () => {
  try {
    return await backendGet('/faq-manager')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postFaqManager = async (payload: PayloadPostFaqManager) => {
  try {
    return await backendPost('/faq-manager', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteFaqManager = async (id: string) => {
  try {
    return await backendDelete('/faq-manager', { id })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

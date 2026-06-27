import type { PayloadPostKbFaq } from '../types/knowledgeBaseFaqTypes'
import { api } from '@/shared/lib/api'
import { formattingQueryString } from '@/shared/lib/utils'

export const getKBFaqItems = async () => {
  try {
    return await api('GET', '/knowledge-base/faq/items')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBFaqItems = async (payload: PayloadPostKbFaq) => {
  try {
    return await api('POST', '/knowledge-base/faq/items', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBFaqItemsId = async (id: string) => {
  try {
    const queryString = formattingQueryString({ id })
    return await api('DELETE', `/knowledge-base/faq/items${queryString}`)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchKBFaqItemsId = async (id: string, payload: Partial<PayloadPostKbFaq>) => {
  try {
    const queryString = formattingQueryString({ id })
    return await api('PATCH', `/knowledge-base/faq/items${queryString}`, payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

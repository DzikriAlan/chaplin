import type { PayloadPostAgent, PayloadPatchAgent } from '../types/agentsTypes'
import { api } from '@/shared/lib/api'
import { formattingQueryString } from '@/shared/lib/utils'

export const getAgents = async () => {
  try {
    return await api('GET', '/agent')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postAgent = async (payload: PayloadPostAgent) => {
  try {
    return await api('POST', '/agent', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteAgent = async (id: string) => {
  try {
    return await api('DELETE', '/agent', { id })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchAgent = async (id: string, payload: PayloadPatchAgent) => {
  try {
    const queryString = formattingQueryString({ id })
    return await api('PATCH', `/agent${queryString}`, payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

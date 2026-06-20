import type { PayloadPostTopicAnalytics } from '../types/topicTypes'
import { fetchWithAuth } from '@/shared/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const postTopicAnalytics = async (payload?: PayloadPostTopicAnalytics) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/topic/analytics`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

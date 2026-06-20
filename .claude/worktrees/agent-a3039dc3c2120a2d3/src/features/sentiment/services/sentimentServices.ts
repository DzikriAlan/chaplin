import type { PayloadPostSentimentAnalytics } from '../types/sentimentTypes'
import { fetchWithAuth } from '@/shared/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const postSentimentAnalytics = async (payload?: PayloadPostSentimentAnalytics) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/sentiment/analytics`, {
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

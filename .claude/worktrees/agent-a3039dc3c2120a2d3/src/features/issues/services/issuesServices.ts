import type { PayloadPostIssuesMap } from '../types/issuesTypes'
import { fetchWithAuth } from '@/shared/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const postIssuesMap = async (payload?: PayloadPostIssuesMap) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/issues/map`, {
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

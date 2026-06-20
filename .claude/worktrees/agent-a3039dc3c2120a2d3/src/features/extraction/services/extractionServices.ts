import type { PayloadPostExtractionMap } from '../types/extractionTypes'
import { fetchWithAuth } from '@/shared/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const postExtractionMap = async (payload?: PayloadPostExtractionMap) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/extraction/map`, {
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

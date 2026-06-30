import type { PayloadPostChat } from '../types/chatTypes'
import { getAuthToken } from '@/shared/lib/api'

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/v1`

export const postChat = async (payload: PayloadPostChat) => {
  try {
    const token = await getAuthToken()
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token ?? ''}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

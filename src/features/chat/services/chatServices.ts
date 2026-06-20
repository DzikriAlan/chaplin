import type { PayloadPostChat } from '../types/chatTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getChatSessions = async () => {
  try {
    const res = await fetch(`${base}/chat/sessions`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const getChat = async (sessionId: string) => {
  try {
    const res = await fetch(`${base}/chat?sessionId=${encodeURIComponent(sessionId)}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postChat = async (payload: PayloadPostChat) => {
  try {
    const res = await fetch(`${base}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchChatSession = async (sessionId: string, title: string) => {
  try {
    const res = await fetch(`${base}/chat/sessions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, title }),
    })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteChatSession = async (sessionId: string) => {
  try {
    const res = await fetch(`${base}/chat/sessions?sessionId=${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

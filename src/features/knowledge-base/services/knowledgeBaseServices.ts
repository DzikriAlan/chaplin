import type { PayloadPostKnowledgeBase } from '../types/knowledgeBaseTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getKnowledgeBase = async () => {
  try {
    const res = await fetch(`${base}/knowledge-base`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKnowledgeBase = async (payload: PayloadPostKnowledgeBase) => {
  try {
    const res = await fetch(`${base}/knowledge-base`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKnowledgeBase = async (id: string) => {
  try {
    const res = await fetch(`${base}/knowledge-base?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchKnowledgeBase = async (id: string, payload: Partial<PayloadPostKnowledgeBase>) => {
  try {
    const res = await fetch(`${base}/knowledge-base?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

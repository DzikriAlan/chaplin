import type { PayloadPostAgent, PayloadPatchAgent } from '../types/agentsTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getAgents = async () => {
  try {
    const res = await fetch(`${base}/agents`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postAgent = async (payload: PayloadPostAgent) => {
  try {
    const res = await fetch(`${base}/agents`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteAgent = async (id: string) => {
  try {
    const res = await fetch(`${base}/agents?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchAgent = async (id: string, payload: PayloadPatchAgent) => {
  try {
    const res = await fetch(`${base}/agents?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

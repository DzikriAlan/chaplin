import type { PayloadPostQuestionsGenerate } from '../types/questionsTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getQuestions = async (topic?: string) => {
  try {
    const queryString = topic ? `?topic=${encodeURIComponent(topic)}` : ''
    const res = await fetch(`${base}/questions${queryString}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postQuestionsGenerate = async (payload: PayloadPostQuestionsGenerate) => {
  try {
    const res = await fetch(`${base}/questions/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

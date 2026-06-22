import type { PayloadPostDriveFolders } from '../types/knowledgeBaseGoogleDriveHelperTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getDriveFolders = async () => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/folders`)
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postDriveFolders = async (payload: PayloadPostDriveFolders) => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/folders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const getDriveConfig = async () => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/config`)
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteDriveConfig = async () => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/config`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

import type { DataUploadFolder, PayloadPostUploadFolder, PayloadPostSignedUrl, DataSignedUrl } from '../types/fileUploadTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getUploadFolders = async (): Promise<DataUploadFolder[]> => {
  try {
    const res = await fetch(`${base}/upload/folders`)
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: DataUploadFolder[] }
    return json.data ?? []
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return []
    throw error
  }
}

export const postUploadFolder = async (payload: PayloadPostUploadFolder) => {
  try {
    const res = await fetch(`${base}/upload/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteUploadFolder = async (id: string) => {
  try {
    const res = await fetch(`${base}/upload/folders?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postSignedUrl = async (payload: PayloadPostSignedUrl): Promise<DataSignedUrl> => {
  try {
    const res = await fetch(`${base}/upload/signed-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: DataSignedUrl }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null as unknown as DataSignedUrl
    throw error
  }
}

export const deleteUploadFile = async (id: string) => {
  try {
    const res = await fetch(`${base}/upload/files?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

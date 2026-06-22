import type { DataKbMyDriveFolder, PayloadPostKbMyDriveFolder, PayloadPostKbMyDriveSignedUrl, DataKbMyDriveSignedUrl } from '../types/knowledgeBaseMyDriveTypes'

const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getKBMyDriveFolders = async (): Promise<DataKbMyDriveFolder[]> => {
  try {
    const res = await fetch(`${base}/knowledge-base/my-drive/folders`)
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: DataKbMyDriveFolder[] }
    return json.data ?? []
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return []
    throw error
  }
}

export const postKBMyDriveFolders = async (payload: PayloadPostKbMyDriveFolder) => {
  try {
    const res = await fetch(`${base}/knowledge-base/my-drive/folders`, {
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

export const deleteKBMyDriveFolders = async (id: string) => {
  try {
    const res = await fetch(`${base}/knowledge-base/my-drive/folders?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBMyDriveSignedUrl = async (payload: PayloadPostKbMyDriveSignedUrl): Promise<DataKbMyDriveSignedUrl> => {
  try {
    const res = await fetch(`${base}/knowledge-base/my-drive/signed-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: DataKbMyDriveSignedUrl }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null as unknown as DataKbMyDriveSignedUrl
    throw error
  }
}

export const deleteKBMyDriveFiles = async (id: string) => {
  try {
    const res = await fetch(`${base}/knowledge-base/my-drive/files?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

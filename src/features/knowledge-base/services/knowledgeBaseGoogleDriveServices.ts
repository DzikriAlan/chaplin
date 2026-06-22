const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getKBGoogleDriveDocuments = async () => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/documents`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBGoogleDriveDocumentsId = async (id: string) => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/documents?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchKBGoogleDriveDocuments = async (payload: { id?: string; ids?: string[]; action: 'skip' | 'retry' }) => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/documents`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBGoogleDriveDocumentsBulk = async (payload: { ids?: string[]; all?: boolean }) => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/documents`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBGoogleDriveSync = async (payload: { action: string }) => {
  try {
    const res = await fetch(`${base}/knowledge-base/google-drive/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

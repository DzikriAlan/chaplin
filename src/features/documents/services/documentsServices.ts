const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getDocuments = async () => {
  try {
    const res = await fetch(`${base}/documents`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteDocuments = async (id: string) => {
  try {
    const res = await fetch(`${base}/documents?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchDocuments = async (payload: { id?: string; ids?: string[]; action: 'skip' | 'retry' }) => {
  try {
    const res = await fetch(`${base}/documents`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteDocumentsBulk = async (payload: { ids?: string[]; all?: boolean }) => {
  try {
    const res = await fetch(`${base}/documents`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postDocumentsSync = async (payload: { action: string }) => {
  try {
    const res = await fetch(`${base}/documents/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

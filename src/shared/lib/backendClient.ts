const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1'

let cachedToken: string | null = null
let tokenExpiry = 0

async function getBackendToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch('/api/auth/backend-token')
  if (!res.ok) throw new Error('Failed to get backend token')
  const data = await res.json() as { token: string }
  cachedToken = data.token
  tokenExpiry = Date.now() + 6 * 24 * 60 * 60 * 1000
  return cachedToken
}

function buildHeaders(token: string): Record<string, string> {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function backendGet(path: string, query?: Record<string, string>) {
  const token = await getBackendToken()
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  const res = await fetch(`${BASE_URL}${path}${qs}`, { headers: buildHeaders(token) })
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as { data: unknown }
  return json.data
}

export async function backendPost(path: string, body?: unknown) {
  const token = await getBackendToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as { data: unknown }
  return json.data
}

export async function backendPatch(path: string, body?: unknown) {
  const token = await getBackendToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as { data: unknown }
  return json.data
}

export async function backendDelete(path: string, query?: Record<string, string>) {
  const token = await getBackendToken()
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  const res = await fetch(`${BASE_URL}${path}${qs}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  })
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as { data: unknown }
  return json.data
}

export async function backendFetch(path: string, init?: RequestInit) {
  const token = await getBackendToken()
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })
}

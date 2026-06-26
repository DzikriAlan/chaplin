export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T | null
  error?: {
    code: string
    message: string
  }
  message?: string
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

let cachedToken: string | null = null

async function getAuthToken(): Promise<string | null> {
  if (cachedToken) return cachedToken
  try {
    const res = await fetch('/api/auth/backend-token')
    if (!res.ok) return null
    const data = await res.json() as { token?: string }
    cachedToken = data.token ?? null
    return cachedToken
  } catch {
    return null
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export const api = async <T = unknown>(
  method: HttpMethod,
  endpoint: string,
  payload?: unknown
): Promise<T> => {
  const token = await getAuthToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const options: RequestInit = { method, headers }
  if (payload && method !== 'GET') options.body = JSON.stringify(payload)

  const res = await fetch(`${baseUrl}${endpoint}`, options)
  if (!res.ok) throw new Error(res.statusText)

  return res.json() as Promise<T>
}

export const backendFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) ?? {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  return fetch(`${baseUrl}${endpoint}`, { ...options, headers })
}

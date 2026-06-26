import axios, {
  type RawAxiosRequestHeaders,
  type AxiosInstance,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

import { useUserSession } from '/@src/stores/userSession'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T | null
  error?: {
    code: string
    message: string
  }
  message?: string
}

let apiInstance: AxiosInstance | null = null

export function createApi() {
  apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api-kazeeai.spiderops.id/api',
  })

  apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const userSession = useUserSession()

    if (userSession.isLoggedIn) {
      config.headers = {
        ...((config.headers as RawAxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${userSession.token}`,
      } as AxiosRequestHeaders
    }

    return config
  })

  apiInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const data = response.data
      if (!data.success) {
        const error = new Error(data.error?.message || 'Request failed')
        Object.assign(error, { code: data.error?.code || 'UNKNOWN_ERROR' })
        throw error
      }
      return response
    },
    (error: unknown) => {
      const axiosError = error as Record<string, unknown>
      const responseData = axiosError?.response?.data as Record<string, unknown> | undefined
      if (responseData?.error) {
        const errorData = responseData.error as Record<string, unknown>
        const apiError = new Error(String(errorData.message) || 'Request failed')
        Object.assign(apiError, { code: String(errorData.code) || 'UNKNOWN_ERROR' })
        throw apiError
      }
      throw error
    }
  )

  return apiInstance
}

const getApiInstance = () => {
  if (!apiInstance) {
    createApi()
  }
  return apiInstance!
}

export function useApi() {
  return getApiInstance()
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export const api = async <T = unknown>(
  method: HttpMethod,
  endpoint: string,
  payload?: unknown
): Promise<T> => {
  const client = getApiInstance()

  try {
    const config: Record<string, unknown> = {
      method: method.toLowerCase(),
      url: endpoint,
    }

    if (payload) {
      config.data = payload
    }

    const response = await client.request<T>(config)
    return response.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return null as unknown as T
    }
    throw error
  }
}

export const backendFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const client = getApiInstance()
  const baseUrl = client.defaults.baseURL ?? ''
  const url = new URL(endpoint, baseUrl).toString()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) ?? {}),
  }

  const userSession = useUserSession()
  if (userSession.isLoggedIn) {
    headers.Authorization = `Bearer ${userSession.token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

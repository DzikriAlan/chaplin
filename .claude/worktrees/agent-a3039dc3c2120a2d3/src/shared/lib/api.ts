const token = process.env.NEXT_PUBLIC_API_TOKEN

export const fetchWithAuth = (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })
}

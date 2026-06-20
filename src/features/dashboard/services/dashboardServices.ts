const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const getDashboard = async () => {
  try {
    const res = await fetch(`${base}/dashboard`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json() as { data: unknown }
    return json.data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

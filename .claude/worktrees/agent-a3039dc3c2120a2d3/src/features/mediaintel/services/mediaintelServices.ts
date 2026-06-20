import type {
  PayloadPostMediaintelTopikTimeline,
  PayloadPostMediaintelTopikStatementPerson,
  PayloadPostMediaintelTopikTopIssues,
  PayloadPostMediaintelTopikTopScore,
  PayloadPostMediaintelTopikTopVersion,
  PayloadPostMediaintelComparationDashboardChartCombine,
  PayloadPostMediaintelTopikEkstraksiTimelineMatched,
  PayloadPostMediaintelComparationDashboardMap,
  PayloadPostMediaintelTopikTopAccount,
  PayloadPostMediaintelTopikTopMedia,
} from '../types/mediaintelTypes'
import { fetchWithAuth } from '@/shared/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const postMediaintelTopikTimeline = async (payload?: PayloadPostMediaintelTopikTimeline) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/timeline`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikStatementPerson = async (payload?: PayloadPostMediaintelTopikStatementPerson) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/statement/person`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikTopIssues = async (payload?: PayloadPostMediaintelTopikTopIssues) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/top/issues`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikTopScore = async (payload?: PayloadPostMediaintelTopikTopScore) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/top/score`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikTopVersion = async (payload?: PayloadPostMediaintelTopikTopVersion) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/top/version`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelComparationDashboardChartCombine = async (payload?: PayloadPostMediaintelComparationDashboardChartCombine) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/comparation/dashboard/chart/combine`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikEkstraksiTimelineMatched = async (payload?: PayloadPostMediaintelTopikEkstraksiTimelineMatched) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/ekstraksi/timeline/${payload?.id}/matched`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelComparationDashboardMap = async (payload?: PayloadPostMediaintelComparationDashboardMap) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/comparation/dashboard/map`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikTopAccount = async (payload?: PayloadPostMediaintelTopikTopAccount) => {
  try {
    const source = payload?.source[0] ?? ''
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/top/account/${source}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postMediaintelTopikTopMedia = async (payload?: PayloadPostMediaintelTopikTopMedia) => {
  try {
    const res = await fetchWithAuth(`${baseUrl}/mediaintel/topik/top/media`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

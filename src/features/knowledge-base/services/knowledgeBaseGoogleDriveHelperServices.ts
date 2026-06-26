import type { PayloadPostDriveFolders } from '../types/knowledgeBaseGoogleDriveHelperTypes'
import { api } from '@/shared/lib/api'

export const getKBGoogleDriveFolders = async () => {
  try {
    return await api('GET', '/knowledge-base/google-drive/folders')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBGoogleDriveFolders = async (payload: PayloadPostDriveFolders) => {
  try {
    return await api('POST', '/knowledge-base/google-drive/folders', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const getKBGoogleDriveConfig = async () => {
  try {
    return await api('GET', '/knowledge-base/google-drive/config')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBGoogleDriveConfig = async () => {
  try {
    return await api('DELETE', '/knowledge-base/google-drive/config')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

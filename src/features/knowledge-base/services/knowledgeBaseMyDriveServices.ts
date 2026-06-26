import type { DataKbMyDriveFolder, PayloadPostKbMyDriveFolder, PayloadPostKbMyDriveSignedUrl, DataKbMyDriveSignedUrl } from '../types/knowledgeBaseMyDriveTypes'
import { api } from '@/shared/lib/api'

export const getKBMyDriveFolders = async (): Promise<DataKbMyDriveFolder[]> => {
  try {
    const data = await api<DataKbMyDriveFolder[]>('GET', '/knowledge-base/my-drive/folders')
    return data ?? []
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return []
    throw error
  }
}

export const postKBMyDriveFolders = async (payload: PayloadPostKbMyDriveFolder) => {
  try {
    return await api('POST', '/knowledge-base/my-drive/folders', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBMyDriveFolders = async (id: string) => {
  try {
    return await api('DELETE', '/knowledge-base/my-drive/folders', { id })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBMyDriveSignedUrl = async (payload: PayloadPostKbMyDriveSignedUrl): Promise<DataKbMyDriveSignedUrl> => {
  try {
    return await api<DataKbMyDriveSignedUrl>('POST', '/knowledge-base/my-drive/signed-url', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null as unknown as DataKbMyDriveSignedUrl
    throw error
  }
}

export const deleteKBMyDriveFiles = async (id: string) => {
  try {
    return await api('DELETE', '/knowledge-base/my-drive/files', { id })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

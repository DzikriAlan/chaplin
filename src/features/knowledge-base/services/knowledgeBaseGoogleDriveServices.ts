import { api } from '@/shared/lib/api'
import { formattingQueryString } from '@/shared/lib/utils'

export const getKBGoogleDriveDocuments = async () => {
  try {
    return await api('GET', '/knowledge-base/google-drive/documents')
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBGoogleDriveDocumentsId = async (id: string) => {
  try {
    const queryString = formattingQueryString({ id })
    return await api('DELETE', `/knowledge-base/google-drive/documents${queryString}`)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const patchKBGoogleDriveDocuments = async (payload: { id?: string; ids?: string[]; action: 'skip' | 'retry' }) => {
  try {
    return await api('PATCH', '/knowledge-base/google-drive/documents', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const deleteKBGoogleDriveDocumentsBulk = async (payload: { ids?: string[]; all?: boolean }) => {
  try {
    return await api('DELETE', '/knowledge-base/google-drive/documents', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

export const postKBGoogleDriveSync = async (payload: { action: string }) => {
  try {
    return await api('POST', '/knowledge-base/google-drive/sync', payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null
    throw error
  }
}

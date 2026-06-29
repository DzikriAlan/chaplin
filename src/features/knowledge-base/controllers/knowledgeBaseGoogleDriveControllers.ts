import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKbGoogleDriveStates } from '../states/knowledgeBaseGoogleDriveStates'
import {
  getKBGoogleDriveDocuments,
  deleteKBGoogleDriveDocumentsId,
  deleteKBGoogleDriveDocumentsBulk,
  patchKBGoogleDriveDocuments,
  postKBGoogleDriveSync,
} from '../services/knowledgeBaseGoogleDriveServices'
import type { KbGoogleDrive } from '../types/knowledgeBaseGoogleDriveTypes'

export const useKBGoogleDriveControllers = () => {
  const queryClient = useQueryClient()
  const { setKbGoogleDrive } = useKbGoogleDriveStates()

  const docs = queryClient.getQueryData<{ status: string }[]>(['documents']) ?? []
  const hasActive = docs.some((d) => d.status === 'PENDING' || d.status === 'PROCESSING')

  const fetchDocuments = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      setKbGoogleDrive({ status: 'loading' })
      try {
        const data = await getKBGoogleDriveDocuments()
        setKbGoogleDrive({ status: 'success', statusTitle: 'Success', data: data as KbGoogleDrive['data'] })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch'
        setKbGoogleDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
    refetchInterval: hasActive ? 5000 : false,
  })

  const changeDocuments = useMutation({
    mutationFn: (payload: { id?: string; ids?: string[]; action: 'skip' | 'retry' }) => patchKBGoogleDriveDocuments(payload),
    onMutate: () => {
      setKbGoogleDrive({ status: 'loading', statusTitle: 'Updating...' })
    },
    onSuccess: () => {
      setKbGoogleDrive({ status: 'success', statusTitle: 'Updated' })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to update'
      setKbGoogleDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeDocuments = useMutation({
    mutationFn: (id: string) => deleteKBGoogleDriveDocumentsId(id),
    onMutate: () => {
      setKbGoogleDrive({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setKbGoogleDrive({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setKbGoogleDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeDocumentsBulk = useMutation({
    mutationFn: (payload: { ids?: string[]; all?: boolean }) => deleteKBGoogleDriveDocumentsBulk(payload),
    onMutate: () => {
      setKbGoogleDrive({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setKbGoogleDrive({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setKbGoogleDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const storeKbGoogleDriveSync = useMutation({
    mutationFn: (payload: { action: string }) => postKBGoogleDriveSync(payload),
    onMutate: () => {
      setKbGoogleDrive({ status: 'loading', statusTitle: 'Syncing...' })
    },
    onSuccess: () => {
      setKbGoogleDrive({ status: 'success', statusTitle: 'Synced' })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to sync'
      setKbGoogleDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  return {
    fetchDocuments,
    changeDocuments,
    removeDocuments,
    removeDocumentsBulk,
    storeKbGoogleDriveSync,
  }
}

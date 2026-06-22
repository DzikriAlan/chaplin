import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKBGoogleDriveDocuments,
  deleteKBGoogleDriveDocumentsId,
  deleteKBGoogleDriveDocumentsBulk,
  patchKBGoogleDriveDocuments,
  postKBGoogleDriveSync,
} from '../services/knowledgeBaseGoogleDriveServices'

export const useDocumentsControllers = () => {
  const queryClient = useQueryClient()

  const docs = queryClient.getQueryData<{ status: string }[]>(['documents']) ?? []
  const hasActive = docs.some((d) => d.status === 'PENDING' || d.status === 'PROCESSING')

  const fetchDocuments = useQuery({
    queryKey: ['documents'],
    queryFn: getKBGoogleDriveDocuments,
    refetchInterval: hasActive ? 5000 : false,
  })

  const changeDocuments = useMutation({
    mutationFn: (payload: { id?: string; ids?: string[]; action: 'skip' | 'retry' }) => patchKBGoogleDriveDocuments(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const removeDocuments = useMutation({
    mutationFn: (id: string) => deleteKBGoogleDriveDocumentsId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const removeDocumentsBulk = useMutation({
    mutationFn: (payload: { ids?: string[]; all?: boolean }) => deleteKBGoogleDriveDocumentsBulk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const storeDocumentsSync = useMutation({
    mutationFn: (payload: { action: string }) => postKBGoogleDriveSync(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  return {
    fetchDocuments,
    changeDocuments,
    removeDocuments,
    removeDocumentsBulk,
    storeDocumentsSync,
  }
}

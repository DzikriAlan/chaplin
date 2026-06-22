import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUploadFolders,
  postUploadFolder,
  deleteUploadFolder,
  postSignedUrl,
  deleteUploadFile,
} from '../services/knowledgeBaseMyDriveServices'
import type { PayloadPostUploadFolder, PayloadPostSignedUrl } from '../types/knowledgeBaseMyDriveTypes'

const QUERY_KEY = 'upload-folders'

export const useFileUploadControllers = () => {
  const queryClient = useQueryClient()

  const fetchUploadFolders = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getUploadFolders(),
  })

  const storeUploadFolder = useMutation({
    mutationFn: (payload: PayloadPostUploadFolder) => postUploadFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const removeUploadFolder = useMutation({
    mutationFn: (id: string) => deleteUploadFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const storeSignedUrl = useMutation({
    mutationFn: (payload: PayloadPostSignedUrl) => postSignedUrl(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const removeUploadFile = useMutation({
    mutationFn: (id: string) => deleteUploadFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    fetchUploadFolders,
    storeUploadFolder,
    removeUploadFolder,
    storeSignedUrl,
    removeUploadFile,
  }
}

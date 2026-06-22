import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKBMyDriveFolders,
  postKBMyDriveFolders,
  deleteKBMyDriveFolders,
  postKBMyDriveSignedUrl,
  deleteKBMyDriveFiles,
} from '../services/knowledgeBaseMyDriveServices'
import type { PayloadPostUploadFolder, PayloadPostSignedUrl } from '../types/knowledgeBaseMyDriveTypes'

const QUERY_KEY = 'upload-folders'

export const useFileUploadControllers = () => {
  const queryClient = useQueryClient()

  const fetchUploadFolders = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getKBMyDriveFolders(),
  })

  const storeUploadFolder = useMutation({
    mutationFn: (payload: PayloadPostUploadFolder) => postKBMyDriveFolders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const removeUploadFolder = useMutation({
    mutationFn: (id: string) => deleteKBMyDriveFolders(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const storeSignedUrl = useMutation({
    mutationFn: (payload: PayloadPostSignedUrl) => postKBMyDriveSignedUrl(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const removeUploadFile = useMutation({
    mutationFn: (id: string) => deleteKBMyDriveFiles(id),
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKbMyDriveStates } from '../states/knowledgeBaseMyDriveStates'
import {
  getKBMyDriveFolders,
  postKBMyDriveFolders,
  deleteKBMyDriveFolders,
  postKBMyDriveSignedUrl,
  deleteKBMyDriveFiles,
} from '../services/knowledgeBaseMyDriveServices'
import type { PayloadPostKbMyDriveFolder, PayloadPostKbMyDriveSignedUrl } from '../types/knowledgeBaseMyDriveTypes'

const QUERY_KEY = 'upload-folders'

export const useKBMyDriveControllers = () => {
  const queryClient = useQueryClient()
  const { setKbMyDrive } = useKbMyDriveStates()

  const fetchUploadFolders = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      setKbMyDrive({ status: 'loading' })
      try {
        const data = await getKBMyDriveFolders()
        setKbMyDrive({ status: 'success', statusTitle: 'Success', data })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch'
        setKbMyDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  const storeUploadFolder = useMutation({
    mutationFn: (payload: PayloadPostKbMyDriveFolder) => postKBMyDriveFolders(payload),
    onMutate: () => {
      setKbMyDrive({ status: 'loading', statusTitle: 'Creating...' })
    },
    onSuccess: () => {
      setKbMyDrive({ status: 'success', statusTitle: 'Created' })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to create'
      setKbMyDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeUploadFolder = useMutation({
    mutationFn: (id: string) => deleteKBMyDriveFolders(id),
    onMutate: () => {
      setKbMyDrive({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setKbMyDrive({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setKbMyDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const storeSignedUrl = useMutation({
    mutationFn: (payload: PayloadPostKbMyDriveSignedUrl) => postKBMyDriveSignedUrl(payload),
    onMutate: () => {
      setKbMyDrive({ status: 'loading', statusTitle: 'Uploading...' })
    },
    onSuccess: () => {
      setKbMyDrive({ status: 'success', statusTitle: 'Uploaded' })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to upload'
      setKbMyDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeUploadFile = useMutation({
    mutationFn: (id: string) => deleteKBMyDriveFiles(id),
    onMutate: () => {
      setKbMyDrive({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setKbMyDrive({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setKbMyDrive({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
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

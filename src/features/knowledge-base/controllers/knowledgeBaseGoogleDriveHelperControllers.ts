import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getKBGoogleDriveFolders, postKBGoogleDriveFolders, getKBGoogleDriveConfig, deleteKBGoogleDriveConfig } from '../services/knowledgeBaseGoogleDriveHelperServices'
import type { PayloadPostDriveFolders } from '../types/knowledgeBaseGoogleDriveHelperTypes'

export const useKBGoogleDriveHelperControllers = (enabled = false) => {
  const queryClient = useQueryClient()

  const fetchDriveFolders = useQuery({
    queryKey: ['driveFolders'],
    queryFn: getKBGoogleDriveFolders,
    enabled,
  })

  const fetchDriveConfig = useQuery({
    queryKey: ['driveConfig'],
    queryFn: getKBGoogleDriveConfig,
  })

  const storeDriveFolders = useMutation({
    mutationFn: (payload: PayloadPostDriveFolders) => postKBGoogleDriveFolders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['driveConfig'] })
    },
  })

  const removeDriveConfig = useMutation({
    mutationFn: deleteKBGoogleDriveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['driveConfig'] })
    },
  })

  return { fetchDriveFolders, fetchDriveConfig, storeDriveFolders, removeDriveConfig }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDriveFolders, postDriveFolders, getDriveConfig, deleteDriveConfig } from '../services/driveServices'
import type { PayloadPostDriveFolders } from '../types/driveTypes'

export const useDriveControllers = (enabled = false) => {
  const queryClient = useQueryClient()

  const fetchDriveFolders = useQuery({
    queryKey: ['driveFolders'],
    queryFn: getDriveFolders,
    enabled,
  })

  const fetchDriveConfig = useQuery({
    queryKey: ['driveConfig'],
    queryFn: getDriveConfig,
  })

  const storeDriveFolders = useMutation({
    mutationFn: (payload: PayloadPostDriveFolders) => postDriveFolders(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['driveConfig'] })
    },
  })

  const removeDriveConfig = useMutation({
    mutationFn: deleteDriveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['driveConfig'] })
    },
  })

  return { fetchDriveFolders, fetchDriveConfig, storeDriveFolders, removeDriveConfig }
}

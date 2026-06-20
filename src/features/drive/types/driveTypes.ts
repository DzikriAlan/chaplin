export interface PayloadPostDriveFolders {
  folderId: string
  folderName: string
}

export interface DataDriveFolders {
  id: string
  name: string
}

export interface DriveFolders {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataDriveFolders[] | null
}

export interface DataDriveConfig {
  id: string
  folderId: string
  folderName: string | null
  lastSyncAt: string | null
}

export interface DriveConfig {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataDriveConfig | null
}

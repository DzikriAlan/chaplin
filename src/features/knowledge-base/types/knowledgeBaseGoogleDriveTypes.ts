export interface DataKbGoogleDrive {
  id: string
  title: string
  mimeType: string
  driveId: string
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'
  createdAt: string
  updatedAt: string
  _count: { chunks: number }
}

export interface KbGoogleDrive {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKbGoogleDrive[] | null
}

export interface DataKbGoogleDriveSync {
  added?: number
  total?: number
  processed?: string
  chunks?: number
  done?: boolean
  message?: string
  error?: string
}

export interface KbGoogleDriveSync {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKbGoogleDriveSync | null
}

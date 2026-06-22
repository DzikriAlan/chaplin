export interface DataKbMyDriveFile {
  id: string
  name: string
  size: number
  mimeType: string
  storagePath: string
  folderId: string | null
  createdAt: string
  updatedAt: string
}

export interface DataKbMyDriveFolder {
  id: string
  name: string
  parentId: string | null
  children: DataKbMyDriveFolder[]
  files: DataKbMyDriveFile[]
  createdAt: string
  updatedAt: string
}

export interface PayloadPostKbMyDriveFolder {
  name: string
  parentId?: string
}

export interface PayloadPostKbMyDriveSignedUrl {
  fileName: string
  mimeType: string
  size: number
  folderId?: string
}

export interface DataKbMyDriveSignedUrl {
  signedUrl: string
  token: string
  path: string
  fileId: string
}

export interface KbMyDrive {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKbMyDriveFolder[] | null
}

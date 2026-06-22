export interface DataUploadFile {
  id: string
  name: string
  size: number
  mimeType: string
  storagePath: string
  folderId: string | null
  createdAt: string
  updatedAt: string
}

export interface DataUploadFolder {
  id: string
  name: string
  parentId: string | null
  children: DataUploadFolder[]
  files: DataUploadFile[]
  createdAt: string
  updatedAt: string
}

export interface PayloadPostUploadFolder {
  name: string
  parentId?: string
}

export interface PayloadPostSignedUrl {
  fileName: string
  mimeType: string
  size: number
  folderId?: string
}

export interface DataSignedUrl {
  signedUrl: string
  token: string
  path: string
  fileId: string
}

export interface UploadFolders {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataUploadFolder[] | null
}

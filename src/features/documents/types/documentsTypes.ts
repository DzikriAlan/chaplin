export interface DataDocuments {
  id: string
  title: string
  mimeType: string
  driveId: string
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'
  createdAt: string
  updatedAt: string
  _count: { chunks: number }
}

export interface Documents {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataDocuments[] | null
}

export interface DataDocumentsSync {
  added?: number
  total?: number
  processed?: string
  chunks?: number
  done?: boolean
  message?: string
  error?: string
}

export interface DocumentsSync {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataDocumentsSync | null
}

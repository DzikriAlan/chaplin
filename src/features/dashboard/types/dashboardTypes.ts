export interface DataDashboard {
  documentCount: number
  chunkCount: number
  chatCount: number
  questionCount: number
  knowledgeCount: number
}

export interface Dashboard {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataDashboard | null
}

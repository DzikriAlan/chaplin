export interface PayloadPostChat {
  message: string
  sessionId: string
  agentId?: string
}

export interface DataChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export interface Chat {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataChatMessage[] | null
}

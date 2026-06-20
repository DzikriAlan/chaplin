export interface PayloadPostChat {
  message: string
  sessionId: string
  docs?: string[]
  files?: Array<{
    name: string
    type: string
    size: number
    base64: string
  }>
}

export interface DataChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  sources: { content: string; metadata: Record<string, unknown> }[] | null
  createdAt: string
}

export interface DataChatResponse {
  answer: string
  sources: { content: string; metadata: Record<string, unknown> }[]
}

export interface Chat {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataChatMessage[] | null
}

export interface ChatSend {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataChatResponse | null
}

export interface DataChatSessions {
  sessionId: string
  lastMessage: string
  lastRole: string
  messageCount: number
  lastActivity: string
  title: string | null
}

export interface ChatSessions {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataChatSessions[] | null
}

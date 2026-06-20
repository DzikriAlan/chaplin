export interface PayloadPostKnowledgeBase {
  question: string
  answer: string
  tags: string[]
}

export interface DataKnowledgeBase {
  id: string
  question: string
  answer: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface KnowledgeBase {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKnowledgeBase[] | null
}

export interface KnowledgeBaseCreate {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKnowledgeBase | null
}

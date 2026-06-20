export interface PayloadPostFaqManager {
  question: string
  answer: string
}

export interface DataFaqManager {
  id: string
  userId: string
  question: string
  answer: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FaqManager {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataFaqManager[] | null
}

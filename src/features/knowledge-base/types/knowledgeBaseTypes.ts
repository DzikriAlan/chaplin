export interface PayloadPostKbFaq {
  question: string
  answer: string
  tags: string[]
}

export interface DataKbFaq {
  id: string
  question: string
  answer: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface KbFaq {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKbFaq[] | null
}

export interface KbFaqCreate {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataKbFaq | null
}

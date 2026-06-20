export interface PayloadPostQuestionsGenerate {
  topic: string
  count: number
  type: string
  gradeLevel: string
}

export interface DataQuestionsGenerate {
  id: string
  topic: string
  type: string
  question: string
  options: string[] | null
  answer: string
  discussion: string | null
  createdAt: string
}

export interface QuestionsGenerate {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataQuestionsGenerate[] | null
}

export interface DataQuestions {
  id: string
  topic: string
  type: string
  question: string
  options: string[] | null
  answer: string
  discussion: string | null
  createdAt: string
}

export interface Questions {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataQuestions[] | null
}

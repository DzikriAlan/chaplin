export interface PayloadPostTopicAnalytics {
  id: number
  range: string
  version: string
  source: string[]
  sentiment: string[]
}

export interface DataTopicAnalytics {
  id: string
}

export interface TopicAnalytics {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataTopicAnalytics | null
}

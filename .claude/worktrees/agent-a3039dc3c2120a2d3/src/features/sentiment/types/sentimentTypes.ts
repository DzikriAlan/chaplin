export interface PayloadPostSentimentAnalytics {
  id: number
  range: string
  time: string
  tokoh: string[]
  organisasi: string[]
  media_category_name: string
  clipping_category_name: string
  keyword: string
  kategori: string[]
  sentiment: string[]
  aspek: string[]
  source: string[]
  lang: string
  tier: string[]
  keyword_global: string
  show_all: boolean
  search: string
  debug: boolean
}

export interface DataSentimentAnalytics {
  id: string
}

export interface SentimentAnalytics {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataSentimentAnalytics | null
}

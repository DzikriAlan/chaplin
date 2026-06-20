export interface PayloadPostExtractionMap {
  id: number
  range: string
  sentiment: string[]
  source: string[]
  lang: string[]
  color_type: string
  type: string
  level: string
  topik_id: string
}

export interface DataExtractionMap {
  id: string
}

export interface ExtractionMap {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataExtractionMap | null
}

export interface PayloadPostIssuesMap {
  id: number
  range: string
  sentiment: string[]
  source: string[]
  color_type: string
  type: string
  level: string
}

export interface DataIssuesMap {
  id: string
}

export interface IssuesMap {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataIssuesMap | null
}

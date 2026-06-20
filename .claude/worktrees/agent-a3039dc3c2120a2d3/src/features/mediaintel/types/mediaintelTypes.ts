export interface PayloadPostMediaintelTopikTimeline {
  id: number
  range: string
  time: string
  sentiment: string[]
  keyword: string
  tokoh: string[]
  organisasi: string[]
  sort: Record<string, string>[]
  max: number
  page: number
  source: string[]
}

export interface DataMediaintelTopikTimeline {
  id: string
}

export interface MediaintelTopikTimeline {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTimeline | null
}

export interface PayloadPostMediaintelTopikStatementPerson {
  id: number
  range: string
  time: string
  sentiment: string[]
  sentiment_statement: string[]
  speakers: string[]
  quote: string
  source: string[]
  page: number
  max: number
}

export interface DataMediaintelTopikStatementPerson {
  id: string
}

export interface MediaintelTopikStatementPerson {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikStatementPerson | null
}

export interface PayloadPostMediaintelTopikTopIssues {
  id: number
  range: string
  time: string
  sentiment: string[]
  source: string[]
  format: string
}

export interface DataMediaintelTopikTopIssues {
  id: string
}

export interface MediaintelTopikTopIssues {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTopIssues | null
}

export interface PayloadPostMediaintelTopikTopScore {
  id: number
  range: string
  score_query: string
  source: string[]
  sentiment: string[]
}

export interface DataMediaintelTopikTopScore {
  id: string
}

export interface MediaintelTopikTopScore {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTopScore | null
}

export interface PayloadPostMediaintelTopikTopVersion {
  id: number
  range: string
  version: string
  source: string[]
  sentiment: string[]
  tier: string | null
  max: number
}

export interface DataMediaintelTopikTopVersion {
  id: string
}

export interface MediaintelTopikTopVersion {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTopVersion | null
}

export interface PayloadPostMediaintelComparationDashboardChartCombine {
  id: string
  range: string
  source: string[]
  time: string
  show_all: boolean
}

export interface DataMediaintelComparationDashboardChartCombine {
  id: string
}

export interface MediaintelComparationDashboardChartCombine {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelComparationDashboardChartCombine | null
}

export interface PayloadPostMediaintelTopikEkstraksiTimelineMatched {
  id: string
  range: string
  time: string
  source: string[]
  sentiment: string[]
  search: string
  max: number
  limit: number
  page: number
  sort: Record<string, string>[]
  lang: string[]
}

export interface DataMediaintelTopikEkstraksiTimelineMatched {
  id: string
}

export interface MediaintelTopikEkstraksiTimelineMatched {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikEkstraksiTimelineMatched | null
}

export interface PayloadPostMediaintelComparationDashboardMap {
  id: number
  keyword: string
  range: string
  source: string[]
  lang: string[]
  time: string
}

export interface DataMediaintelComparationDashboardMap {
  id: string
}

export interface MediaintelComparationDashboardMap {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelComparationDashboardMap | null
}

export interface PayloadPostMediaintelTopikTopAccount {
  id: number
  range: string
  time: string
  tokoh: string[]
  organisasi: string[]
  keyword: string
  kategori: string[]
  sentiment: string[]
  aspek: string[]
  source: string[]
  lang: string[]
  keyword_global: string
  show: string[]
  version: string
}

export interface DataMediaintelTopikTopAccount {
  id: string
}

export interface MediaintelTopikTopAccount {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTopAccount | null
}

export interface PayloadPostMediaintelTopikTopMedia {
  id: number
  range: string
  time: string
  tokoh: string[]
  organisasi: string[]
  keyword: string
  kategori: string[]
  sentiment: string[]
  aspek: string[]
  source: string[]
  lang: string[]
  keyword_global: string
}

export interface DataMediaintelTopikTopMedia {
  id: string
}

export interface MediaintelTopikTopMedia {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataMediaintelTopikTopMedia | null
}

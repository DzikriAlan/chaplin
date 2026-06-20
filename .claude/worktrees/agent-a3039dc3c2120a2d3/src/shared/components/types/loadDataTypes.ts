export interface LoadDataResponse {
  data?: unknown
  isLoading?: boolean
  isError?: boolean
  isEmpty?: boolean
  isNoVerified?: boolean
  errorTitle?: string
  errorSubtitle?: string
  errorImage?: string
  emptyTitle?: string
  emptySubtitle?: string
  emptyImage?: string
  noVerifiedTitle?: string
  noVerifiedSubtitle?: string
  noVerifiedImage?: string
}

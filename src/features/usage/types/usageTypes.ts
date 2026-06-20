export interface PayloadGetUsage {
  limit?: string
  offset?: string
  month?: string
  year?: string
}

export interface DataUsage {
  id: string
  userId: string
  activityType: string
  senderName: string | null
  deduction: number
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

export interface DataUsageList {
  logs: DataUsage[]
  total: number
  limit: number
  offset: number
}

export interface Usage {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataUsageList | null
}

// ─── Balance Types ─────────────────────────────────────────────────────────

export interface DataUsageSaldoBalance {
  id: string
  userId: string
  balance: number
  fileSizeBytes: number
  plan: string
  createdAt: string
  updatedAt: string
}

export interface UsageSaldoBalance {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataUsageSaldoBalance | null
}

export interface PayloadPostUsageSaldoTopup {
  amount: number
}

export interface DataUsageSaldoTopup {
  id: string
  userId: string
  balance: number
  updatedAt: string
}

export interface UsageSaldoTopup {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataUsageSaldoTopup | null
}

// ─── Usage Types ───────────────────────────────────────────────────────────

export interface PayloadGetUsageSaldoLogs {
  limit?: string
  offset?: string
  month?: string
  year?: string
}

export interface DataUsageSaldoLog {
  id: string
  userId: string
  activityType: string
  senderName: string | null
  deduction: number
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

export interface DataUsageSaldoLogList {
  logs: DataUsageSaldoLog[]
  total: number
  limit: number
  offset: number
}

export interface UsageSaldoLogs {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataUsageSaldoLogList | null
}

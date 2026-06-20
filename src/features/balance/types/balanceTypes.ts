export interface DataBalance {
  id: string
  userId: string
  balance: number
  fileSizeBytes: number
  plan: string
  createdAt: string
  updatedAt: string
}

export interface Balance {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataBalance | null
}

export interface PayloadPostBalance {
  amount: number
}

export interface DataBalanceTopup {
  id: string
  userId: string
  balance: number
  updatedAt: string
}

export interface BalanceTopup {
  status: string
  statusTitle: string
  statusSubtitle: string
  data: DataBalanceTopup | null
}

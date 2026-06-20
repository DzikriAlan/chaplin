import { create } from 'zustand'
import type { Usage, PayloadGetUsage } from '../types/usageTypes'

interface UsageStore {
  usage: Usage
  payloadGetUsage: PayloadGetUsage
  setGetUsage: (payload: Partial<PayloadGetUsage>) => void
}

export const useUsageStates = create<UsageStore>((set) => ({
  usage: {
    status: 'loading',
    statusTitle: 'Memuat riwayat...',
    statusSubtitle: 'Mohon tunggu sebentar.',
    data: null,
  },
  payloadGetUsage: {
    limit: '100',
    offset: '0',
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  },
  setGetUsage: (payload) =>
    set((state) => ({
      payloadGetUsage: { ...state.payloadGetUsage, ...payload },
    })),
}))

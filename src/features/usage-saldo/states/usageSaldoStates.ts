import { create } from 'zustand'
import type {
  UsageSaldoBalance,
  UsageSaldoTopup,
  UsageSaldoLogs,
  PayloadPostUsageSaldoTopup,
  PayloadGetUsageSaldoLogs,
} from '../types/usageSaldoTypes'

interface UsageSaldoStore {
  // Balance state
  balance: UsageSaldoBalance
  balanceTopup: UsageSaldoTopup
  payloadPostTopup: PayloadPostUsageSaldoTopup
  setPostTopup: (payload: Partial<PayloadPostUsageSaldoTopup>) => void
  // Usage state
  usageLogs: UsageSaldoLogs
  payloadGetLogs: PayloadGetUsageSaldoLogs
  setGetLogs: (payload: Partial<PayloadGetUsageSaldoLogs>) => void
}

export const useUsageSaldoStates = create<UsageSaldoStore>((set) => ({
  // Balance state
  balance: {
    status: 'loading',
    statusTitle: 'Memuat saldo...',
    statusSubtitle: 'Mohon tunggu sebentar.',
    data: null,
  },
  balanceTopup: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  payloadPostTopup: {
    amount: 0,
  },
  setPostTopup: (payload) =>
    set((state) => ({
      payloadPostTopup: { ...state.payloadPostTopup, ...payload },
    })),
  // Usage state
  usageLogs: {
    status: 'loading',
    statusTitle: 'Memuat riwayat...',
    statusSubtitle: 'Mohon tunggu sebentar.',
    data: null,
  },
  payloadGetLogs: {
    limit: '100',
    offset: '0',
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  },
  setGetLogs: (payload) =>
    set((state) => ({
      payloadGetLogs: { ...state.payloadGetLogs, ...payload },
    })),
}))

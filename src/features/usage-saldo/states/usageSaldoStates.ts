import { create } from 'zustand'
import type {
  UsageSaldoBalance,
  UsageSaldoTopup,
  UsageSaldoLogs,
  PayloadPostUsageSaldoTopup,
  PayloadGetUsageSaldoLogs,
} from '../types/usageSaldoTypes'

interface UsageSaldoStore {
  balance: UsageSaldoBalance
  balanceTopup: UsageSaldoTopup
  usageLogs: UsageSaldoLogs
  payloadPostTopup: PayloadPostUsageSaldoTopup
  payloadGetLogs: PayloadGetUsageSaldoLogs

  setBalance: (payload: Partial<UsageSaldoBalance>) => void
  setBalanceTopup: (payload: Partial<UsageSaldoTopup>) => void
  setUsageLogs: (payload: Partial<UsageSaldoLogs>) => void
  setPostTopup: (payload: Partial<PayloadPostUsageSaldoTopup>) => void
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

  setBalance: (payload: Partial<UsageSaldoBalance>) =>
    set((state) => ({
      balance: { ...state.balance, ...payload },
    })),

  setBalanceTopup: (payload: Partial<UsageSaldoTopup>) =>
    set((state) => ({
      balanceTopup: { ...state.balanceTopup, ...payload },
    })),

  setUsageLogs: (payload: Partial<UsageSaldoLogs>) =>
    set((state) => ({
      usageLogs: { ...state.usageLogs, ...payload },
    })),

  setPostTopup: (payload: Partial<PayloadPostUsageSaldoTopup>) =>
    set((state) => ({
      payloadPostTopup: { ...state.payloadPostTopup, ...payload },
    })),

  setGetLogs: (payload: Partial<PayloadGetUsageSaldoLogs>) =>
    set((state) => ({
      payloadGetLogs: { ...state.payloadGetLogs, ...payload },
    })),
}))

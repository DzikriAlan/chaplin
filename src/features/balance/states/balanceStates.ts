import { create } from 'zustand'
import type { Balance, BalanceTopup, PayloadPostBalance } from '../types/balanceTypes'

interface BalanceStore {
  balance: Balance
  balanceTopup: BalanceTopup
  payloadPostBalance: PayloadPostBalance
  setPostBalance: (payload: Partial<PayloadPostBalance>) => void
}

export const useBalanceStates = create<BalanceStore>((set) => ({
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
  payloadPostBalance: {
    amount: 0,
  },
  setPostBalance: (payload) =>
    set((state) => ({
      payloadPostBalance: { ...state.payloadPostBalance, ...payload },
    })),
}))

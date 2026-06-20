import { create } from 'zustand'
import type { FaqManager, PayloadPostFaqManager } from '../types/faqManagerTypes'

interface FaqManagerStore {
  faqManager: FaqManager
  payloadPostFaqManager: PayloadPostFaqManager
  setPostFaqManager: (payload: Partial<PayloadPostFaqManager>) => void
}

export const useFaqManagerStates = create<FaqManagerStore>((set) => ({
  faqManager: {
    status: 'loading',
    statusTitle: 'Memuat FAQ...',
    statusSubtitle: 'Mohon tunggu sebentar.',
    data: null,
  },
  payloadPostFaqManager: {
    question: '',
    answer: '',
  },
  setPostFaqManager: (payload) =>
    set((state) => ({
      payloadPostFaqManager: { ...state.payloadPostFaqManager, ...payload },
    })),
}))

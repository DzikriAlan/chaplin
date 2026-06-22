import { create } from 'zustand'
import type { PayloadPostKbFaq, KbFaq, KbFaqCreate } from '../types/knowledgeBaseTypes'

interface KbFaqStore {
  payloadPostKbFaq: PayloadPostKbFaq
  kbFaq: KbFaq
  kbFaqCreate: KbFaqCreate
  setPostKbFaq: (payload: Partial<PayloadPostKbFaq>) => void
}

export const useKbFaqStates = create<KbFaqStore>((set) => ({
  payloadPostKbFaq: {
    question: '',
    answer: '',
    tags: [],
  },

  kbFaq: {
    status: 'loading',
    statusTitle: 'Memuat knowledge base',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  kbFaqCreate: {
    status: 'loading',
    statusTitle: 'Menyimpan',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setPostKbFaq: (payload) =>
    set((state) => ({
      payloadPostKbFaq: { ...state.payloadPostKbFaq, ...payload },
    })),
}))

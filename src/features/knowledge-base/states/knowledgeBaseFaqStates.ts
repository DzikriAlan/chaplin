import { create } from 'zustand'
import type { PayloadPostKbFaq, KbFaq, KbFaqCreate } from '../types/knowledgeBaseFaqTypes'

interface KbFaqStore {
  payloadPostKbFaq: PayloadPostKbFaq
  kbFaq: KbFaq
  kbFaqCreate: KbFaqCreate
  setPayloadPostKbFaq: (payload: Partial<PayloadPostKbFaq>) => void
  setKbFaq: (payload: Partial<KbFaq>) => void
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

  setPayloadPostKbFaq: (payload: Partial<PayloadPostKbFaq>) =>
    set((state) => ({
      payloadPostKbFaq: { ...state.payloadPostKbFaq, ...payload },
    })),

  setKbFaq: (payload: Partial<KbFaq>) =>
    set((state) => ({
      kbFaq: { ...state.kbFaq, ...payload },
    })),
}))

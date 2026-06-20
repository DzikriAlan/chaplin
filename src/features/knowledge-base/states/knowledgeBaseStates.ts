import { create } from 'zustand'
import type { PayloadPostKnowledgeBase, KnowledgeBase, KnowledgeBaseCreate } from '../types/knowledgeBaseTypes'

interface KnowledgeBaseStore {
  payloadPostKnowledgeBase: PayloadPostKnowledgeBase
  knowledgeBase: KnowledgeBase
  knowledgeBaseCreate: KnowledgeBaseCreate
  setPostKnowledgeBase: (payload: Partial<PayloadPostKnowledgeBase>) => void
}

export const useKnowledgeBaseStates = create<KnowledgeBaseStore>((set) => ({
  payloadPostKnowledgeBase: {
    question: '',
    answer: '',
    tags: [],
  },

  knowledgeBase: {
    status: 'loading',
    statusTitle: 'Memuat knowledge base',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  knowledgeBaseCreate: {
    status: 'loading',
    statusTitle: 'Menyimpan',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setPostKnowledgeBase: (payload) =>
    set((state) => ({
      payloadPostKnowledgeBase: { ...state.payloadPostKnowledgeBase, ...payload },
    })),
}))

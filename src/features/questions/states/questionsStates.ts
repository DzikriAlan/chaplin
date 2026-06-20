import { create } from 'zustand'
import type { PayloadPostQuestionsGenerate, Questions, QuestionsGenerate } from '../types/questionsTypes'

interface QuestionsStore {
  payloadPostQuestionsGenerate: PayloadPostQuestionsGenerate
  questions: Questions
  questionsGenerate: QuestionsGenerate
  setPostQuestionsGenerate: (payload: Partial<PayloadPostQuestionsGenerate>) => void
}

export const useQuestionsStates = create<QuestionsStore>((set) => ({
  payloadPostQuestionsGenerate: {
    topic: '',
    count: 10,
    type: 'multiple_choice',
    gradeLevel: '',
  },

  questions: {
    status: 'loading',
    statusTitle: 'Memuat soal',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  questionsGenerate: {
    status: 'loading',
    statusTitle: 'Membuat soal',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setPostQuestionsGenerate: (payload) =>
    set((state) => ({
      payloadPostQuestionsGenerate: { ...state.payloadPostQuestionsGenerate, ...payload },
    })),
}))

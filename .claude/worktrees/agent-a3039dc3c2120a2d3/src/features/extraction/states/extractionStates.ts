import { create } from 'zustand'
import type { PayloadPostExtractionMap, ExtractionMap } from '../types/extractionTypes'

interface ExtractionStore {
  payloadPostExtractionMap: PayloadPostExtractionMap
  extractionMap: ExtractionMap
  setPostExtractionMap: (payload: Partial<PayloadPostExtractionMap>) => void
}

export const useExtractionStates = create<ExtractionStore>((set) => ({
  payloadPostExtractionMap: {
    id: 0,
    range: '',
    sentiment: [],
    source: [],
    lang: [],
    color_type: '',
    type: '',
    level: '',
    topik_id: '',
  },
  extractionMap: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostExtractionMap: (payload) =>
    set((state) => ({
      payloadPostExtractionMap: { ...state.payloadPostExtractionMap, ...payload },
    })),
}))

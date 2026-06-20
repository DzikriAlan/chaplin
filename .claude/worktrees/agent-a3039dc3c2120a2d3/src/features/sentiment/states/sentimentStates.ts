import { create } from 'zustand'
import type { PayloadPostSentimentAnalytics, SentimentAnalytics } from '../types/sentimentTypes'

interface SentimentStore {
  payloadPostSentimentAnalytics: PayloadPostSentimentAnalytics
  sentimentAnalytics: SentimentAnalytics
  setPostSentimentAnalytics: (payload: Partial<PayloadPostSentimentAnalytics>) => void
}

export const useSentimentStates = create<SentimentStore>((set) => ({
  payloadPostSentimentAnalytics: {
    id: 0,
    range: '',
    time: '',
    tokoh: [],
    organisasi: [],
    media_category_name: '',
    clipping_category_name: '',
    keyword: '',
    kategori: [],
    sentiment: [],
    aspek: [],
    source: [],
    lang: '',
    tier: [],
    keyword_global: '',
    show_all: false,
    search: '',
    debug: false,
  },
  sentimentAnalytics: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostSentimentAnalytics: (payload) =>
    set((state) => ({
      payloadPostSentimentAnalytics: { ...state.payloadPostSentimentAnalytics, ...payload },
    })),
}))

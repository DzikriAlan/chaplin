import { create } from 'zustand'
import type { PayloadPostTopicAnalytics, TopicAnalytics } from '../types/topicTypes'

interface TopicStore {
  payloadPostTopicAnalytics: PayloadPostTopicAnalytics
  topicAnalytics: TopicAnalytics
  setPostTopicAnalytics: (payload: Partial<PayloadPostTopicAnalytics>) => void
}

export const useTopicStates = create<TopicStore>((set) => ({
  payloadPostTopicAnalytics: {
    id: 0,
    range: '',
    version: '',
    source: [],
    sentiment: [],
  },
  topicAnalytics: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostTopicAnalytics: (payload) =>
    set((state) => ({
      payloadPostTopicAnalytics: { ...state.payloadPostTopicAnalytics, ...payload },
    })),
}))

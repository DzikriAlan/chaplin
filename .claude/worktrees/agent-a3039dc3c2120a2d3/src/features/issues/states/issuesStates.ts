import { create } from 'zustand'
import type { PayloadPostIssuesMap, IssuesMap } from '../types/issuesTypes'

interface IssuesStore {
  payloadPostIssuesMap: PayloadPostIssuesMap
  issuesMap: IssuesMap
  setPostIssuesMap: (payload: Partial<PayloadPostIssuesMap>) => void
}

export const useIssuesStates = create<IssuesStore>((set) => ({
  payloadPostIssuesMap: {
    id: 0,
    range: '',
    sentiment: [],
    source: [],
    color_type: '',
    type: '',
    level: '',
  },
  issuesMap: {
    status: 'loading',
    statusTitle: 'Something went wrong',
    statusSubtitle: 'Please try again later.',
    data: null,
  },
  setPostIssuesMap: (payload) =>
    set((state) => ({
      payloadPostIssuesMap: { ...state.payloadPostIssuesMap, ...payload },
    })),
}))

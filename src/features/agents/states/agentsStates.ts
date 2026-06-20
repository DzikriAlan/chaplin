import { create } from 'zustand'
import type { PayloadPostAgent, AgentsList, AgentCreate } from '../types/agentsTypes'

interface AgentsStore {
  payloadPostAgent: PayloadPostAgent
  agentsList: AgentsList
  agentCreate: AgentCreate
  setPostAgent: (payload: Partial<PayloadPostAgent>) => void
}

export const useAgentsStates = create<AgentsStore>((set) => ({
  payloadPostAgent: {
    name: '',
    image: '',
    personalization: '',
    knowledgeBaseIds: [],
    isDefault: false,
  },

  agentsList: {
    status: 'loading',
    statusTitle: 'Memuat agents',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  agentCreate: {
    status: 'loading',
    statusTitle: 'Menyimpan',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setPostAgent: (payload) =>
    set((state) => ({
      payloadPostAgent: { ...state.payloadPostAgent, ...payload },
    })),
}))

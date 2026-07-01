import { create } from 'zustand'
import type { PayloadPostAgent, AgentsList, AgentCreate } from '../types/agentsTypes'

interface AgentsStore {
  payloadPostAgent: PayloadPostAgent
  agentsList: AgentsList
  agentCreate: AgentCreate

  setPostAgent: (payload: Partial<PayloadPostAgent>) => void
  setAgentsList: (payload: Partial<AgentsList>) => void
  setAgentCreate: (payload: Partial<AgentCreate>) => void
}

export const useAgentsStates = create<AgentsStore>((set) => ({
  payloadPostAgent: {
    name: '',
    image: '',
    personalization: '',
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

  setPostAgent: (payload: Partial<PayloadPostAgent>) =>
    set((state) => ({
      payloadPostAgent: { ...state.payloadPostAgent, ...payload },
    })),

  setAgentsList: (payload: Partial<AgentsList>) =>
    set((state) => ({
      agentsList: { ...state.agentsList, ...payload },
    })),

  setAgentCreate: (payload: Partial<AgentCreate>) =>
    set((state) => ({
      agentCreate: { ...state.agentCreate, ...payload },
    })),
}))

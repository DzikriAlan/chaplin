import { create } from 'zustand'
import type { PayloadPostChat, Chat } from '../types/chatTypes'

interface ChatStore {
  payloadPostChat: PayloadPostChat
  chat: Chat

  setPayloadPostChat: (payload: Partial<PayloadPostChat>) => void
  setChat: (payload: Partial<Chat>) => void
}

export const useChatStates = create<ChatStore>((set) => ({
  payloadPostChat: {
    message: '',
    sessionId: '',
    agentId: '',
  },

  chat: {
    status: 'idle',
    statusTitle: '',
    statusSubtitle: '',
    data: null,
  },

  setPayloadPostChat: (payload: Partial<PayloadPostChat>) =>
    set((state) => ({
      payloadPostChat: { ...state.payloadPostChat, ...payload },
    })),

  setChat: (payload: Partial<Chat>) =>
    set((state) => ({
      chat: { ...state.chat, ...payload },
    })),
}))

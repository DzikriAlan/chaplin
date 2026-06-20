import { create } from 'zustand'
import type { PayloadPostChat, Chat, ChatSend } from '../types/chatTypes'

interface ChatStore {
  payloadPostChat: PayloadPostChat
  chat: Chat
  chatSend: ChatSend
  setPostChat: (payload: Partial<PayloadPostChat>) => void
}

export const useChatStates = create<ChatStore>((set) => ({
  payloadPostChat: {
    message: '',
    sessionId: '',
  },

  chat: {
    status: 'loading',
    statusTitle: 'Memuat percakapan',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  chatSend: {
    status: 'loading',
    statusTitle: 'Mengirim pesan',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setPostChat: (payload) =>
    set((state) => ({
      payloadPostChat: { ...state.payloadPostChat, ...payload },
    })),
}))

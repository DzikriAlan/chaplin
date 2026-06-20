import { create } from 'zustand'

function makeSessionId() {
  const uid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `session_${Date.now()}_${uid}`
}

interface UIStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  chatSessionId: string
  setChatSessionId: (id: string) => void
  newChatSession: () => void
  selectedAgentId: string | null
  setSelectedAgentId: (id: string | null) => void
  searchModalOpen: boolean
  setSearchModalOpen: (open: boolean) => void
}

export const useUIStates = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  chatSessionId: makeSessionId(),
  setChatSessionId: (id) => set({ chatSessionId: id }),
  newChatSession: () => set({ chatSessionId: makeSessionId() }),
  selectedAgentId: null,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  searchModalOpen: false,
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
}))

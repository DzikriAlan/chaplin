import { create } from 'zustand'
import type { KbMyDrive } from '../types/knowledgeBaseMyDriveTypes'

interface KbMyDriveStore {
  kbMyDrive: KbMyDrive
  selectedIds: Set<string>
  setSelectedIds: (ids: Set<string>) => void
  toggleSelected: (id: string) => void
  clearSelected: () => void
}

export const useKbMyDriveStates = create<KbMyDriveStore>((set) => ({
  kbMyDrive: {
    status: 'loading',
    statusTitle: 'Memuat file...',
    statusSubtitle: 'Harap tunggu.',
    data: null,
  },

  selectedIds: new Set<string>(),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  toggleSelected: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedIds: next }
    }),

  clearSelected: () => set({ selectedIds: new Set<string>() }),
}))

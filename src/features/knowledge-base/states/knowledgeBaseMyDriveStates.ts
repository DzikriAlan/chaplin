import { create } from 'zustand'
import type { UploadFolders } from '../types/knowledgeBaseMyDriveTypes'

interface FileUploadStore {
  uploadFolders: UploadFolders
  selectedIds: Set<string>
  setSelectedIds: (ids: Set<string>) => void
  toggleSelected: (id: string) => void
  clearSelected: () => void
}

export const useFileUploadStates = create<FileUploadStore>((set) => ({
  uploadFolders: {
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

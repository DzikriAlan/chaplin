import { create } from 'zustand'
import type { KbMyDrive } from '../types/knowledgeBaseMyDriveTypes'

interface KbMyDriveStore {
  kbMyDrive: KbMyDrive

  setKbMyDrive: (payload: Partial<KbMyDrive>) => void
}

export const useKbMyDriveStates = create<KbMyDriveStore>((set) => ({
  kbMyDrive: {
    status: 'loading',
    statusTitle: 'Memuat file...',
    statusSubtitle: 'Harap tunggu.',
    data: null,
  },

  setKbMyDrive: (payload: Partial<KbMyDrive>) =>
    set((state) => ({
      kbMyDrive: { ...state.kbMyDrive, ...payload },
    })),
}))

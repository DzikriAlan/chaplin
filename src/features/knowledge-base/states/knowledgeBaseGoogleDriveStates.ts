import { create } from 'zustand'
import type { KbGoogleDrive, KbGoogleDriveSync } from '../types/knowledgeBaseGoogleDriveTypes'

interface KbGoogleDriveStore {
  kbGoogleDrive: KbGoogleDrive
  kbGoogleDriveSync: KbGoogleDriveSync

  setKbGoogleDrive: (payload: Partial<KbGoogleDrive>) => void
  setKbGoogleDriveSync: (payload: Partial<KbGoogleDriveSync>) => void
}

export const useKbGoogleDriveStates = create<KbGoogleDriveStore>((set) => ({
  kbGoogleDrive: {
    status: 'loading',
    statusTitle: 'Memuat dokumen',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },
  kbGoogleDriveSync: {
    status: 'loading',
    statusTitle: 'Memproses',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },

  setKbGoogleDrive: (payload: Partial<KbGoogleDrive>) =>
    set((state) => ({
      kbGoogleDrive: { ...state.kbGoogleDrive, ...payload },
    })),

  setKbGoogleDriveSync: (payload: Partial<KbGoogleDriveSync>) =>
    set((state) => ({
      kbGoogleDriveSync: { ...state.kbGoogleDriveSync, ...payload },
    })),
}))

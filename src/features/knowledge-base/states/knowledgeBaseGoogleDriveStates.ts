import { create } from 'zustand'
import type { KbGoogleDrive, KbGoogleDriveSync } from '../types/knowledgeBaseGoogleDriveTypes'

interface KbGoogleDriveStore {
  kbGoogleDrive: KbGoogleDrive
  kbGoogleDriveSync: KbGoogleDriveSync
}

export const useKbGoogleDriveStates = create<KbGoogleDriveStore>(() => ({
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
}))

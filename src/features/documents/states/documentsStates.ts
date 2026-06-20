import { create } from 'zustand'
import type { Documents, DocumentsSync } from '../types/documentsTypes'

interface DocumentsStore {
  documents: Documents
  documentsSync: DocumentsSync
}

export const useDocumentsStates = create<DocumentsStore>(() => ({
  documents: {
    status: 'loading',
    statusTitle: 'Memuat dokumen',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },
  documentsSync: {
    status: 'loading',
    statusTitle: 'Memproses',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },
}))

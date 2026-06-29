import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { CloudOff, Pause, Play, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { DataDriveFolders } from '../types/knowledgeBaseGoogleDriveHelperTypes'
import { useKBGoogleDriveControllers } from '../controllers/knowledgeBaseGoogleDriveControllers'
import { useKbGoogleDriveStates } from '../states/knowledgeBaseGoogleDriveStates'
import { useKBGoogleDriveHelperControllers } from '../controllers/knowledgeBaseGoogleDriveHelperControllers'
import KnowledgeBaseGoogleDriveFolderPicker from './KnowledgeBaseGoogleDriveFolderPicker'
import KnowledgeBaseGoogleDriveRow from './KnowledgeBaseGoogleDriveRow'
import KnowledgeBaseGoogleDriveTableSkeleton from './KnowledgeBaseGoogleDriveTableSkeleton'

interface DocumentsListProps {
  syncSignal?: number
  openFolderPickerSignal?: number
}

export default function DocumentsList({ syncSignal, openFolderPickerSignal }: Readonly<DocumentsListProps>) {
  // states / variable (declared first for hook dependencies)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // variable importer
  const router = useRouter()
  const { kbGoogleDrive } = useKbGoogleDriveStates()
  const {
    changeDocuments, removeDocuments, removeDocumentsBulk,
    storeKbGoogleDriveSync,
  } = useKBGoogleDriveControllers()
  const { fetchDriveFolders, storeDriveFolders } = useKBGoogleDriveHelperControllers(showFolderPicker)

  const docs = kbGoogleDrive.data ?? []
  const folders = (fetchDriveFolders.data ?? []) as DataDriveFolders[]
  const pendingCount = docs.filter((d) => d.status === 'PENDING').length
  const processingCount = docs.filter((d) => d.status === 'PROCESSING').length
  const isAutoProcessing = pendingCount > 0 || processingCount > 0
  const selectedCount = selectedIds.size
  const prevPickerSignalRef = useRef(openFolderPickerSignal ?? 0)
  const hasAuxiliary = selectedCount > 0 || isAutoProcessing

  // function / methode
  const getDocsStatus = (isLoading: boolean, isError: boolean, isEmpty: boolean) => {
    if (isLoading) return 'loading'
    if (isError) return 'error'
    if (isEmpty) return 'empty'
    return 'success'
  }
  const loadStatus = getDocsStatus(kbGoogleDrive.status === 'loading', kbGoogleDrive.status === 'error', docs.length === 0)

  const getProcessingLabel = () => {
    if (isPaused) return `Dijeda — ${pendingCount} dokumen menunggu`
    if (processingCount > 0) return `Sedang memproses... (${pendingCount} antri)`
    return `${pendingCount} dokumen menunggu diproses`
  }

  const syncSelectId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const destroyDocument = (id: string) => {
    if (!confirm('Hapus dokumen ini?')) return
    removeDocuments.mutate(id, {
      onSuccess: () => toast.success('Dokumen dihapus'),
      onError: () => toast.error('Gagal menghapus'),
    })
  }

  const destroySelected = () => {
    if (selectedCount === 0) return
    if (!confirm(`Hapus ${selectedCount} dokumen terpilih?`)) return
    removeDocumentsBulk.mutate(
      { ids: Array.from(selectedIds) },
      {
        onSuccess: () => { toast.success(`${selectedCount} dokumen dihapus`); setSelectedIds(new Set()) },
        onError: () => toast.error('Gagal menghapus'),
      },
    )
  }

  const syncDocumentSkip = (id: string) => {
    changeDocuments.mutate({ id, action: 'skip' }, { onSuccess: () => toast.success('Dokumen dilewati') })
  }

  const syncDocumentRetry = (id: string) => {
    changeDocuments.mutate({ id, action: 'retry' }, { onSuccess: () => toast.success('Dokumen akan diproses ulang') })
  }

  const syncGoogleDrive = () => {
    storeKbGoogleDriveSync.mutate({ action: 'sync' }, { onSuccess: () => toast.success('Sinkronisasi dimulai') })
  }

  const syncPause = () => setIsPaused((v) => !v)

  const saveFolderSelection = (folder: DataDriveFolders) => {
    storeDriveFolders.mutate(
      { folderId: folder.id, folderName: folder.name },
      { onSuccess: () => { toast.success('Folder dipilih'); setShowFolderPicker(false) } },
    )
  }

  // lifecycle react
  useEffect(() => { if (router.query.folder === 'picker') { setShowFolderPicker(true); router.replace('/documents', undefined, { shallow: true }) } }, [router])

  useEffect(() => { if (syncSignal) syncGoogleDrive() }, [syncSignal]) // syncGoogleDrive is intentionally omitted: sync triggered by signal change only
  useEffect(() => {
    if (openFolderPickerSignal && openFolderPickerSignal !== prevPickerSignalRef.current) {
      setShowFolderPicker(true)
      prevPickerSignalRef.current = openFolderPickerSignal
    }
  }, [openFolderPickerSignal])

  return (
    <div>
      {showFolderPicker && <KnowledgeBaseGoogleDriveFolderPicker folders={folders} isLoading={fetchDriveFolders.isLoading} isSaving={storeDriveFolders.isPending} onSelectFolder={saveFolderSelection} onClose={() => setShowFolderPicker(false)} />}

      {hasAuxiliary && (
        <div className="space-y-3 pt-4 pb-1">
          {(selectedCount > 0 || isAutoProcessing) && (
            <div className="flex items-center justify-end gap-2">
              {selectedCount > 0 && <button type="button" onClick={destroySelected} className="rounded-lg border border-destructive/30 px-3 py-2 text-rem-80 font-medium text-destructive hover:bg-destructive/5 transition-colors"><X className="h-3.5 w-3.5 inline mr-1" />Hapus ({selectedCount})</button>}
              {isAutoProcessing && <button type="button" onClick={syncPause} className="rounded-lg border px-3 py-2 text-rem-80 font-medium text-foreground hover:bg-muted transition-colors">{isPaused ? <><Play className="h-3.5 w-3.5 inline mr-1" />Lanjutkan</> : <><Pause className="h-3.5 w-3.5 inline mr-1" />Jeda</>}</button>}
            </div>
          )}
          {isAutoProcessing && <div className="rounded-lg bg-muted/40 px-4 py-2 text-rem-80 text-muted-foreground">{getProcessingLabel()}</div>}
        </div>
      )}

      {loadStatus === 'loading' && <KnowledgeBaseGoogleDriveTableSkeleton />}

      {loadStatus === 'empty' && (
        <div className="p-12 text-center">
          <CloudOff className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-rem-100 font-medium text-foreground">Belum ada dokumen</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Hubungkan Google Drive untuk mulai menyinkronkan dokumen</p>
        </div>
      )}

      {loadStatus === 'error' && (
        <div className="p-12 text-center">
          <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
        </div>
      )}

      {loadStatus === 'success' && docs.length > 0 && (
        <div className="divide-y divide-border">
          {docs.map((doc) => (
            <KnowledgeBaseGoogleDriveRow
              key={doc.id}
              doc={doc}
              isSelected={selectedIds.has(doc.id)}
              onToggleSelect={syncSelectId}
              onDeleteDocument={destroyDocument}
              onSkipDocument={syncDocumentSkip}
              onRetryDocument={syncDocumentRetry}
            />
          ))}
        </div>
      )}
    </div>
  )
}

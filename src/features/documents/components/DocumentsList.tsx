import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { CloudOff, Pause, Play, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { DataDocuments } from '../types/documentsTypes'
import { useDocumentsControllers } from '../controllers/documentsControllers'
import { useDriveControllers } from '@/features/drive/controllers/driveControllers'
import type { DataDriveFolders } from '@/features/drive/types/driveTypes'
import DriveFolderPicker from '@/features/drive/components/DriveFolderPicker'
import DocumentRow from './DocumentRow'
import DocumentsTableSkeleton from './DocumentsTableSkeleton'

function getDocsStatus(isLoading: boolean, isError: boolean, isEmpty: boolean) {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (isEmpty) return 'empty'
  return 'success'
}

interface DocumentsListProps {
  syncSignal?: number
  openFolderPickerSignal?: number
}

export default function DocumentsList({ syncSignal, openFolderPickerSignal }: Readonly<DocumentsListProps>) {
  const router = useRouter()
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    fetchDocuments,
    changeDocuments, removeDocuments, removeDocumentsBulk,
    storeDocumentsSync,
  } = useDocumentsControllers()
  const { fetchDriveFolders, storeDriveFolders } = useDriveControllers(showFolderPicker)

  const docs = (fetchDocuments.data ?? []) as DataDocuments[]
  const folders = (fetchDriveFolders.data ?? []) as DataDriveFolders[]

  const pendingCount = docs.filter((d) => d.status === 'PENDING').length
  const processingCount = docs.filter((d) => d.status === 'PROCESSING').length
  const isAutoProcessing = pendingCount > 0 || processingCount > 0
  const selectedCount = selectedIds.size

  function getProcessingLabel() {
    if (isPaused) return `Dijeda — ${pendingCount} dokumen menunggu`
    if (processingCount > 0) return `Sedang memproses... (${pendingCount} antri)`
    return `${pendingCount} dokumen menunggu diproses`
  }

  const handleToggleSelect = (id: string) => {
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
  const handleDeleteDocument = (id: string) => {
    if (!confirm('Hapus dokumen ini?')) return
    removeDocuments.mutate(id, {
      onSuccess: () => toast.success('Dokumen dihapus'),
      onError: () => toast.error('Gagal menghapus'),
    })
  }
  const handleDeleteSelected = () => {
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
  const handleSkipDocument = (id: string) => {
    changeDocuments.mutate({ id, action: 'skip' }, { onSuccess: () => toast.success('Dokumen dilewati') })
  }
  const handleRetryDocument = (id: string) => {
    changeDocuments.mutate({ id, action: 'retry' }, { onSuccess: () => toast.success('Dokumen akan diproses ulang') })
  }
  const handleSync = () => {
    storeDocumentsSync.mutate({ action: 'sync' }, { onSuccess: () => toast.success('Sinkronisasi dimulai') })
  }
  const handleTogglePause = () => setIsPaused((v) => !v)
  const handleFolderSelect = (folder: DataDriveFolders) => {
    storeDriveFolders.mutate(
      { folderId: folder.id, folderName: folder.name },
      { onSuccess: () => { toast.success('Folder dipilih'); setShowFolderPicker(false) } },
    )
  }
  const loadStatus = getDocsStatus(fetchDocuments.isLoading, fetchDocuments.isError, docs.length === 0)

  useEffect(() => { if (router.query.folder === 'picker') { setShowFolderPicker(true); router.replace('/documents', undefined, { shallow: true }) } }, [router])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (syncSignal) handleSync() }, [syncSignal])
  const prevPickerSignalRef = useRef(openFolderPickerSignal ?? 0)
  useEffect(() => {
    if (openFolderPickerSignal && openFolderPickerSignal !== prevPickerSignalRef.current) {
      setShowFolderPicker(true)
      prevPickerSignalRef.current = openFolderPickerSignal
    }
  }, [openFolderPickerSignal])

  const hasAuxiliary = selectedCount > 0 || isAutoProcessing

  return (
    <div>
      {showFolderPicker && <DriveFolderPicker folders={folders} isLoading={fetchDriveFolders.isLoading} isSaving={storeDriveFolders.isPending} onSelectFolder={handleFolderSelect} onClose={() => setShowFolderPicker(false)} />}

      {hasAuxiliary && (
        <div className="space-y-3 pt-4 pb-1">
          {(selectedCount > 0 || isAutoProcessing) && (
            <div className="flex items-center justify-end gap-2">
              {selectedCount > 0 && <button type="button" onClick={handleDeleteSelected} className="rounded-lg border border-destructive/30 px-3 py-2 text-rem-80 font-medium text-destructive hover:bg-destructive/5 transition-colors"><X className="h-3.5 w-3.5 inline mr-1" />Hapus ({selectedCount})</button>}
              {isAutoProcessing && <button type="button" onClick={handleTogglePause} className="rounded-lg border px-3 py-2 text-rem-80 font-medium text-foreground hover:bg-muted transition-colors">{isPaused ? <><Play className="h-3.5 w-3.5 inline mr-1" />Lanjutkan</> : <><Pause className="h-3.5 w-3.5 inline mr-1" />Jeda</>}</button>}
            </div>
          )}
          {isAutoProcessing && <div className="rounded-lg bg-muted/40 px-4 py-2 text-rem-80 text-muted-foreground">{getProcessingLabel()}</div>}
        </div>
      )}

      {loadStatus === 'loading' && <DocumentsTableSkeleton />}

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
            <DocumentRow
              key={doc.id}
              doc={doc}
              isSelected={selectedIds.has(doc.id)}
              onToggleSelect={handleToggleSelect}
              onDeleteDocument={handleDeleteDocument}
              onSkipDocument={handleSkipDocument}
              onRetryDocument={handleRetryDocument}
            />
          ))}
        </div>
      )}
    </div>
  )
}

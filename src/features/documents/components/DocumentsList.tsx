import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { RefreshCw, CloudOff, Cloud, Pause, Play, Unlink, X } from 'lucide-react'
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

export default function DocumentsList() {
  const router = useRouter()
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    fetchDocuments,
    changeDocuments, removeDocuments, removeDocumentsBulk,
    storeDocumentsSync,
  } = useDocumentsControllers()
  const { fetchDriveFolders, fetchDriveConfig, storeDriveFolders, removeDriveConfig } = useDriveControllers(showFolderPicker)

  const docs = (fetchDocuments.data ?? []) as DataDocuments[]
  const driveConfig = fetchDriveConfig.data
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
  const handleDisconnect = () => {
    if (!confirm('Putuskan koneksi Google Drive?')) return
    removeDriveConfig.mutate(undefined, { onSuccess: () => toast.success('Koneksi diputus') })
  }

  const loadStatus = getDocsStatus(fetchDocuments.isLoading, fetchDocuments.isError, docs.length === 0)

  useEffect(() => { if (router.query.folder === 'picker') { setShowFolderPicker(true); router.replace('/documents', undefined, { shallow: true }) } }, [router])

  return (
    <div className="space-y-4">
      {showFolderPicker && <DriveFolderPicker folders={folders} isLoading={fetchDriveFolders.isLoading} isSaving={storeDriveFolders.isPending} onSelectFolder={handleFolderSelect} onClose={() => setShowFolderPicker(false)} />}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {driveConfig ? (
            <>
              <span className="text-rem-85 text-muted-foreground flex items-center gap-1.5"><Cloud className="h-4 w-4" />{driveConfig.folderName ?? 'My Drive'}</span>
              <button type="button" onClick={() => setShowFolderPicker(true)} className="text-rem-80 font-medium text-primary hover:underline">Ganti</button>
              <button type="button" onClick={handleDisconnect} className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors" title="Putuskan"><Unlink className="h-3.5 w-3.5" /></button>
            </>
          ) : (
            <button type="button" onClick={() => setShowFolderPicker(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><CloudOff className="h-4 w-4" />Hubungkan Drive</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && <button type="button" onClick={handleDeleteSelected} className="rounded-lg border border-destructive/30 px-3 py-2 text-rem-80 font-medium text-destructive hover:bg-destructive/5 transition-colors"><X className="h-3.5 w-3.5 inline mr-1" />Hapus ({selectedCount})</button>}
          {isAutoProcessing && <button type="button" onClick={handleTogglePause} className="rounded-lg border px-3 py-2 text-rem-80 font-medium text-foreground hover:bg-muted transition-colors">{isPaused ? <><Play className="h-3.5 w-3.5 inline mr-1" />Lanjutkan</> : <><Pause className="h-3.5 w-3.5 inline mr-1" />Jeda</>}</button>}
          {driveConfig && <button type="button" onClick={handleSync} disabled={storeDocumentsSync.isPending} className="rounded-lg border px-3 py-2 text-rem-80 font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"><RefreshCw className={`h-3.5 w-3.5 inline mr-1 ${storeDocumentsSync.isPending ? 'animate-spin' : ''}`} />{storeDocumentsSync.isPending ? 'Sync...' : 'Sync'}</button>}
        </div>
      </div>

      {isAutoProcessing && <div className="rounded-lg bg-muted/40 px-4 py-2 text-rem-80 text-muted-foreground">{getProcessingLabel()}</div>}

      {loadStatus === 'loading' && <DocumentsTableSkeleton />}

      {loadStatus === 'empty' && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <CloudOff className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-rem-100 font-medium text-foreground">Belum ada dokumen</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Hubungkan Google Drive untuk mulai menyinkronkan dokumen</p>
        </div>
      )}

      {loadStatus === 'error' && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
        </div>
      )}

      {loadStatus === 'success' && docs.length > 0 && (
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10">{/* checkbox */}</th>
                <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Nama Dokumen</th>
                <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Chunks</th>
                <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Diperbarui</th>
                <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}

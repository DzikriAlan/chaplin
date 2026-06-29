'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { FolderPlus, X, CheckSquare, Trash2, Upload, FolderOpen, Loader2 } from 'lucide-react'
import { useKBMyDriveControllers } from '../controllers/knowledgeBaseMyDriveControllers'
import { useKbMyDriveStates } from '../states/knowledgeBaseMyDriveStates'
import type { DataKbMyDriveFolder } from '../types/knowledgeBaseMyDriveTypes'
import { getSupabaseClient, isSupabaseConfigured, STORAGE_BUCKET } from '@/shared/lib/supabase'
import KnowledgeBaseGoogleDriveTableSkeleton from './KnowledgeBaseGoogleDriveTableSkeleton'
import { KnowledgeBaseMyDriveFolderNode } from './KnowledgeBaseMyDriveFolderNode'
import { KnowledgeBaseMyDriveCheckbox } from './KnowledgeBaseMyDriveCheckbox'

function getCollectFileIds(folder: DataKbMyDriveFolder): string[] {
  const ids = folder.files.map((f) => f.id)
  for (const child of folder.children) {
    ids.push(...getCollectFileIds(child))
  }
  return ids
}

interface FileUploaderViewProps {
  openFolderFormSignal?: number
  openUploadSignal?: number
}

export default function FileUploaderView({ openFolderFormSignal, openUploadSignal }: Readonly<FileUploaderViewProps>) {
  const { kbMyDrive } = useKbMyDriveStates()
  const { storeUploadFolder, removeUploadFolder, storeSignedUrl, removeUploadFile } = useKBMyDriveControllers()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState<string | undefined>(undefined)
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [uploadingFolderId, setUploadingFolderId] = useState<string | null>(null)
  const [rootDragOver, setRootDragOver] = useState(false)
  const rootInputRef = useRef<HTMLInputElement>(null)

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearSelected = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const folders = kbMyDrive.data ?? []
  const supabaseReady = isSupabaseConfigured()

  const prevFolderSignalRef = useRef(openFolderFormSignal ?? 0)
  useEffect(() => {
    if (openFolderFormSignal && openFolderFormSignal !== prevFolderSignalRef.current) {
      setShowFolderForm(true)
      prevFolderSignalRef.current = openFolderFormSignal
    }
  }, [openFolderFormSignal])

  const prevUploadSignalRef = useRef(openUploadSignal ?? 0)
  useEffect(() => {
    if (openUploadSignal && openUploadSignal !== prevUploadSignalRef.current) {
      rootInputRef.current?.click()
      prevUploadSignalRef.current = openUploadSignal
    }
  }, [openUploadSignal])

  const handleToggleFolder = useCallback((folder: DataKbMyDriveFolder) => {
    const allIds = getCollectFileIds(folder)
    const allSelected = allIds.every((id) => selectedIds.has(id))
    const next = new Set(selectedIds)
    if (allSelected) {
      allIds.forEach((id) => next.delete(id))
    } else {
      allIds.forEach((id) => next.add(id))
    }
    setSelectedIds(next)
  }, [selectedIds, setSelectedIds])

  const handleToggleFile = useCallback((fileId: string) => {
    toggleSelected(fileId)
  }, [toggleSelected])

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    storeUploadFolder.mutate(
      { name: newFolderName.trim(), parentId: newFolderParentId },
      {
        onSuccess: () => {
          setNewFolderName('')
          setNewFolderParentId(undefined)
          setShowFolderForm(false)
        },
      },
    )
  }

  const handleDeleteFolder = (id: string) => {
    if (!confirm('Hapus folder beserta semua isinya?')) return
    removeUploadFolder.mutate(id)
    const next = new Set(selectedIds)
    setSelectedIds(next)
  }

  const handleDeleteFile = (id: string) => {
    if (!confirm('Hapus file ini?')) return
    removeUploadFile.mutate(id)
    const next = new Set(selectedIds)
    next.delete(id)
    setSelectedIds(next)
  }

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Hapus ${selectedIds.size} file yang dipilih?`)) return
    const ids = Array.from(selectedIds)
    ids.forEach((id) => removeUploadFile.mutate(id))
    clearSelected()
  }

  const uploadFiles = useCallback(async (files: FileList, folderId?: string) => {
    setUploadingFolderId(folderId ?? 'root')
    for (const file of Array.from(files)) {
      try {
        const { signedUrl, token } = await storeSignedUrl.mutateAsync({
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          folderId,
        })
        await getSupabaseClient().storage.from(STORAGE_BUCKET).uploadToSignedUrl(signedUrl, token, file)
      } catch {
        // individual file failure — continue with next
      }
    }
    setUploadingFolderId(null)
  }, [storeSignedUrl])

  const handleRootDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setRootDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files, undefined)
    }
  }, [uploadFiles])

  const handleFolderFiles = useCallback((files: FileList, folderId: string) => {
    uploadFiles(files, folderId)
  }, [uploadFiles])

  const allFolderFileIds = folders.flatMap((f) => getCollectFileIds(f))
  const allSelected = allFolderFileIds.length > 0 && allFolderFileIds.every((id) => selectedIds.has(id))
  const someSelected = allFolderFileIds.some((id) => selectedIds.has(id))

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelected()
    } else {
      setSelectedIds(new Set(allFolderFileIds))
    }
  }

  function flattenFolders(list: DataKbMyDriveFolder[], depth = 0): { id: string; name: string; depth: number }[] {
    return list.flatMap((f) => [
      { id: f.id, name: f.name, depth },
      ...flattenFolders(f.children, depth + 1),
    ])
  }
  const flatFolders = flattenFolders(folders)

  return (
    <div className="px-4">
      {!supabaseReady && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 mt-4 dark:bg-amber-950/30 dark:border-amber-400/20">
          <span className="text-rem-85 text-amber-800 dark:text-amber-300">
            <strong>Supabase belum dikonfigurasi.</strong> Tambahkan <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ke <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">.env.local</code> untuk mengaktifkan upload file.
          </span>
        </div>
      )}
      <input
        ref={rootInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {/* Selection toolbar — desktop only, shown when items are selected */}
      {someSelected && (
        <div className="hidden sm:flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-rem-85 font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Hapus {selectedIds.size} dipilih
          </button>
          <button
            type="button"
            onClick={clearSelected}
            className="flex items-center gap-1 text-rem-80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Batal pilih
          </button>
        </div>
      )}

      {/* New folder form */}
      {showFolderForm && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 mt-4">
          <FolderPlus className="h-4 w-4 shrink-0 text-primary" />
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }}
            placeholder="Nama folder baru..."
            autoFocus
            className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-rem-85 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {flatFolders.length > 0 && (
            <select
              value={newFolderParentId ?? ''}
              onChange={(e) => setNewFolderParentId(e.target.value || undefined)}
              className="rounded-lg border bg-background px-3 py-1.5 text-rem-85 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Root (tanpa parent)</option>
              {flatFolders.map((f) => (
                <option key={f.id} value={f.id}>
                  {'  '.repeat(f.depth)}{f.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleCreateFolder}
            disabled={storeUploadFolder.isPending || !newFolderName.trim()}
            className="rounded-lg bg-primary px-3 py-1.5 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Buat
          </button>
          <button
            type="button"
            onClick={() => { setShowFolderForm(false); setNewFolderName('') }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Loading state */}
      {kbMyDrive.status === 'loading' && <KnowledgeBaseGoogleDriveTableSkeleton />}

      {/* Error state */}
      {kbMyDrive.status === 'error' && (
        <div className="p-12 text-center">
          <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
        </div>
      )}

      {/* Empty state — card with drop zone active */}
      {kbMyDrive.status !== 'loading' && kbMyDrive.status !== 'error' && folders.length === 0 && (
        <div
          onDrop={handleRootDrop}
          onDragOver={(e) => { e.preventDefault(); setRootDragOver(true) }}
          onDragLeave={() => setRootDragOver(false)}
          className={`p-12 text-center transition-colors ${rootDragOver ? 'bg-primary/5' : ''}`}
        >
          <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-rem-100 font-medium text-foreground">Belum ada file</p>
          <p className="text-rem-85 text-muted-foreground mt-1">
            Drag & drop file ke sini, atau buat folder dulu
          </p>
        </div>
      )}

      {/* File tree — shown only when data exists */}
      {kbMyDrive.status !== 'loading' && kbMyDrive.status !== 'error' && folders.length > 0 && (
        <div className="overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
            <KnowledgeBaseMyDriveCheckbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={handleSelectAll}
              label="Pilih semua"
            />
            {someSelected && (
              <div className="flex items-center gap-1.5 ml-1">
                <CheckSquare className="h-3.5 w-3.5 text-primary" />
                <span className="text-rem-80 text-primary font-medium">{selectedIds.size} dipilih</span>
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-rem-80 font-semibold text-muted-foreground">{folders.length} folder</span>
              {someSelected ? (
                <button
                  type="button"
                  title="Hapus dipilih"
                  onClick={handleDeleteSelected}
                  className="sm:hidden p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    title="Folder Baru"
                    onClick={() => setShowFolderForm(!showFolderForm)}
                    className="sm:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Upload File"
                    onClick={() => rootInputRef.current?.click()}
                    className="sm:hidden p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Folder list with root drop zone */}
          <div
            onDrop={handleRootDrop}
            onDragOver={(e) => { e.preventDefault(); setRootDragOver(true) }}
            onDragLeave={() => setRootDragOver(false)}
            className={`transition-colors ${rootDragOver ? 'bg-primary/5' : ''}`}
          >
            <div className="divide-y divide-border">
              {folders.map((folder) => (
                <KnowledgeBaseMyDriveFolderNode
                  key={folder.id}
                  folder={folder}
                  depth={0}
                  selectedIds={selectedIds}
                  onToggleFolder={handleToggleFolder}
                  onToggleFile={handleToggleFile}
                  onDeleteFolder={handleDeleteFolder}
                  onDeleteFile={handleDeleteFile}
                  onDropFiles={handleFolderFiles}
                  uploadingFolderId={uploadingFolderId}
                />
              ))}
            </div>
            {rootDragOver && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-xl bg-primary/10 border-2 border-dashed border-primary px-6 py-4">
                  <p className="text-rem-90 font-medium text-primary">Upload ke root</p>
                </div>
              </div>
            )}
          </div>

          {/* Root upload progress */}
          {uploadingFolderId === 'root' && (
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-primary/5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-rem-85 text-primary font-medium">Mengupload file...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

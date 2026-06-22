'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  FolderOpen,
  FolderPlus,
  Trash2,
  Upload,
  File,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  CheckSquare,
} from 'lucide-react'
import { useKBMyDriveControllers } from '../controllers/knowledgeBaseMyDriveControllers'
import { useKbMyDriveStates } from '../states/knowledgeBaseMyDriveStates'
import type { DataKbMyDriveFolder, DataKbMyDriveFile } from '../types/knowledgeBaseMyDriveTypes'
import { getSupabaseClient, isSupabaseConfigured, STORAGE_BUCKET } from '@/shared/lib/supabase'
import ListCardRow from '@/shared/components/ListCardRow'
import KnowledgeBaseGoogleDriveTableSkeleton from './KnowledgeBaseGoogleDriveTableSkeleton'

// ── helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}


function collectFileIds(folder: DataKbMyDriveFolder): string[] {
  const ids = folder.files.map((f) => f.id)
  for (const child of folder.children) {
    ids.push(...collectFileIds(child))
  }
  return ids
}

// ── IndeterminateCheckbox ──────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
  label?: string
}

function IndeterminateCheckbox({ checked, indeterminate, onChange, label }: Readonly<CheckboxProps>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-border accent-primary cursor-pointer shrink-0"
    />
  )
}

// ── FolderNode ─────────────────────────────────────────────────────────────

interface FolderNodeProps {
  folder: DataKbMyDriveFolder
  depth: number
  selectedIds: Set<string>
  onToggleFolder: (folder: DataKbMyDriveFolder) => void
  onToggleFile: (fileId: string) => void
  onDeleteFolder: (id: string) => void
  onDeleteFile: (id: string) => void
  onDropFiles: (files: FileList, folderId: string) => void
  uploadingFolderId: string | null
}

function FolderNode({
  folder,
  depth,
  selectedIds,
  onToggleFolder,
  onToggleFile,
  onDeleteFolder,
  onDeleteFile,
  onDropFiles,
  uploadingFolderId,
}: Readonly<FolderNodeProps>) {
  const [expanded, setExpanded] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const allFileIds = collectFileIds(folder)
  const selectedCount = allFileIds.filter((id) => selectedIds.has(id)).length
  const isChecked = allFileIds.length > 0 && selectedCount === allFileIds.length
  const isIndeterminate = selectedCount > 0 && selectedCount < allFileIds.length
  const isUploading = uploadingFolderId === folder.id
  const hasContent = folder.children.length > 0 || folder.files.length > 0
  const paddingLeft = depth * 16

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files, folder.id)
    }
  }, [folder.id, onDropFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const chevronIcon = expanded
    ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
  const folderPrefixIcon = hasContent ? chevronIcon : <span className="w-3.5 shrink-0" />

  const folderActions = (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      {isUploading
        ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        : (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && onDropFiles(e.target.files, folder.id)}
            />
            <button type="button" title="Upload ke folder ini" onClick={() => inputRef.current?.click()} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted">
              <Upload className="h-3.5 w-3.5" />
            </button>
          </>
        )
      }
      <button type="button" title="Hapus folder" onClick={() => onDeleteFolder(folder.id)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <ListCardRow
          selectionNode={
            <IndeterminateCheckbox
              checked={isChecked}
              indeterminate={isIndeterminate}
              onChange={() => onToggleFolder(folder)}
              label={`Pilih folder ${folder.name}`}
            />
          }
          prefixNode={<>{folderPrefixIcon}<FolderOpen className="h-4 w-4 shrink-0 text-primary" /></>}
          title={folder.name}
          subtitle={`${folder.files.length + folder.children.length} item`}
          inlineSubtitle
          onClickContent={hasContent ? () => setExpanded(!expanded) : undefined}
          actions={folderActions}
          dragOver={dragOver}
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
        />
      </div>

      {expanded && (
        <div className="divide-y divide-border">
          {folder.children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              onToggleFolder={onToggleFolder}
              onToggleFile={onToggleFile}
              onDeleteFolder={onDeleteFolder}
              onDeleteFile={onDeleteFile}
              onDropFiles={onDropFiles}
              uploadingFolderId={uploadingFolderId}
            />
          ))}

          {folder.files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              depth={depth + 1}
              isSelected={selectedIds.has(file.id)}
              onToggle={() => onToggleFile(file.id)}
              onDelete={() => onDeleteFile(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── FileRow ────────────────────────────────────────────────────────────────

interface FileRowProps {
  file: DataKbMyDriveFile
  depth: number
  isSelected: boolean
  onToggle: () => void
  onDelete: () => void
}

function FileRow({ file, depth, isSelected, onToggle, onDelete }: Readonly<FileRowProps>) {
  return (
    <ListCardRow
      selectionNode={
        <input
          type="checkbox"
          aria-label={`Pilih ${file.name}`}
          checked={isSelected}
          onChange={onToggle}
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
      }
      prefixNode={<File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      title={file.name}
      subtitle={formatBytes(file.size)}
      inlineSubtitle
      actions={
        <button
          type="button"
          title="Hapus file"
          onClick={onDelete}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      }
      style={{ paddingLeft: `${depth * 16 + 32}px` }}
    />
  )
}

// ── FileUploaderView ───────────────────────────────────────────────────────

interface FileUploaderViewProps {
  openFolderFormSignal?: number
  openUploadSignal?: number
}

export default function FileUploaderView({ openFolderFormSignal, openUploadSignal }: Readonly<FileUploaderViewProps>) {
  const { fetchUploadFolders, storeUploadFolder, removeUploadFolder, storeSignedUrl, removeUploadFile } =
    useKBMyDriveControllers()
  const { selectedIds, setSelectedIds, toggleSelected, clearSelected } = useKbMyDriveStates()

  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState<string | undefined>(undefined)
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [uploadingFolderId, setUploadingFolderId] = useState<string | null>(null)
  const [rootDragOver, setRootDragOver] = useState(false)
  const rootInputRef = useRef<HTMLInputElement>(null)

  const folders = (fetchUploadFolders.data ?? []) as DataKbMyDriveFolder[]
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
    const allIds = collectFileIds(folder)
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

  const allFolderFileIds = folders.flatMap((f) => collectFileIds(f))
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
      {fetchUploadFolders.isLoading && <KnowledgeBaseGoogleDriveTableSkeleton />}

      {/* Error state */}
      {fetchUploadFolders.isError && !fetchUploadFolders.isLoading && (
        <div className="p-12 text-center">
          <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
        </div>
      )}

      {/* Empty state — card with drop zone active */}
      {!fetchUploadFolders.isLoading && !fetchUploadFolders.isError && folders.length === 0 && (
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
      {!fetchUploadFolders.isLoading && !fetchUploadFolders.isError && folders.length > 0 && (
        <div className="overflow-hidden">
          {/* Header row */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
            <IndeterminateCheckbox
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
                <FolderNode
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

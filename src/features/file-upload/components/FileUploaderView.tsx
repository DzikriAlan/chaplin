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
import { useFileUploadControllers } from '../controllers/fileUploadControllers'
import { useFileUploadStates } from '../states/fileUploadStates'
import type { DataUploadFolder, DataUploadFile } from '../types/fileUploadTypes'
import { getSupabaseClient, isSupabaseConfigured, STORAGE_BUCKET } from '@/shared/lib/supabase'

// ── helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function collectFileIds(folder: DataUploadFolder): string[] {
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
  folder: DataUploadFolder
  depth: number
  selectedIds: Set<string>
  onToggleFolder: (folder: DataUploadFolder) => void
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

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group ${dragOver ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted/50'}`}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <IndeterminateCheckbox
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={() => onToggleFolder(folder)}
          label={`Pilih folder ${folder.name}`}
        />

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        >
          {hasContent
            ? expanded
              ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            : <span className="w-3.5 shrink-0" />
          }
          <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-rem-85 font-medium text-foreground truncate">{folder.name}</span>
          <span className="text-rem-75 text-muted-foreground shrink-0 ml-1">
            {folder.files.length + folder.children.length} item
          </span>
        </button>

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
                <button
                  type="button"
                  title="Upload ke folder ini"
                  onClick={() => inputRef.current?.click()}
                  className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
              </>
            )
          }
          <button
            type="button"
            title="Hapus folder"
            onClick={() => onDeleteFolder(folder.id)}
            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div>
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
  file: DataUploadFile
  depth: number
  isSelected: boolean
  onToggle: () => void
  onDelete: () => void
}

function FileRow({ file, depth, isSelected, onToggle, onDelete }: Readonly<FileRowProps>) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-colors group"
      style={{ paddingLeft: `${depth * 16 + 28}px` }}
    >
      <input
        type="checkbox"
        aria-label={`Pilih ${file.name}`}
        checked={isSelected}
        onChange={onToggle}
        className="h-4 w-4 rounded border-border accent-primary cursor-pointer shrink-0"
      />
      <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="text-rem-80 text-foreground truncate flex-1">{file.name}</span>
      <span className="text-rem-75 text-muted-foreground shrink-0">{formatBytes(file.size)}</span>
      <button
        type="button"
        title="Hapus file"
        onClick={onDelete}
        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── FileUploaderView ───────────────────────────────────────────────────────

export default function FileUploaderView() {
  const { fetchUploadFolders, storeUploadFolder, removeUploadFolder, storeSignedUrl, removeUploadFile } =
    useFileUploadControllers()
  const { selectedIds, setSelectedIds, toggleSelected, clearSelected } = useFileUploadStates()

  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParentId, setNewFolderParentId] = useState<string | undefined>(undefined)
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [uploadingFolderId, setUploadingFolderId] = useState<string | null>(null)
  const [rootDragOver, setRootDragOver] = useState(false)
  const rootInputRef = useRef<HTMLInputElement>(null)

  const folders = (fetchUploadFolders.data ?? []) as DataUploadFolder[]
  const supabaseReady = isSupabaseConfigured()

  const handleToggleFolder = useCallback((folder: DataUploadFolder) => {
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

  function flattenFolders(list: DataUploadFolder[], depth = 0): { id: string; name: string; depth: number }[] {
    return list.flatMap((f) => [
      { id: f.id, name: f.name, depth },
      ...flattenFolders(f.children, depth + 1),
    ])
  }
  const flatFolders = flattenFolders(folders)

  return (
    <div className="space-y-4">
      {!supabaseReady && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 dark:bg-amber-950/30 dark:border-amber-400/20">
          <span className="text-rem-85 text-amber-800 dark:text-amber-300">
            <strong>Supabase belum dikonfigurasi.</strong> Tambahkan <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ke <code className="rounded bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 font-mono text-rem-80">.env.local</code> untuk mengaktifkan upload file.
          </span>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {someSelected && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-rem-85 font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Hapus {selectedIds.size} dipilih
            </button>
          )}
          {someSelected && (
            <button
              type="button"
              onClick={clearSelected}
              className="flex items-center gap-1 text-rem-80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Batal pilih
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFolderForm(!showFolderForm)}
            className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-rem-85 font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Folder Baru
          </button>
          <button
            type="button"
            onClick={() => rootInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>
          <input
            ref={rootInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files, undefined)}
          />
        </div>
      </div>

      {/* New folder form */}
      {showFolderForm && (
        <div className="flex items-center gap-2 rounded-xl border bg-card p-3">
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

      {/* File tree */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
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
          <span className="text-rem-80 font-semibold text-muted-foreground ml-auto">
            {folders.length} folder
          </span>
        </div>

        {/* Loading */}
        {fetchUploadFolders.isLoading && (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-rem-85 text-muted-foreground">Memuat...</span>
          </div>
        )}

        {/* Empty state + root drop zone */}
        {!fetchUploadFolders.isLoading && (
          <div
            onDrop={handleRootDrop}
            onDragOver={(e) => { e.preventDefault(); setRootDragOver(true) }}
            onDragLeave={() => setRootDragOver(false)}
            className={`transition-colors ${rootDragOver ? 'bg-primary/5' : ''}`}
          >
            {folders.length === 0 ? (
              <div className={`py-14 text-center transition-colors ${rootDragOver ? 'bg-primary/5' : ''}`}>
                <FolderOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-rem-90 font-medium text-foreground">Belum ada file</p>
                <p className="text-rem-80 text-muted-foreground mt-1">
                  Drag & drop file ke sini, atau buat folder dulu
                </p>
              </div>
            ) : (
              <div className="py-1">
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
            )}

            {/* Root drag overlay hint */}
            {rootDragOver && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-xl bg-primary/10 border-2 border-dashed border-primary px-6 py-4">
                  <p className="text-rem-90 font-medium text-primary">Upload ke root</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Root upload progress */}
        {uploadingFolderId === 'root' && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-primary/5">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-rem-85 text-primary font-medium">Mengupload file...</span>
          </div>
        )}
      </div>
    </div>
  )
}

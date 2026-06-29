import { useState, useRef, useCallback } from 'react'
import { FolderOpen, ChevronRight, ChevronDown, Loader2, Upload, Trash2 } from 'lucide-react'
import type { DataKbMyDriveFolder } from '../types/knowledgeBaseMyDriveTypes'
import { KnowledgeBaseMyDriveCheckbox } from './KnowledgeBaseMyDriveCheckbox'
import { KnowledgeBaseMyDriveFileRow } from './KnowledgeBaseMyDriveFileRow'
import ListCardRow from '@/shared/components/ListCardRow'

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

function getCollectFileIds(folder: DataKbMyDriveFolder): string[] {
  const ids = folder.files.map((f) => f.id)
  for (const child of folder.children) {
    ids.push(...getCollectFileIds(child))
  }
  return ids
}

export function KnowledgeBaseMyDriveFolderNode({
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
  // states / variable
  const [expanded, setExpanded] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const allFileIds = getCollectFileIds(folder)
  const selectedCount = allFileIds.filter((id) => selectedIds.has(id)).length
  const isChecked = allFileIds.length > 0 && selectedCount === allFileIds.length
  const isIndeterminate = selectedCount > 0 && selectedCount < allFileIds.length
  const isUploading = uploadingFolderId === folder.id
  const hasContent = folder.children.length > 0 || folder.files.length > 0
  const paddingLeft = depth * 16

  // function / methode
  const syncDropFiles = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files, folder.id)
    }
  }, [folder.id, onDropFiles])

  const syncDragOver = useCallback((e: React.DragEvent) => {
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

  // lifecycle react (implicit - no effects for this component)
  return (
    <div>
      <div
        onDrop={syncDropFiles}
        onDragOver={syncDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <ListCardRow
          selectionNode={
            <KnowledgeBaseMyDriveCheckbox
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
            <KnowledgeBaseMyDriveFolderNode
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
            <KnowledgeBaseMyDriveFileRow
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

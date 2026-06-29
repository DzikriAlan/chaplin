import { Trash2, File } from 'lucide-react'
import type { DataKbMyDriveFile } from '../types/knowledgeBaseMyDriveTypes'
import ListCardRow from '@/shared/components/ListCardRow'

interface FileRowProps {
  file: DataKbMyDriveFile
  depth: number
  isSelected: boolean
  onToggle: () => void
  onDelete: () => void
}

function getFormatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export function KnowledgeBaseMyDriveFileRow({ file, depth, isSelected, onToggle, onDelete }: Readonly<FileRowProps>) {
  // function / methode is defined at module level (getFormatBytes)

  // lifecycle react (implicit - no effects)
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
      subtitle={getFormatBytes(file.size)}
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

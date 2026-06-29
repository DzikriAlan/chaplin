import { SkipForward, RotateCcw, ExternalLink, Trash2 } from 'lucide-react'
import type { DataKbGoogleDrive } from '../types/knowledgeBaseGoogleDriveTypes'
import KnowledgeBaseGoogleDriveCheckboxCell from './KnowledgeBaseGoogleDriveCheckboxCell'
import ListCardRow from '@/shared/components/ListCardRow'

interface DocumentRowProps {
  doc: DataKbGoogleDrive
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDeleteDocument: (id: string) => void
  onSkipDocument: (id: string) => void
  onRetryDocument: (id: string) => void
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Menunggu',  color: 'bg-amber-50   text-amber-700  ring-1 ring-amber-200' },
  PROCESSING: { label: 'Diproses', color: 'bg-blue-50    text-blue-700   ring-1 ring-blue-200'  },
  READY:      { label: 'Siap',     color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  ERROR:      { label: 'Error',    color: 'bg-red-50     text-red-700    ring-1 ring-red-200'   },
}

export default function KnowledgeBaseGoogleDriveRow({ doc, isSelected, onToggleSelect, onDeleteDocument, onSkipDocument, onRetryDocument }: Readonly<DocumentRowProps>) {
  const badge = STATUS_LABELS[doc.status] ?? STATUS_LABELS.PENDING
  const isActive = doc.status === 'PENDING' || doc.status === 'PROCESSING'
  const isError = doc.status === 'ERROR'
  const updatedDate = new Date(doc.updatedAt).toLocaleDateString('id-ID')

  const rowActions = (
    <>
      {isActive && (
        <button type="button" onClick={() => onSkipDocument(doc.id)} className="rounded p-1.5 text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Lewati">
          <SkipForward className="h-3.5 w-3.5" />
        </button>
      )}
      {isError && (
        <button type="button" onClick={() => onRetryDocument(doc.id)} className="rounded p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="Proses ulang">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
      <a href={`https://drive.google.com/file/d/${doc.driveId}`} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Buka di Drive">
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <button type="button" onClick={() => onDeleteDocument(doc.id)} className="rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors" title="Hapus">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </>
  )

  return (
    <ListCardRow
      selectionNode={<KnowledgeBaseGoogleDriveCheckboxCell checked={isSelected} onChange={() => onToggleSelect(doc.id)} />}
      title={doc.title}
      statusBadge={{ label: badge.label, color: badge.color, isAnimating: doc.status === 'PROCESSING' }}
      subtitle={`${doc._count.chunks} chunks`}
      dateBelow={updatedDate}
      inlineSubtitle
      isSelected={isSelected}
      actions={rowActions}
    />
  )
}

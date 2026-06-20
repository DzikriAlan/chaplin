import { FileText, Loader2, SkipForward, RotateCcw, ExternalLink, Trash2 } from 'lucide-react'
import type { DataDocuments } from '../types/documentsTypes'
import CheckboxCell from './CheckboxCell'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Menunggu',  color: 'bg-amber-50   text-amber-700  ring-1 ring-amber-200' },
  PROCESSING: { label: 'Diproses', color: 'bg-blue-50    text-blue-700   ring-1 ring-blue-200'  },
  READY:      { label: 'Siap',     color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  ERROR:      { label: 'Error',    color: 'bg-red-50     text-red-700    ring-1 ring-red-200'   },
}

interface DocumentRowProps {
  doc: DataDocuments
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDeleteDocument: (id: string) => void
  onSkipDocument: (id: string) => void
  onRetryDocument: (id: string) => void
}

export default function DocumentRow({ doc, isSelected, onToggleSelect, onDeleteDocument, onSkipDocument, onRetryDocument }: Readonly<DocumentRowProps>) {
  const badge = STATUS_LABELS[doc.status] ?? STATUS_LABELS.PENDING
  const isActive = doc.status === 'PENDING' || doc.status === 'PROCESSING'
  const isError = doc.status === 'ERROR'

  return (
    <tr
      className={`border-b border-border last:border-0 transition-colors ${
        isSelected ? 'bg-primary/[0.06]' : 'hover:bg-muted/40'
      }`}
    >
      <td className="px-4 py-3 w-10">
        <CheckboxCell checked={isSelected} onChange={() => onToggleSelect(doc.id)} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-rem-90 font-medium text-foreground truncate max-w-xs">{doc.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-rem-75 font-medium ${badge.color}`}>
          {doc.status === 'PROCESSING' && <Loader2 className="h-3 w-3 animate-spin" />}
          {badge.label}
        </span>
      </td>
      <td className="px-4 py-3 text-rem-85 text-muted-foreground tabular-nums">{doc._count.chunks} chunks</td>
      <td className="px-4 py-3 text-rem-85 text-muted-foreground">
        {new Date(doc.updatedAt).toLocaleDateString('id-ID')}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
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
        </div>
      </td>
    </tr>
  )
}

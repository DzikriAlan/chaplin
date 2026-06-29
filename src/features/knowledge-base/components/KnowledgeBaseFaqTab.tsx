import { HelpCircle, Pencil, Trash2 } from 'lucide-react'
import type { DataKbFaq } from '../types/knowledgeBaseFaqTypes'
import KBFaqTableSkeleton from './KnowledgeBaseFaqTableSkeleton'
import ListCardRow from '@/shared/components/ListCardRow'

interface KnowledgeBaseFaqTabProps {
  tabStatus: string
  items: DataKbFaq[]
  onEditFaq: (item: DataKbFaq) => void
  onDeleteFaq: (id: string) => void
}

export default function KnowledgeBaseFaqTab({ tabStatus, items, onEditFaq, onDeleteFaq }: Readonly<KnowledgeBaseFaqTabProps>) {
  return (
    <div>
      {tabStatus === 'loading' && <KBFaqTableSkeleton />}

      {tabStatus === 'empty' && (
        <div className="p-12 text-center">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-rem-100 font-medium text-foreground">Belum ada FAQ</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Tambah FAQ baru dengan tombol di atas</p>
        </div>
      )}

      {tabStatus === 'error' && (
        <div className="p-12 text-center">
          <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
        </div>
      )}

      {tabStatus === 'success' && (
        <div className="divide-y divide-border">
          {items.map((item) => (
            <ListCardRow
              key={item.id}
              title={item.question}
              subtitle={item.answer}
              dateBelow={new Date(item.createdAt).toLocaleDateString('id-ID')}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => onEditFaq(item)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteFaq(item.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

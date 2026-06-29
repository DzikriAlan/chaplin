import toast from 'react-hot-toast'
import type { DataKbFaq } from '../types/knowledgeBaseFaqTypes'
import { useKBFaqControllers } from '../controllers/knowledgeBaseControllers'
import { useKbFaqStates } from '../states/knowledgeBaseFaqStates'
import LoadData from '@/shared/components/LoadData'
import KBFaqItem from './KnowledgeBaseFaqItem'

export default function KnowledgeBaseList() {
  const { kbFaq } = useKbFaqStates()
  const { removeKnowledgeBase } = useKBFaqControllers()
  const items = (kbFaq.data as DataKbFaq[]) ?? []

  const handleDeleteItem = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus FAQ'),
    })
  }

  function getListStatus() {
    if (kbFaq.status === 'loading') return 'loading'
    if (kbFaq.status === 'error') return 'error'
    return items.length === 0 ? 'empty' : 'success'
  }
  const listStatus = getListStatus()

  return (
    <LoadData
      status={listStatus}
      statusTitle="Belum ada FAQ"
      statusSubtitle="Tambah FAQ baru menggunakan form di atas"
    >
      <div className="space-y-3">
        <p className="text-rem-85 text-muted-foreground">{items.length} FAQ aktif</p>
        {items.map((item) => (
          <KBFaqItem key={item.id} item={item} onDeleteItem={handleDeleteItem} />
        ))}
      </div>
    </LoadData>
  )
}

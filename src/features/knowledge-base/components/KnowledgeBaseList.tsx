import toast from 'react-hot-toast'
import type { DataKnowledgeBase } from '../types/knowledgeBaseTypes'
import { useKnowledgeBaseControllers } from '../controllers/knowledgeBaseControllers'
import LoadData from '@/shared/components/LoadData'
import FAQItem from './FAQItem'

export default function KnowledgeBaseList() {
  const { fetchKnowledgeBase, removeKnowledgeBase } = useKnowledgeBaseControllers()
  const items = (fetchKnowledgeBase.data as DataKnowledgeBase[]) ?? []

  const handleDeleteItem = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus FAQ'),
    })
  }

  function getListStatus() {
    if (fetchKnowledgeBase.isLoading) return 'loading'
    if (fetchKnowledgeBase.isError) return 'error'
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
          <FAQItem key={item.id} item={item} onDeleteItem={handleDeleteItem} />
        ))}
      </div>
    </LoadData>
  )
}

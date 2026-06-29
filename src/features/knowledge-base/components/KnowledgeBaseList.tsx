import toast from 'react-hot-toast'
import { useKBFaqControllers } from '../controllers/knowledgeBaseControllers'
import { useKbFaqStates } from '../states/knowledgeBaseFaqStates'
import LoadData from '@/shared/components/LoadData'
import KBFaqItem from './KnowledgeBaseFaqItem'

export default function KnowledgeBaseList() {
  // variable importer
  const { kbFaq } = useKbFaqStates()
  const { removeKnowledgeBase } = useKBFaqControllers()

  // function / methode
  const destroyItem = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus FAQ'),
    })
  }

  const getListStatus = () => {
    if (kbFaq.status === 'loading') return 'loading'
    if (kbFaq.status === 'error') return 'error'
    return kbFaq.data?.length ? 'success' : 'empty'
  }
  const listStatus = getListStatus()

  // lifecycle react
  return (
    <LoadData
      status={listStatus}
      statusTitle="Belum ada FAQ"
      statusSubtitle="Tambah FAQ baru menggunakan form di atas"
    >
      <div className="space-y-3">
        <p className="text-rem-85 text-muted-foreground">{kbFaq.data?.length ?? 0} FAQ aktif</p>
        {kbFaq.data?.map((item) => (
          <KBFaqItem key={item.id} item={item} onDeleteItem={destroyItem} />
        ))}
      </div>
    </LoadData>
  )
}

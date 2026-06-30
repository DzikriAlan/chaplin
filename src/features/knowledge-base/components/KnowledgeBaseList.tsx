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
    if (!confirm('Delete this FAQ?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ deleted successfully'),
      onError: () => toast.error('Failed to delete FAQ'),
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
      statusTitle="No FAQs yet"
      statusSubtitle="Add new FAQ using the form above"
    >
      <div className="space-y-3">
        <p className="text-rem-85 text-muted-foreground">{kbFaq.data?.length ?? 0} active FAQs</p>
        {kbFaq.data?.map((item) => (
          <KBFaqItem key={item.id} item={item} onDeleteItem={destroyItem} />
        ))}
      </div>
    </LoadData>
  )
}

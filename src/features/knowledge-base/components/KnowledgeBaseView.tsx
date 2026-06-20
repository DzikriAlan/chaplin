import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, HelpCircle, FileText, BookOpen, Upload } from 'lucide-react'
import type { DataKnowledgeBase } from '../types/knowledgeBaseTypes'
import { useKnowledgeBaseControllers } from '../controllers/knowledgeBaseControllers'
import KnowledgeBaseModal from './KnowledgeBaseModal'
import DocumentsList from '@/features/documents/components/DocumentsList'
import FAQTableSkeleton from './FAQTableSkeleton'
import FaqManagerView from '@/features/faq-manager/components/FaqManagerView'
import FileUploaderView from '@/features/file-upload/components/FileUploaderView'

type Tab = 'faq' | 'faq-manager' | 'documents' | 'upload'

function getTabStatus(isLoading: boolean, isError: boolean, isEmpty: boolean) {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (isEmpty) return 'empty'
  return 'success'
}

export default function KnowledgeBaseView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('faq')
  const [modalItem, setModalItem] = useState<DataKnowledgeBase | null | undefined>(undefined)

  const { fetchKnowledgeBase, storeKnowledgeBase, removeKnowledgeBase, changeKnowledgeBase } =
    useKnowledgeBaseControllers()

  const items = (fetchKnowledgeBase.data as DataKnowledgeBase[] ?? [])
  const tabStatus = getTabStatus(fetchKnowledgeBase.isLoading, fetchKnowledgeBase.isError, items.length === 0)

  useEffect(() => {
    if (router.query.connected === 'true') {
      setActiveTab('documents')
      toast.success('Google Drive berhasil terhubung!')
      router.replace('/knowledge-base', undefined, { shallow: true })
    }
  }, [router])

  const handleOpenAdd = () => setModalItem(null)
  const handleOpenEdit = (item: DataKnowledgeBase) => setModalItem(item)
  const handleCloseModal = () => setModalItem(undefined)

  const handleSave = (question: string, answer: string, tags: string[]) => {
    if (modalItem) {
      changeKnowledgeBase.mutate(
        { id: modalItem.id, payload: { question, answer, tags } },
        {
          onSuccess: () => { toast.success('FAQ berhasil diperbarui'); handleCloseModal() },
          onError: () => toast.error('Gagal memperbarui FAQ'),
        },
      )
    } else {
      storeKnowledgeBase.mutate(
        { question, answer, tags },
        {
          onSuccess: () => { toast.success('FAQ berhasil ditambahkan'); handleCloseModal() },
          onError: () => toast.error('Gagal menambahkan FAQ'),
        },
      )
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus FAQ'),
    })
  }

  const isSaving = storeKnowledgeBase.isPending || changeKnowledgeBase.isPending

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'faq',         label: 'Knowledge Base', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'faq-manager', label: 'FAQ Manager',    icon: <BookOpen className="h-4 w-4" /> },
    { id: 'documents',   label: 'Dokumen',        icon: <FileText className="h-4 w-4" /> },
    { id: 'upload',      label: 'Upload File',    icon: <Upload className="h-4 w-4" /> },
  ]

  return (
    <>
      {modalItem !== undefined && (
        <KnowledgeBaseModal
          item={modalItem}
          isSaving={isSaving}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto">
            <div className="flex items-center rounded-xl border bg-card p-1 gap-1 shadow-card w-max min-w-full sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-rem-80 sm:px-4 sm:text-rem-85 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'faq' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 transition-colors self-start sm:self-auto shrink-0"
            >
              <Plus className="h-4 w-4" />
              Tambah FAQ
            </button>
          )}
        </div>

        {activeTab === 'faq' && (
          <>
            {tabStatus === 'loading' && <FAQTableSkeleton />}

            {tabStatus === 'empty' && (
              <div className="rounded-xl border bg-card shadow-card p-12 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-rem-100 font-medium text-foreground">Belum ada FAQ</p>
                <p className="text-rem-85 text-muted-foreground mt-1">Tambah FAQ baru dengan tombol di atas</p>
              </div>
            )}

            {tabStatus === 'error' && (
              <div className="rounded-xl border bg-card shadow-card p-12 text-center">
                <p className="text-rem-100 font-medium text-foreground">Terjadi Kesalahan</p>
                <p className="text-rem-85 text-muted-foreground mt-1">Silakan coba lagi.</p>
              </div>
            )}

            {tabStatus === 'success' && (
              <div className="rounded-xl border bg-card shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Pertanyaan</th>
                      <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Jawaban</th>
                      <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Tags</th>
                      <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Dibuat</th>
                      <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 max-w-[220px]">
                          <span className="text-rem-85 font-medium text-foreground line-clamp-2">{item.question}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[280px]">
                          <span className="text-rem-85 text-muted-foreground line-clamp-2">{item.answer}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.length > 0
                              ? item.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-rem-70 font-medium text-primary">{tag}</span>
                                ))
                              : <span className="text-rem-80 text-muted-foreground">—</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-rem-80 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'faq-manager' && <FaqManagerView />}

        {activeTab === 'documents' && <DocumentsList />}

        {activeTab === 'upload' && <FileUploaderView />}
      </div>
    </>
  )
}

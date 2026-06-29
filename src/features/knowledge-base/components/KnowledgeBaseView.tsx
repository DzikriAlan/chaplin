import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, HelpCircle, FileText, Upload, ChevronDown, RefreshCw, Cloud, CloudOff, FolderPlus, FolderOpen, Unlink } from 'lucide-react'
import type { DataKbFaq } from '../types/knowledgeBaseFaqTypes'
import { useKBFaqControllers } from '../controllers/knowledgeBaseControllers'
import { useKbFaqStates } from '../states/knowledgeBaseFaqStates'
import { useKBGoogleDriveHelperControllers } from '../controllers/knowledgeBaseGoogleDriveHelperControllers'
import KnowledgeBaseModal from './KnowledgeBaseModal'
import KnowledgeBaseGoogleDriveList from './KnowledgeBaseGoogleDriveList'
import KBFaqTableSkeleton from './KnowledgeBaseFaqTableSkeleton'
import KnowledgeBaseMyDriveUploader from './KnowledgeBaseMyDriveUploader'
import ListCardRow from '@/shared/components/ListCardRow'

type Tab = 'faq' | 'documents' | 'upload'

interface DriveConfig {
  folderName?: string
}

function getTabStatus(isLoading: boolean, isError: boolean, isEmpty: boolean) {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (isEmpty) return 'empty'
  return 'success'
}

export default function KnowledgeBaseView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('faq')
  const [modalItem, setModalItem] = useState<DataKbFaq | null | undefined>(undefined)
  const [kbGoogleDriveSyncSignal, setKbGoogleDriveSyncSignal] = useState(0)
  const [kbGoogleDriveFolderPickerSignal, setKbGoogleDriveFolderPickerSignal] = useState(0)
  const [myDriveFolderSignal, setMyDriveFolderSignal] = useState(0)
  const [myDriveUploadSignal, setMyDriveUploadSignal] = useState(0)

  const { kbFaq } = useKbFaqStates()
  const { storeKnowledgeBase, removeKnowledgeBase, changeKnowledgeBase } = useKBFaqControllers()
  const { fetchDriveConfig, removeDriveConfig } = useKBGoogleDriveHelperControllers(false)
  const driveConfig = fetchDriveConfig.data as DriveConfig | undefined

  const handleDisconnectDrive = () => {
    if (!confirm('Putuskan koneksi Google Drive?')) return
    removeDriveConfig.mutate(undefined, { onSuccess: () => toast.success('Koneksi diputus') })
  }

  const items = (kbFaq.data as DataKbFaq[] ?? [])
  const tabStatus = getTabStatus(kbFaq.status === 'loading', kbFaq.status === 'error', items.length === 0)

  useEffect(() => {
    if (router.query.connected === 'true') {
      setActiveTab('documents')
      toast.success('Google Drive berhasil terhubung!')
      router.replace('/knowledge-base', undefined, { shallow: true })
    }
  }, [router])

  const handleOpenAdd = () => setModalItem(null)
  const handleOpenEdit = (item: DataKbFaq) => setModalItem(item)
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
    { id: 'faq',       label: 'FAQ',          icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'documents', label: 'Google Drive', icon: <FileText className="h-4 w-4" /> },
    { id: 'upload',    label: 'My Drive',     icon: <Upload className="h-4 w-4" /> },
  ]

  function getActionButton() {
    if (activeTab === 'faq') {
      return (
        <div className="flex items-center rounded-xl border bg-card shadow-card p-1 sm:contents">
          <button type="button" onClick={handleOpenAdd} className="flex items-center justify-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-4 sm:py-2 sm:text-rem-85 sm:font-medium">
            <Plus className="h-4 w-4" /><span className="hidden sm:inline">Tambah FAQ</span>
          </button>
        </div>
      )
    }
    if (activeTab === 'documents') {
      return (
        <div className="flex items-center gap-1 rounded-xl border bg-card shadow-card p-1 shrink-0 sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:p-0">
          {driveConfig && (
            <>
              <span className="hidden sm:flex items-center gap-1.5 text-rem-85 text-muted-foreground">
                <Cloud className="h-4 w-4 shrink-0" />
                {driveConfig.folderName ?? 'My Drive'}
              </span>
              <button
                type="button"
                onClick={() => setKbGoogleDriveFolderPickerSignal((v) => v + 1)}
                className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 sm:p-0 sm:gap-1 sm:text-rem-80 sm:font-medium sm:text-primary sm:hover:bg-transparent sm:hover:underline sm:hover:text-primary"
              >
                <FolderOpen className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Ganti</span>
              </button>
              <button
                type="button"
                onClick={handleDisconnectDrive}
                className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors shrink-0 sm:p-1 sm:rounded"
                title="Putuskan koneksi Drive"
              >
                <Unlink className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>
            </>
          )}
          {driveConfig ? (
            <button
              type="button"
              onClick={() => setKbGoogleDriveSyncSignal((v) => v + 1)}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-4 sm:py-2 sm:text-rem-85 sm:font-medium"
            >
              <RefreshCw className="h-4 w-4" /><span className="hidden sm:inline">Sync</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setKbGoogleDriveFolderPickerSignal((v) => v + 1)}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-4 sm:py-2 sm:text-rem-85 sm:font-medium"
            >
              <CloudOff className="h-4 w-4" /><span className="hidden sm:inline">Hubungkan Drive</span>
            </button>
          )}
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 rounded-xl border bg-card shadow-card p-1 shrink-0 sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:p-0">
        <button
          type="button"
          onClick={() => setMyDriveFolderSignal((v) => v + 1)}
          className="flex items-center justify-center gap-1.5 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 sm:border sm:bg-card sm:px-3 sm:py-2 sm:text-rem-85 sm:font-medium sm:text-foreground sm:hover:bg-muted"
        >
          <FolderPlus className="h-4 w-4" /><span className="hidden sm:inline">Folder Baru</span>
        </button>
        <button
          type="button"
          onClick={() => setMyDriveUploadSignal((v) => v + 1)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-3 sm:py-2 sm:text-rem-85 sm:font-medium"
        >
          <Upload className="h-4 w-4" /><span className="hidden sm:inline">Upload File</span>
        </button>
      </div>
    )
  }

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

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Mobile header: action button left, dropdown right */}
        <div className="flex items-center justify-between sm:hidden">
          {getActionButton()}
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as Tab)}
              className="appearance-none rounded-lg border bg-card pl-3 pr-8 py-2 text-rem-85 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Desktop header: tab bar left, action button right */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center rounded-xl border bg-card p-1 gap-1 shadow-card">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-rem-85 font-medium transition-colors whitespace-nowrap ${
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
          {getActionButton()}
        </div>

        {activeTab !== 'upload' && (
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            {activeTab === 'faq' && (
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
                          </>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <KnowledgeBaseGoogleDriveList
                syncSignal={kbGoogleDriveSyncSignal}
                openFolderPickerSignal={kbGoogleDriveFolderPickerSignal}
              />
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <KnowledgeBaseMyDriveUploader openFolderFormSignal={myDriveFolderSignal} openUploadSignal={myDriveUploadSignal} />
        )}
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { FileText, Upload, ChevronDown, HelpCircle } from 'lucide-react'
import type { DataKbFaq } from '../types/knowledgeBaseFaqTypes'
import { useKBFaqControllers } from '../controllers/knowledgeBaseControllers'
import { useKbFaqStates } from '../states/knowledgeBaseFaqStates'
import { useKBGoogleDriveHelperControllers } from '../controllers/knowledgeBaseGoogleDriveHelperControllers'
import KnowledgeBaseModal from './KnowledgeBaseModal'
import KnowledgeBaseGoogleDriveList from './KnowledgeBaseGoogleDriveList'
import KnowledgeBaseMyDriveUploader from './KnowledgeBaseMyDriveUploader'
import KnowledgeBaseActionBar from './KnowledgeBaseActionBar'
import KnowledgeBaseFaqTab from './KnowledgeBaseFaqTab'

type Tab = 'faq' | 'documents' | 'upload'

interface DriveConfig {
  folderName?: string
}

export default function KnowledgeBaseView() {
  // variable importer
  const router = useRouter()
  const { kbFaq } = useKbFaqStates()
  const { storeKnowledgeBase, removeKnowledgeBase, changeKnowledgeBase } = useKBFaqControllers()
  const { fetchDriveConfig, removeDriveConfig } = useKBGoogleDriveHelperControllers(false)
  const driveConfig = fetchDriveConfig.data as DriveConfig | undefined

  // states / variable
  const [activeTab, setActiveTab] = useState<Tab>('faq')
  const [modalItem, setModalItem] = useState<DataKbFaq | null | undefined>(undefined)
  const [kbGoogleDriveSyncSignal, setKbGoogleDriveSyncSignal] = useState(0)
  const [kbGoogleDriveFolderPickerSignal, setKbGoogleDriveFolderPickerSignal] = useState(0)
  const [myDriveFolderSignal, setMyDriveFolderSignal] = useState(0)
  const [myDriveUploadSignal, setMyDriveUploadSignal] = useState(0)

  const items = kbFaq.data ?? []
  const isSaving = storeKnowledgeBase.isPending || changeKnowledgeBase.isPending

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'faq',       label: 'FAQ',          icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'documents', label: 'Google Drive', icon: <FileText className="h-4 w-4" /> },
    { id: 'upload',    label: 'My Drive',     icon: <Upload className="h-4 w-4" /> },
  ]

  // function / methode
  const getTabStatus = (isLoading: boolean, isError: boolean, isEmpty: boolean) => {
    if (isLoading) return 'loading'
    if (isError) return 'error'
    if (isEmpty) return 'empty'
    return 'success'
  }
  const tabStatus = getTabStatus(kbFaq.status === 'loading', kbFaq.status === 'error', items.length === 0)

  const syncGoogleDrive = () => setKbGoogleDriveSyncSignal((v) => v + 1)
  const loadFolderPicker = () => setKbGoogleDriveFolderPickerSignal((v) => v + 1)
  const loadNewFolder = () => setMyDriveFolderSignal((v) => v + 1)
  const loadUploadFile = () => setMyDriveUploadSignal((v) => v + 1)
  const loadAdd = () => setModalItem(null)
  const loadEdit = (item: DataKbFaq) => setModalItem(item)
  const destroyModal = () => setModalItem(undefined)

  const destroyDriveConfig = () => {
    if (!confirm('Putuskan koneksi Google Drive?')) return
    removeDriveConfig.mutate(undefined, { onSuccess: () => toast.success('Koneksi diputus') })
  }

  const saveFaq = (question: string, answer: string, tags: string[]) => {
    if (modalItem) {
      changeKnowledgeBase.mutate(
        { id: modalItem.id, payload: { question, answer, tags } },
        {
          onSuccess: () => { toast.success('FAQ berhasil diperbarui'); destroyModal() },
          onError: () => toast.error('Gagal memperbarui FAQ'),
        },
      )
    } else {
      storeKnowledgeBase.mutate(
        { question, answer, tags },
        {
          onSuccess: () => { toast.success('FAQ berhasil ditambahkan'); destroyModal() },
          onError: () => toast.error('Gagal menambahkan FAQ'),
        },
      )
    }
  }

  const destroyFaq = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeKnowledgeBase.mutate(id, {
      onSuccess: () => toast.success('FAQ berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus FAQ'),
    })
  }

  // lifecycle react
  useEffect(() => {
    if (router.query.connected === 'true') {
      setActiveTab('documents')
      toast.success('Google Drive berhasil terhubung!')
      router.replace('/knowledge-base', undefined, { shallow: true })
    }
  }, [router])

  return (
    <>
      {modalItem !== undefined && (
        <KnowledgeBaseModal
          item={modalItem}
          isSaving={isSaving}
          onSave={saveFaq}
          onClose={destroyModal}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Mobile header: action button left, dropdown right */}
        <div className="flex items-center justify-between sm:hidden">
          <KnowledgeBaseActionBar
            activeTab={activeTab}
            driveConfig={driveConfig}
            onAddFaq={loadAdd}
            onSyncDrive={syncGoogleDrive}
            onPickFolder={loadFolderPicker}
            onDisconnectDrive={destroyDriveConfig}
            onNewFolder={loadNewFolder}
            onUploadFile={loadUploadFile}
          />
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
          <KnowledgeBaseActionBar
            activeTab={activeTab}
            driveConfig={driveConfig}
            onAddFaq={loadAdd}
            onSyncDrive={syncGoogleDrive}
            onPickFolder={loadFolderPicker}
            onDisconnectDrive={destroyDriveConfig}
            onNewFolder={loadNewFolder}
            onUploadFile={loadUploadFile}
          />
        </div>

        {activeTab !== 'upload' && (
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            {activeTab === 'faq' && (
              <KnowledgeBaseFaqTab
                tabStatus={tabStatus}
                items={items}
                onEditFaq={loadEdit}
                onDeleteFaq={destroyFaq}
              />
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
          <KnowledgeBaseMyDriveUploader
            openFolderFormSignal={myDriveFolderSignal}
            openUploadSignal={myDriveUploadSignal}
          />
        )}
      </div>
    </>
  )
}

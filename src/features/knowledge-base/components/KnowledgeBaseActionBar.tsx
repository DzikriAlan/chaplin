import { Plus, RefreshCw, Cloud, CloudOff, FolderOpen, Unlink, FolderPlus, Upload } from 'lucide-react'

type Tab = 'faq' | 'documents' | 'upload'

interface KnowledgeBaseActionBarProps {
  activeTab: Tab
  driveConfig: { folderName?: string } | undefined
  onAddFaq: () => void
  onSyncDrive: () => void
  onPickFolder: () => void
  onDisconnectDrive: () => void
  onNewFolder: () => void
  onUploadFile: () => void
}

export default function KnowledgeBaseActionBar({
  activeTab,
  driveConfig,
  onAddFaq,
  onSyncDrive,
  onPickFolder,
  onDisconnectDrive,
  onNewFolder,
  onUploadFile,
}: Readonly<KnowledgeBaseActionBarProps>) {
  if (activeTab === 'faq') {
    return (
      <div className="flex items-center rounded-xl border bg-card shadow-card p-1 sm:contents">
        <button
          type="button"
          onClick={onAddFaq}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-4 sm:py-2 sm:text-rem-85 sm:font-medium"
        >
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
              onClick={onPickFolder}
              className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 sm:p-0 sm:gap-1 sm:text-rem-80 sm:font-medium sm:text-primary sm:hover:bg-transparent sm:hover:underline sm:hover:text-primary"
            >
              <FolderOpen className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Ganti</span>
            </button>
            <button
              type="button"
              onClick={onDisconnectDrive}
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
            onClick={onSyncDrive}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-4 sm:py-2 sm:text-rem-85 sm:font-medium"
          >
            <RefreshCw className="h-4 w-4" /><span className="hidden sm:inline">Sync</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPickFolder}
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
        onClick={onNewFolder}
        className="flex items-center justify-center gap-1.5 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 sm:border sm:bg-card sm:px-3 sm:py-2 sm:text-rem-85 sm:font-medium sm:text-foreground sm:hover:bg-muted"
      >
        <FolderPlus className="h-4 w-4" /><span className="hidden sm:inline">Folder Baru</span>
      </button>
      <button
        type="button"
        onClick={onUploadFile}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 sm:px-3 sm:py-2 sm:text-rem-85 sm:font-medium"
      >
        <Upload className="h-4 w-4" /><span className="hidden sm:inline">Upload File</span>
      </button>
    </div>
  )
}

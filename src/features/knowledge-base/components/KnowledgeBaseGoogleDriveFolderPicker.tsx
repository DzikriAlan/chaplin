import { Folder, X, Check } from 'lucide-react'
import type { DataDriveFolders } from '../types/knowledgeBaseGoogleDriveHelperTypes'
import Loader from '@/shared/components/Loader'

interface Props {
  folders: DataDriveFolders[]
  isLoading: boolean
  isSaving: boolean
  onSelectFolder: (folder: DataDriveFolders) => void
  onClose: () => void
}

export default function KnowledgeBaseGoogleDriveFolderPicker({ folders, isLoading, isSaving, onSelectFolder, onClose }: Readonly<Props>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-rem-120 font-bold text-dark-text">Pilih Folder</h2>
            <p className="text-rem-80 text-muted-foreground mt-0.5">AI hanya akan membaca dokumen dari folder ini</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-muted-foreground hover:text-dark-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onSelectFolder({ id: 'root', name: 'My Drive (semua file)' })}
              className="w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <Folder className="h-5 w-5 text-primary shrink-0" />
              <span className="text-rem-90 font-medium text-dark-text">My Drive (semua file)</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                disabled={isSaving}
                onClick={() => onSelectFolder(folder)}
                className="group w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left hover:bg-muted disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <Loader size="sm" inline />
                ) : (
                  <Folder className="h-5 w-5 text-primary shrink-0" />
                )}
                <span className="text-rem-90 font-medium text-dark-text">{folder.name}</span>
                <Check className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100" />
              </button>
            ))}

            {folders.length === 0 && !isLoading && (
              <p className="text-center text-rem-85 text-muted-foreground py-6">
                Tidak ada folder di Google Drive kamu
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

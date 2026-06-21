import { useRef } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { ALLOWED_TYPES, type UploadedFile } from './chatFileUtils'
import UploadedFilesBar from './UploadedFilesBar'

interface ChatInputBarProps {
  value: string
  isLoading: boolean
  onChangeValue: (v: string) => void
  onSubmit: () => void
  onUploadFiles: (files: FileList) => void
  uploadedFiles: UploadedFile[]
  onRemoveFile: (id: string) => void
  onPreviewImage: (file: UploadedFile) => void
  variant?: 'centered' | 'bottom'
}

export default function ChatInputBar({
  value, isLoading, onChangeValue, onSubmit,
  onUploadFiles, uploadedFiles, onRemoveFile, onPreviewImage, variant = 'bottom',
}: Readonly<ChatInputBarProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files)
      e.target.value = ''
    }
  }

  const isDisabled = isLoading || (!value.trim() && uploadedFiles.length === 0)

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      onChange={handleFileChange}
      accept={ALLOWED_TYPES.join(',')}
      multiple
      className="hidden"
    />
  )

  if (variant === 'centered') {
    return (
      <div className="space-y-2">
        {hiddenInput}
        {uploadedFiles.length > 0 && (
          <div className="rounded-2xl border bg-white dark:bg-card px-4 py-2">
            <UploadedFilesBar files={uploadedFiles} onRemoveFile={onRemoveFile} onPreviewImage={onPreviewImage} />
          </div>
        )}
        <div className="flex items-center gap-3 rounded-full border bg-white dark:bg-card shadow-soft px-4 py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Upload file"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            value={value}
            onChange={(e) => onChangeValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja"
            rows={1}
            className="flex-1 resize-none bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-600 text-white hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-white dark:bg-card shadow-card">
      {hiddenInput}
      <UploadedFilesBar files={uploadedFiles} onRemoveFile={onRemoveFile} onPreviewImage={onPreviewImage} />
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          title="Upload file"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition-colors"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <textarea
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What would you like to know?"
          rows={1}
          className="flex-1 resize-none bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isDisabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-600 text-white hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

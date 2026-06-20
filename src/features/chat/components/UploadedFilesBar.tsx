import { X, FileText } from 'lucide-react'
import { isImageType, formatFileSize, type UploadedFile } from './chatFileUtils'

interface UploadedFilesBarProps {
  files: UploadedFile[]
  onRemoveFile: (id: string) => void
  onPreviewImage: (file: UploadedFile) => void
}

export default function UploadedFilesBar({ files, onRemoveFile, onPreviewImage }: Readonly<UploadedFilesBarProps>) {
  if (files.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="relative group flex items-center gap-2 rounded-lg border bg-muted/40 px-2.5 py-1.5 max-w-xs"
        >
          {isImageType(file.type) ? (
            <button
              type="button"
              onClick={() => onPreviewImage(file)}
              className="relative h-8 w-8 shrink-0 overflow-hidden rounded cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.dataUrl} alt={file.name} className="h-full w-full object-cover" />
            </button>
          ) : (
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p className="text-rem-75 font-medium text-foreground truncate max-w-[160px]">{file.name}</p>
            <p className="text-rem-65 text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemoveFile(file.id)}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

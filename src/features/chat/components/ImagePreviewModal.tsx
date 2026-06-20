import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { UploadedFile } from './chatFileUtils'

interface ImagePreviewModalProps {
  file: UploadedFile
  onClose: () => void
}

export default function ImagePreviewModal({ file, onClose }: Readonly<ImagePreviewModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (el && !el.open) {
      el.showModal()
    }
  }, [])

  function handleCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    e.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none bg-transparent backdrop:bg-black/70 w-full h-full max-w-none max-h-none"
    >
      <div className="relative max-w-4xl max-h-[90vh] z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.dataUrl} alt={file.name} className="max-w-full max-h-[85vh] rounded-xl object-contain" />
        <p className="text-center text-white/80 text-rem-80 mt-2">{file.name}</p>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </dialog>
  )
}

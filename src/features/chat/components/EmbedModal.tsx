import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Code2, X, Copy, Check as CheckIcon } from 'lucide-react'
import { getDocuments } from '@/features/documents/services/documentsServices'

interface EmbedDoc { id: string; title: string; status: string }

interface EmbedModalProps {
  baseUrl: string
  onClose: () => void
}

export default function EmbedModal({ baseUrl, onClose }: Readonly<EmbedModalProps>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const getEmbedText = (src: string) =>
    `<iframe\n  src="${src}"\n  width="100%"\n  height="600"\n  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);"\n  allow="clipboard-write"\n></iframe>`

  const { data: docsRaw, isLoading: docsLoading } = useQuery({
    queryKey: ['embed-modal-docs'],
    queryFn: async () => {
      const data = await getDocuments()
      return (data ?? []) as EmbedDoc[]
    },
  })

  const availableDocs = (docsRaw ?? []).filter((d) => d.status === 'READY')

  const toggleDoc = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const docsParam = selectedIds.size > 0 ? `?docs=${Array.from(selectedIds).join(',')}` : ''
  const embedSrc = `${baseUrl}/embed/chat${docsParam}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getEmbedText(embedSrc))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <h2 className="text-rem-100 font-semibold text-foreground">Embed Chatbot</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-rem-85 font-medium text-foreground">Dokumen konteks chatbot</p>
            <p className="text-rem-75 text-muted-foreground">Kosongkan untuk semua dokumen.</p>
            {docsLoading && <div className="flex justify-center py-4"><span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>}
            {!docsLoading && availableDocs.length > 0 && (
              <div className="max-h-44 overflow-y-auto rounded-lg border divide-y">
                {availableDocs.map((doc) => {
                  const checked = selectedIds.has(doc.id)
                  return (
                    <label key={doc.id} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? 'bg-primary/[0.06]' : 'hover:bg-muted/40'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleDoc(doc.id)} className="peer sr-only" />
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${checked ? 'border-primary bg-primary' : 'border-border bg-background'}`}>
                        {checked && <CheckIcon className="h-2.5 w-2.5 text-white stroke-[3]" />}
                      </span>
                      <span className="text-rem-85 text-foreground truncate">{doc.title}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-rem-85 font-medium text-foreground">Script HTML</p>
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg border bg-muted/30 px-4 py-3.5 text-rem-75 font-mono leading-relaxed whitespace-pre text-foreground">
                {getEmbedText(embedSrc)}
              </pre>
              <button type="button" onClick={handleCopy} className="absolute right-2 top-2 flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-rem-75 font-medium text-foreground hover:bg-muted transition-colors">
                {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t px-5 py-3 flex justify-end shrink-0">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-rem-85 font-medium text-foreground hover:bg-muted transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  )
}

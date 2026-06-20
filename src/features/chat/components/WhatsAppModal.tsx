import { useState } from 'react'
import { MessageCircle, X, Copy, Check as CheckIcon, ExternalLink } from 'lucide-react'

interface WhatsAppModalProps {
  onClose: () => void
}

export default function WhatsAppModal({ onClose }: Readonly<WhatsAppModalProps>) {
  const [copied, setCopied] = useState(false)

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6281234567890'
  const waLink = `https://wa.me/${phoneNumber}`

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(phoneNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnectWhatsApp = () => {
    globalThis.window?.open(waLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <h2 className="text-rem-100 font-semibold text-foreground">WhatsApp Integration</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-rem-85 text-emerald-800 font-medium">Hubungkan chatbot AI Anda ke WhatsApp</p>
            <p className="text-rem-75 text-emerald-700 mt-0.5">
              Pelanggan dapat berinteraksi dengan AI melalui WhatsApp secara langsung.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-rem-80 font-medium text-foreground">Nomor WhatsApp AI</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border bg-muted/60 px-3 py-2 text-rem-90 font-mono text-foreground tabular-nums">
                  +{phoneNumber}
                </code>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
                  title="Salin nomor"
                >
                  {copied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConnectWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-rem-90 font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Buka WhatsApp
            </button>
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-rem-80 font-medium text-foreground">Cara integrasi:</p>
            <ol className="list-decimal pl-5 text-rem-80 text-muted-foreground space-y-1">
              <li>Simpan nomor WhatsApp AI di atas</li>
              <li>Buka WhatsApp dan mulai percakapan</li>
              <li>AI akan otomatis merespons berdasarkan knowledge base</li>
            </ol>
          </div>
        </div>

        <div className="border-t px-5 py-3 flex justify-end shrink-0">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-rem-85 font-medium text-foreground hover:bg-muted transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  )
}

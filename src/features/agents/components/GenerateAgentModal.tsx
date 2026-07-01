'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { generateAgent } from '../services/agentsServices'
import type { AgentPrefillData } from './AgentForm'

interface GenerateAgentModalProps {
  open: boolean
  onClose: () => void
  onGenerated: (data: AgentPrefillData) => void
}

export default function GenerateAgentModal({ open, onClose, onGenerated }: Readonly<GenerateAgentModalProps>) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setPrompt('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    setError('')
    try {
      const result = await generateAgent(prompt.trim())
      onGenerated(result)
      onClose()
    } catch {
      setError('Gagal generate agent. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleGenerate()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-rem-110 font-bold text-foreground">Generate Agent AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-rem-85 text-muted-foreground">
          Deskripsikan agent yang ingin Anda buat. AI akan otomatis mengisi form untuk Anda.
        </p>

        <div>
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder='Contoh: "buatkan agent sepak bola yang ahli statistik pemain"'
            disabled={isLoading}
            className="w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          {error && <p className="text-rem-80 text-destructive mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-rem-90 font-medium text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={!prompt.trim() || isLoading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-rem-90 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

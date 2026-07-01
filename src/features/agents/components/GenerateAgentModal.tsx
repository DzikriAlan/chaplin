'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, ArrowRight } from 'lucide-react'
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
      setTimeout(() => inputRef.current?.focus(), 80)
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
      />

      {/* Sheet / Dialog */}
      <div className="relative w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="px-6 pb-6 pt-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-rem-80 font-semibold text-primary uppercase tracking-widest">AI Generate</span>
              </div>
              <h2 className="text-rem-130 font-bold text-foreground tracking-tight leading-snug">
                Deskripsikan agent<br className="hidden sm:block" /> yang kamu inginkan
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2">
            {['Asisten sepak bola', 'Chef masakan Indonesia', 'Tutor matematika'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="rounded-full border border-border/80 px-3 py-1 text-rem-75 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="space-y-1.5">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder='Contoh: "buatkan agent chef yang spesialis masakan Jawa"'
              disabled={isLoading}
              className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-rem-95 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-colors"
            />
            {error && <p className="text-rem-80 text-destructive">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-rem-75 text-muted-foreground">Enter untuk generate</p>
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={!prompt.trim() || isLoading}
              className="group flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-rem-90 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70 animate-bounce [animation-delay:300ms]" />
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

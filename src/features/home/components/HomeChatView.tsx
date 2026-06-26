'use client'

import { useState } from 'react'
import { Bot, ArrowUp, Database, Wallet, Plus } from 'lucide-react'
import Link from 'next/link'

interface QuickLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  description: string
}

function QuickLink({ href, icon, label, description }: Readonly<QuickLinkProps>) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/50 transition-colors"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-rem-90 font-semibold text-foreground">{label}</p>
        <p className="text-rem-80 text-muted-foreground mt-0.5">{description}</p>
      </div>
    </Link>
  )
}

export default function HomeChatView() {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!message.trim()) return
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Apa yang bisa saya bantu?</h1>
          <p className="mt-2 text-rem-90 text-muted-foreground">Mulai percakapan baru atau jelajahi fitur lainnya.</p>
        </div>

        {/* Chat input */}
        <div className="mb-6 rounded-2xl border border-border bg-card shadow-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan Anda..."
            rows={3}
            className="w-full resize-none rounded-t-2xl bg-transparent px-4 pt-4 pb-2 text-rem-90 text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="flex items-center justify-end px-4 pb-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
              aria-label="Kirim pesan"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            href="/home"
            icon={<Plus className="h-4 w-4 text-primary" />}
            label="New Chat"
            description="Mulai percakapan baru"
          />
          <QuickLink
            href="/knowledge-base"
            icon={<Database className="h-4 w-4 text-primary" />}
            label="Knowledge Base"
            description="Kelola dokumen & data"
          />
          <QuickLink
            href="/usage"
            icon={<Wallet className="h-4 w-4 text-primary" />}
            label="Usage & Saldo"
            description="Pantau kredit & penggunaan"
          />
        </div>
      </div>
    </div>
  )
}

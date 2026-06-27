'use client'

import { useState } from 'react'
import { Plus, ArrowUp } from 'lucide-react'
import { useSession } from 'next-auth/react'

const defaultName = process.env.NEXT_PUBLIC_USER_NAME ?? 'Anda'

export default function HomeChatView() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  const displayName = session?.user?.name?.split(' ')[0] ?? defaultName

  const handleSubmit = () => {
    if (!message.trim()) return
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-semibold text-foreground tracking-tight">
          Senang bertemu dengan Anda, {displayName}.
        </h1>

        <div className="flex items-center gap-3 rounded-full border border-border bg-muted/60 px-4 py-3">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Tambah"
            className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja"
            className="flex-1 bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground outline-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim()}
            aria-label="Kirim pesan"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:opacity-80 transition-opacity"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

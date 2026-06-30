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
      <div className="relative isolate w-full max-w-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold text-foreground tracking-tight">
          Hello {displayName}, this is chaplin!
        </h1>

        {/* Red glow — light mode */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 dark:hidden"
          style={{
            width: '1100px',
            height: '420px',
            background:
              'radial-gradient(ellipse at center, rgba(251, 113, 133, 0.45) 0%, rgba(244, 63, 94, 0.22) 40%, transparent 70%)',
            filter: 'blur(52px)',
          }}
        />

        {/* Red glow — dark mode */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 hidden dark:block"
          style={{
            width: '1100px',
            height: '420px',
            background:
              'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.30) 0%, rgba(185, 28, 28, 0.14) 45%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-3">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Add"
            className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="flex-1 bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground outline-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim()}
            aria-label="Send message"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:opacity-80 transition-opacity"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

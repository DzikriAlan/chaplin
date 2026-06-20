import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Search, MessageCircle, Clock, X } from 'lucide-react'
import { useUIStates } from '@/shared/states/uiStates'
import { useChatSessionsControllers } from '../controllers/chatControllers'
import type { DataChatSessions } from '../types/chatTypes'

function formatRelativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffHours < 1) return 'Baru saja'
  if (diffHours < 24) return `${diffHours}j yang lalu`
  if (diffDays < 7) return `${diffDays}h yang lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

interface SessionItemProps {
  session: DataChatSessions
  isActive: boolean
  onSelectSession: (sessionId: string) => void
}

function SessionItem({ session, isActive, onSelectSession }: Readonly<SessionItemProps>) {
  const label = session.title ?? session.lastMessage ?? 'New conversation'
  const displayLabel = label.length > 60 ? `${label.slice(0, 60)}...` : label

  return (
    <button
      type="button"
      onClick={() => onSelectSession(session.sessionId)}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
    >
      <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-rem-85 font-medium text-foreground truncate">{displayLabel}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-rem-75 text-muted-foreground">{formatRelativeTime(session.lastActivity)}</span>
          <span className="text-rem-75 text-muted-foreground">·</span>
          <span className="text-rem-75 text-muted-foreground">{session.messageCount} pesan</span>
        </div>
      </div>
    </button>
  )
}

export default function ChatSearchModal() {
  const router = useRouter()
  const { searchModalOpen, setSearchModalOpen, setChatSessionId, chatSessionId } = useUIStates()
  const { fetchChatSessions } = useChatSessionsControllers()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const sessions = (fetchChatSessions.data ?? []) as DataChatSessions[]
  const filteredSessions = query.trim()
    ? sessions.filter((s) => {
        const q = query.toLowerCase()
        return s.title?.toLowerCase().includes(q) || s.lastMessage?.toLowerCase().includes(q)
      })
    : sessions

  function handleClose() {
    setSearchModalOpen(false)
  }

  function handleSelectSession(sessionId: string) {
    setChatSessionId(sessionId)
    if (router.pathname !== '/chat') router.push('/chat')
    handleClose()
  }

  useEffect(() => {
    if (!searchModalOpen) setQuery('')
  }, [searchModalOpen])

  useEffect(() => {
    if (!searchModalOpen) return
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [searchModalOpen])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSearchModalOpen])

  useEffect(() => {
    if (!searchModalOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSearchModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchModalOpen, setSearchModalOpen])

  if (!searchModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24 px-4">
      <div role="dialog" aria-label="Cari percakapan" className="w-full max-w-lg rounded-xl border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            id="chat-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari percakapan..."
            className="flex-1 bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {fetchChatSessions.isLoading && (
            <p className="px-4 py-6 text-center text-rem-85 text-muted-foreground">Memuat...</p>
          )}
          {!fetchChatSessions.isLoading && filteredSessions.length === 0 && (
            <p className="px-4 py-6 text-center text-rem-85 text-muted-foreground">
              {query ? 'Tidak ada hasil untuk pencarian ini.' : 'Belum ada percakapan.'}
            </p>
          )}
          {filteredSessions.map((s) => (
            <SessionItem
              key={s.sessionId}
              session={s}
              isActive={s.sessionId === chatSessionId}
              onSelectSession={handleSelectSession}
            />
          ))}
        </div>

        <div className="border-t px-4 py-2 flex items-center gap-2">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-rem-70 text-muted-foreground font-mono">⌘K</kbd>
          <span className="text-rem-75 text-muted-foreground">untuk membuka</span>
          <span className="text-rem-75 text-muted-foreground">·</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-rem-70 text-muted-foreground font-mono">ESC</kbd>
          <span className="text-rem-75 text-muted-foreground">untuk menutup</span>
        </div>
      </div>
    </div>
  )
}

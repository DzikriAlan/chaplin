import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronDown, MessageCircle, Trash2, Edit2, Check, X } from 'lucide-react'
import { api } from '@/shared/lib/api'

interface Conversation {
  sessionId: string
  title: string | null
  createdAt: string
  updatedAt: string
}

interface ConversationHistoryProps {
  collapsed?: boolean
}

export default function ConversationHistory({ collapsed }: Readonly<ConversationHistoryProps>) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const fetchConversations = async () => {
    try {
      const data = await api('GET', '/chat/conversations')
      if (Array.isArray(data)) {
        setConversations(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchConversations()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.startsWith('/chat/')) {
        void fetchConversations()
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events])

  const handleDeleteConversation = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    try {
      await api('DELETE', `/chat/conversations/${sessionId}`)
      setConversations((prev) => prev.filter((c) => c.sessionId !== sessionId))
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const handleRenameStart = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    setEditingId(conv.sessionId)
    setEditTitle(conv.title || '')
  }

  const handleRenameSave = async (sessionId: string) => {
    if (!editTitle.trim()) return
    try {
      await api('POST', `/chat/conversations/${sessionId}/rename`, { title: editTitle })
      setConversations((prev) =>
        prev.map((c) => (c.sessionId === sessionId ? { ...c, title: editTitle } : c))
      )
      setEditingId(null)
    } catch (error) {
      console.error('Failed to rename conversation:', error)
    }
  }

  const handleRenameCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }

  if (collapsed || isLoading) return null

  return (
    <div className="px-2 py-3 shrink-0 border-t border-border">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-rem-85 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
        Chat History
      </button>

      {isExpanded && conversations.length > 0 && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
          {conversations.map((conv) => (
            <div key={conv.sessionId} className="group rounded-md">
              {editingId === conv.sessionId ? (
                <div className="flex items-center gap-1 px-2 py-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-2 py-1 rounded text-rem-85 bg-black/30 text-foreground border border-border outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleRenameSave(conv.sessionId)
                      if (e.key === 'Escape') handleRenameCancel()
                    }}
                  />
                  <button
                    onClick={() => void handleRenameSave(conv.sessionId)}
                    className="p-1 text-green-400 hover:text-green-300"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={handleRenameCancel} className="p-1 text-red-400 hover:text-red-300">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => void router.push(`/chat/${conv.sessionId}`)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-rem-85 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                  title={conv.title || 'Untitled'}
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">{conv.title || 'Untitled'}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleRenameStart(e, conv)}
                      className="p-1 text-muted-foreground hover:text-blue-400"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => void handleDeleteConversation(e, conv.sessionId)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isExpanded && conversations.length === 0 && (
        <p className="px-3 py-2 text-rem-80 text-muted-foreground">No conversations yet</p>
      )}
    </div>
  )
}

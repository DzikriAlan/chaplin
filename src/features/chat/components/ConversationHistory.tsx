import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronDown, MessageCircle, Trash2 } from 'lucide-react'
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api('GET', '/chat/conversations')
        if (Array.isArray(data)) {
          setConversations(data.slice(0, 10))
        }
      } catch (error) {
        // Silently fail - feature not critical
        console.error('Failed to fetch conversations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchConversations()
  }, [])

  const handleDeleteConversation = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((c) => c.sessionId !== sessionId))
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
            <button
              key={conv.sessionId}
              onClick={() => void router.push(`/chat/${conv.sessionId}`)}
              onMouseEnter={() => setHoveredId(conv.sessionId)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-rem-85 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group text-left"
              title={conv.title || 'Untitled'}
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">{conv.title || 'Untitled'}</span>
              {hoveredId === conv.sessionId && (
                <button
                  onClick={(e) => void handleDeleteConversation(e, conv.sessionId)}
                  className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </button>
          ))}
        </div>
      )}

      {isExpanded && conversations.length === 0 && (
        <p className="px-3 py-2 text-rem-80 text-muted-foreground">No conversations yet</p>
      )}
    </div>
  )
}

import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { DataChatMessage } from '../types/chatTypes'

interface MessageBubbleProps {
  message: DataChatMessage
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming }: Readonly<MessageBubbleProps>) {
  const isUser = message.role === 'user'
  const sources = message.sources ?? []
  const showTypingDots = isStreaming && message.content === ''

  const extColorMap: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    docx: 'text-blue-500',
    ppt: 'text-orange-500',
    pptx: 'text-orange-500',
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 text-rem-90 text-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  const uniqueTitles = Array.from(new Set(sources.map((s) => (s.metadata as { title?: string })?.title ?? 'Dokumen')))

  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {showTypingDots ? (
          <div className="flex gap-1 items-center h-6 pt-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        ) : (
          <div className="text-rem-90 text-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-0.5 [&_strong]:font-semibold [&_em]:italic [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-rem-85 [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h3]:font-medium [&_h3]:mb-1">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && <span className="inline-block w-0.5 h-4 bg-foreground/60 animate-pulse ml-0.5" />}
          </div>
        )}

        {sources.length > 0 && (
          <div className="pt-2 border-t border-border/40 space-y-1.5">
            {uniqueTitles.map((t) => {
              const e = /\.([a-zA-Z0-9]+)$/.exec(t)?.[1]?.toLowerCase() ?? ''
              const label = e ? e.toUpperCase().slice(0, 3) : 'DOC'
              const color = extColorMap[e] ?? 'text-primary'
              const name = t.replace(/\.[a-zA-Z0-9]+$/, '')
              return (
                <div key={t} className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center justify-center rounded border border-border/60 bg-muted/60 px-1 py-px text-[7px] font-black shrink-0 ${color}`}>
                    {label}
                  </span>
                  <span className="text-rem-75 text-foreground/70 truncate" title={t}>{name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

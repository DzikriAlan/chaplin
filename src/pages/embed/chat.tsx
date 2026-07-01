import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { ArrowUp, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/v1`

export default function EmbedChatPage() {
  const router = useRouter()
  const agentId = router.isReady ? (router.query.agent as string | undefined) : undefined

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const sessionIdRef = useRef<string>(crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const appendChunk = (chunk: string) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: m.content + chunk } : m))
    )
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch(`${baseUrl}/embed/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          ...(agentId ? { agentId } : {}),
        }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const json = JSON.parse(line.slice(6)) as { text?: string }
            if (json.text) appendChunk(json.text)
          } catch {}
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, content: 'Terjadi kesalahan. Coba lagi.', streaming: false } : m
        )
      )
    } finally {
      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, streaming: false } : m))
      )
      setIsStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <>
      <Head>
        <title>Chaplin Chat</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex h-screen flex-col bg-background text-foreground font-sans">
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 py-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground">Chaplin AI</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Mulai percakapan dengan mengirim pesan</p>
            </div>
          )}
          <div className="space-y-3 max-w-full">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <>
                      {msg.content && (
                        <div className="text-sm leading-relaxed [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:font-semibold [&_code:not(pre_>_code)]:bg-black/20 [&_code:not(pre_>_code)]:px-1 [&_code:not(pre_>_code)]:rounded [&_code:not(pre_>_code)]:text-orange-400 [&_pre]:bg-black/30 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:my-1.5 [&_pre]:overflow-x-auto [&_pre]:text-xs">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.streaming && (
                        <div className={`flex items-center gap-1 ${msg.content ? 'mt-1.5' : 'py-0.5'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
                        </div>
                      )}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-border px-3 py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); void sendMessage(input) }
              }}
              placeholder="Tulis pesan..."
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:opacity-80 transition-opacity"
            >
              {isStreaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-1.5">Powered by Chaplin AI</p>
        </div>
      </div>
    </>
  )
}

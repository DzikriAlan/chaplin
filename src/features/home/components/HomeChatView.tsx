'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Plus, ArrowUp, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useChatControllers } from '@/features/chat/controllers/chatControllers'
import { useChatStates } from '@/features/chat/states/chatStates'
import { useAgentsControllers } from '@/features/agents/controllers/agentsControllers'
import { useAgentsStates } from '@/features/agents/states/agentsStates'
import type { DataChatMessage } from '@/features/chat/types/chatTypes'

const defaultName = process.env.NEXT_PUBLIC_USER_NAME ?? 'Anda'

export default function HomeChatView() {
  // variable importer
  const { storeChat } = useChatControllers()
  const { chat, setChat } = useChatStates()
  useAgentsControllers()
  const { agentsList } = useAgentsStates()
  const { data: session } = useSession()

  // states / variable
  const [input, setInput] = useState('')
  const sessionIdRef = useRef<string>(crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messages = useMemo(() => chat.data ?? [], [chat.data])
  const isStreaming = chat.status === 'loading'
  const defaultAgent = agentsList.data?.find((a) => a.isDefault) ?? agentsList.data?.[0] ?? null
  const hasNoAgent = agentsList.status === 'success' && !defaultAgent
  const displayName = session?.user?.name?.split(' ')[0] ?? defaultName
  const isEmptyConversation = messages.length === 0

  // function / methode
  const appendChunk = (chunk: string) => {
    setChat({
      data: chat.data?.map((m, i) =>
        i === (chat.data?.length ?? 0) - 1 ? { ...m, content: m.content + chunk } : m,
      ) ?? null,
    })
  }

  const finalizeStream = () => {
    setChat({
      status: 'success',
      statusTitle: 'Selesai',
      data: chat.data?.map((m, i) =>
        i === (chat.data?.length ?? 0) - 1 ? { ...m, streaming: false } : m,
      ) ?? null,
    })
  }

  const readStream = async (body: ReadableStream<Uint8Array>) => {
    const reader = body.getReader()
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
  }

  const saveChatMessage = async (text: string) => {
    if (!text.trim() || isStreaming || !defaultAgent) return

    const userMsg: DataChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: DataChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true }
    setChat({ status: 'loading', data: [...messages, userMsg, assistantMsg] })
    setInput('')

    try {
      const response = await storeChat.mutateAsync({
        message: text,
        sessionId: sessionIdRef.current,
        agentId: defaultAgent.id,
      })
      if (response?.body) await readStream(response.body)
    } catch {
      setChat({
        status: 'error',
        statusTitle: 'Error',
        data: chat.data?.map((m, i) =>
          i === (chat.data?.length ?? 0) - 1 ? { ...m, content: 'Terjadi kesalahan. Coba lagi.', streaming: false } : m,
        ) ?? null,
      })
    } finally {
      finalizeStream()
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const syncInput = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const saveOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    void saveChatMessage(input)
  }

  // lifecycle react
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // template
  const inputBar = (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-3">
      <button
        type="button"
        aria-label="Tambah"
        className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="h-5 w-5" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={syncInput}
        onKeyDown={saveOnEnter}
        placeholder="Ask anything"
        disabled={isStreaming}
        className="flex-1 bg-transparent text-rem-90 text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => void saveChatMessage(input)}
        disabled={!input.trim() || isStreaming || !defaultAgent}
        aria-label="Kirim pesan"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:opacity-80 transition-opacity"
      >
        {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      </button>
    </div>
  )

  if (isEmptyConversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4">
        <div className="relative isolate w-full max-w-xl">
          <h1 className="mb-6 text-center text-2xl font-semibold text-foreground tracking-tight">
            Hello {displayName}, this is chaplin!
          </h1>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 dark:hidden"
            style={{
              width: '1100px',
              height: '420px',
              background: 'radial-gradient(ellipse at center, rgba(251, 113, 133, 0.45) 0%, rgba(244, 63, 94, 0.22) 40%, transparent 70%)',
              filter: 'blur(52px)',
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 hidden dark:block"
            style={{
              width: '1100px',
              height: '420px',
              background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.30) 0%, rgba(185, 28, 28, 0.14) 45%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {hasNoAgent && (
            <p className="mb-4 text-center text-rem-85 text-muted-foreground">
              Buat agent terlebih dahulu di halaman{' '}
              <Link href="/agents" className="text-primary underline">
                Agents
              </Link>{' '}
              untuk mulai chat.
            </p>
          )}

          {inputBar}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-lg rounded-2xl px-4 py-2.5 text-rem-90 leading-relaxed ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                {msg.content || (msg.streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="mx-auto max-w-2xl">{inputBar}</div>
      </div>
    </div>
  )
}

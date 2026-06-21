import { useState, useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Bot, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { DataChatMessage } from '../types/chatTypes'
import { useChatControllers } from '../controllers/chatControllers'
import { useUIStates } from '@/shared/states/uiStates'
import { consumeStream } from './chatStreamHelpers'
import { MAX_FILE_SIZE, ALLOWED_TYPES, isImageType, readFileAsDataUrl, type UploadedFile } from './chatFileUtils'
import { backendFetch } from '@/shared/lib/backendClient'
import MessageBubble from './MessageBubble'
import ChatInputBar from './ChatInputBar'
import ImagePreviewModal from './ImagePreviewModal'

interface ChatViewProps {
  docs?: string[]
  isEmbed?: boolean
}

const displayName = process.env.NEXT_PUBLIC_USER_NAME ?? 'Dzikri'

export default function ChatView({ docs, isEmbed }: Readonly<ChatViewProps>) {
  const { chatSessionId, selectedAgentId } = useUIStates()
  const queryClient = useQueryClient()

  const [inputValue, setInputValue] = useState('')
  const [localMessages, setLocalMessages] = useState<DataChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [previewImage, setPreviewImage] = useState<UploadedFile | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevSessionIdRef = useRef(chatSessionId)

  const { fetchChat } = useChatControllers(chatSessionId)
  const serverMessages = (fetchChat.data as DataChatMessage[]) ?? []
  const messages = serverMessages.length > 0 ? serverMessages : localMessages
  const hasMessages = messages.length > 0
  const isSwitchingSession = !!chatSessionId && fetchChat.isLoading && !isSending

  useEffect(() => {
    if (chatSessionId !== prevSessionIdRef.current) {
      prevSessionIdRef.current = chatSessionId
      setLocalMessages([])
      setInputValue('')
      setStreamingMsgId(null)
      setUploadedFiles([])
    }
  }, [chatSessionId])

  function appendStreamText(id: string, text: string) {
    setLocalMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: m.content + text } : m)))
  }

  function applyStreamSources(id: string, sources: DataChatMessage['sources']) {
    setLocalMessages((prev) => prev.map((m) => (m.id === id ? { ...m, sources } : m)))
  }

  const handleUploadFiles = useCallback(async (fileList: FileList) => {
    const files: UploadedFile[] = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`File ${file.name} tidak didukung`); continue }
      if (file.size > MAX_FILE_SIZE) { toast.error(`File ${file.name} terlalu besar (max 10MB)`); continue }
      try {
        const { dataUrl, base64 } = await readFileAsDataUrl(file)
        files.push({ id: `file_${Date.now()}_${i}`, name: file.name, size: file.size, type: file.type, dataUrl, base64 })
      } catch { toast.error(`Gagal membaca file ${file.name}`) }
    }
    if (files.length > 0) setUploadedFiles((prev) => [...prev, ...files])
  }, [])

  const handleRemoveFile = useCallback((id: string) => { setUploadedFiles((prev) => prev.filter((f) => f.id !== id)) }, [])
  const handlePreviewImage = useCallback((file: UploadedFile) => { if (isImageType(file.type)) setPreviewImage(file) }, [])

  const handleSend = async () => {
    const message = inputValue.trim()
    const hasFiles = uploadedFiles.length > 0
    if (!message && !hasFiles) return
    if (isSending) return

    setInputValue('')
    let displayContent = message
    if (hasFiles && !message) { displayContent = uploadedFiles.map((f) => `[File: ${f.name}]`).join('\n') }
    else if (hasFiles && message) { displayContent = message + '\n\n' + uploadedFiles.map((f) => `[File: ${f.name}]`).join('\n') }

    setIsSending(true)
    const tempUserMsg: DataChatMessage = { id: `temp_${Date.now()}`, sessionId: chatSessionId, role: 'user', content: displayContent, sources: null, createdAt: new Date().toISOString() }
    setLocalMessages((prev) => [...prev, tempUserMsg])

    const assistantMsgId = `temp_asst_${Date.now()}`
    setLocalMessages((prev) => [...prev, { id: assistantMsgId, sessionId: chatSessionId, role: 'assistant', content: '', sources: null, createdAt: new Date().toISOString() }])
    setStreamingMsgId(assistantMsgId)

    const filesPayload = uploadedFiles.map((f) => ({ name: f.name, type: f.type, size: f.size, base64: f.base64 }))

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60_000)
      const response = await backendFetch('/chat', { method: 'POST', body: JSON.stringify({ message: displayContent, sessionId: chatSessionId, docs, files: filesPayload, agentId: selectedAgentId }), signal: controller.signal })
      clearTimeout(timeoutId)
      if (!response.ok || !response.body) throw new Error('Request failed')
      await consumeStream(response.body, (text) => appendStreamText(assistantMsgId, text), (sources) => applyStreamSources(assistantMsgId, sources))
      fetchChat.refetch()
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') { toast.error('Permintaan timeout. Silakan coba lagi.') }
      else { toast.error('Gagal mengirim pesan') }
      setLocalMessages((prev) => prev.filter((m) => m.id !== assistantMsgId))
    } finally { setIsSending(false); setStreamingMsgId(null); setUploadedFiles([]) }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function getContent(variant: 'embed' | 'default') {
    if (isSwitchingSession) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }
    if (hasMessages) {
      return (
        <>
          <div className="flex-1 overflow-y-auto"><div className="max-w-3xl mx-auto px-4 py-8 space-y-8">{messages.map((msg) => (<MessageBubble key={msg.id} message={msg} isStreaming={msg.id === streamingMsgId} />))}<div ref={bottomRef} /></div></div>
          <div className="px-4 py-6 shrink-0"><div className="max-w-3xl mx-auto"><ChatInputBar value={inputValue} isLoading={isSending} onChangeValue={setInputValue} onSubmit={handleSend} onUploadFiles={handleUploadFiles} uploadedFiles={uploadedFiles} onRemoveFile={handleRemoveFile} onPreviewImage={handlePreviewImage} /></div></div>
        </>
      )
    }
    if (variant === 'embed') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center space-y-3"><div className="flex justify-center mb-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"><Bot className="h-8 w-8 text-primary" /></div></div><h1 className="text-rem-160 font-bold text-foreground tracking-tight">Tanyakan apa saja</h1><p className="text-rem-90 text-muted-foreground">Asisten akan menjawab berdasarkan dokumen yang telah diindeks</p></div>
            <ChatInputBar value={inputValue} isLoading={isSending} onChangeValue={setInputValue} onSubmit={handleSend} onUploadFiles={handleUploadFiles} uploadedFiles={uploadedFiles} onRemoveFile={handleRemoveFile} onPreviewImage={handlePreviewImage} variant="centered" />
          </div>
        </div>
      )
    }
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <div className="w-full max-w-2xl space-y-10">
          <div className="text-center"><p className="text-rem-130 font-medium tracking-tight bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--muted-foreground))] bg-clip-text text-transparent">Hei {displayName}, lagi ada yang pengen lo bahas?</p></div>
          <ChatInputBar value={inputValue} isLoading={isSending} onChangeValue={setInputValue} onSubmit={handleSend} onUploadFiles={handleUploadFiles} uploadedFiles={uploadedFiles} onRemoveFile={handleRemoveFile} onPreviewImage={handlePreviewImage} variant="centered" />
        </div>
      </div>
    )
  }

  if (isEmbed) {
    return <div className="flex flex-col h-full bg-background">{getContent('embed')}</div>
  }

  return (
    <>
      {previewImage && <ImagePreviewModal file={previewImage} onClose={() => setPreviewImage(null)} />}
      <div className="flex flex-col h-full bg-background">
        {getContent('default')}
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { ImageIcon, Eye, Info, Copy, Check as CheckIcon } from 'lucide-react'
import type { DataAgent } from '../types/agentsTypes'
import { getKnowledgeBase } from '@/features/knowledge-base/services/knowledgeBaseServices'

export const agentSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  description: z.string(),
  image: z.string(),
  personalization: z.string(),
  isDefault: z.boolean(),
})

export type AgentFormValues = z.infer<typeof agentSchema>

interface AgentFormProps {
  agent: DataAgent | null
  isSaving: boolean
  onSave: (d: { name: string; description: string; image: string; personalization: string; knowledgeBaseIds: string[]; isDefault: boolean }) => void
  onPreview: (a: DataAgent) => void
}

export default function AgentForm({ agent, isSaving, onSave, onPreview }: Readonly<AgentFormProps>) {
  const isEdit = agent != null
  const [selectedKbIds, setSelectedKbIds] = useState<Set<string>>(new Set(agent?.knowledgeBaseIds ?? []))
  const [imagePreview, setImagePreview] = useState(agent?.image ?? '')
  const [embedCopied, setEmbedCopied] = useState(false)
  const [waCopied, setWaCopied] = useState(false)
  const rightColRef = useRef<HTMLDivElement>(null)
  const [imageBoxSize, setImageBoxSize] = useState(160)

  useEffect(() => {
    const el = rightColRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setImageBoxSize(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { data: kbRaw } = useQuery<Array<{ id: string; question: string; answer: string; tags: string[]; isActive: boolean }>>({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      const data = await getKnowledgeBase()
      return (data as Array<{ id: string; question: string; answer: string; tags: string[]; isActive: boolean }>) ?? []
    },
  })
  const kbItems = kbRaw ?? []

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: { name: '', description: '', image: '', personalization: '', isDefault: false },
  })
  const formValues = watch()

  useEffect(() => {
    if (agent) {
      reset({ name: agent.name, description: agent.description ?? '', image: agent.image ?? '', personalization: agent.personalization ?? '', isDefault: agent.isDefault })
      setSelectedKbIds(new Set(agent.knowledgeBaseIds))
      setImagePreview(agent.image ?? '')
    } else {
      reset({ name: '', description: '', image: '', personalization: '', isDefault: false })
      setSelectedKbIds(new Set())
      setImagePreview('')
    }
  }, [agent, reset])

  const handleFormSubmit = (values: AgentFormValues) => { onSave({ ...values, knowledgeBaseIds: Array.from(selectedKbIds) }) }

  const toggleKb = (id: string) => { setSelectedKbIds((prev) => { const next = new Set(prev); if (next.has(id)) { next.delete(id) } else { next.add(id) }; return next }) }

  const getEmbedScript = () => { const baseUrl = globalThis.window?.location.origin ?? ''; const id = agent?.id ?? 'AGENT_ID'; return '<iframe\n  src="' + baseUrl + '/embed/chat?agent=' + id + '"\n  width="100%"\n  height="600"\n  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);"\n  allow="clipboard-write"\n></iframe>' }

  const getWhatsAppLink = () => { const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6281234567890'; return 'https://wa.me/' + num + '?text=Halo%20AI%20Agent' }

  const handleCopyEmbed = async () => { await navigator.clipboard.writeText(getEmbedScript()); setEmbedCopied(true); setTimeout(() => setEmbedCopied(false), 2000) }
  const handleCopyWA = async () => { await navigator.clipboard.writeText(getWhatsAppLink()); setWaCopied(true); setTimeout(() => setWaCopied(false), 2000) }

  const handlePreviewClick = () => { onPreview({ id: agent?.id ?? 'preview', name: formValues.name || 'Preview Agent', description: formValues.description || null, image: formValues.image || null, personalization: formValues.personalization || null, knowledgeBaseIds: Array.from(selectedKbIds), isDefault: formValues.isDefault, embedScript: null, whatsappScript: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }) }

  const getSubmitLabel = () => {
    if (isSaving) return 'Menyimpan...'
    if (isEdit) return 'Simpan Perubahan'
    return 'Buat Agent'
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-rem-130 font-bold text-foreground tracking-tight">{isEdit ? 'Edit Agent' : 'Buat Agent Baru'}</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="shrink-0" style={{ width: imageBoxSize, height: imageBoxSize }}>
            <label className="w-full h-full relative cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50 transition-colors overflow-hidden">
              <span className="absolute top-2.5 left-3 text-rem-85 font-medium text-foreground">Gambar</span>
              {imagePreview ? (
                <Image src={imagePreview} alt="Agent" className="h-full w-full object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-rem-65 text-muted-foreground mt-1">Upload</span>
                </>
              )}
              <input
                type="text"
                {...register('image')}
                className="hidden"
                onChange={(e) => { register('image').onChange(e); setImagePreview(e.target.value) }}
              />
            </label>
          </div>

          <div ref={rightColRef} className="flex-1 min-w-0 space-y-3">
            <div>
              <label htmlFor="agent-name" className="text-rem-85 font-medium text-foreground">Nama Agent</label>
              <input id="agent-name" {...register('name')} placeholder="Contoh: Asisten Akademik" className="w-full rounded-lg border bg-background px-3 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1.5" />
              {errors.name && <p className="text-rem-80 text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="agent-desc" className="text-rem-85 font-medium text-foreground">Deskripsi</label>
              <textarea id="agent-desc" {...register('description')} rows={2} placeholder="Deskripsi singkat tentang agent ini..." className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1.5" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="agent-pers" className="text-rem-85 font-medium text-foreground">Personalisasi (System Prompt)</label>
          <textarea id="agent-pers" {...register('personalization')} rows={2} placeholder="Kamu adalah asisten AI yang membantu..." className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-rem-85 font-medium text-foreground mb-1.5">Pilih Knowledge Base</p>
            {kbItems.length === 0 ? (
              <p className="text-rem-85 text-muted-foreground italic">Belum ada knowledge base tersedia.</p>
            ) : (
              <div className="max-h-32 overflow-y-auto rounded-lg border divide-y">
                {kbItems.map((kb) => {
                  const checked = selectedKbIds.has(kb.id)
                  return (
                    <label key={kb.id} className={'flex items-center gap-2 px-2.5 py-2 cursor-pointer transition-colors ' + (checked ? 'bg-primary/[0.08]' : 'hover:bg-muted/40')}>
                      <input type="checkbox" checked={checked} onChange={() => toggleKb(kb.id)} className="peer sr-only" />
                      <span className={'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ' + (checked ? 'border-primary bg-primary' : 'border-border bg-background')}>
                        {checked && <CheckIcon className="h-2.5 w-2.5 text-primary-foreground stroke-[3]" />}
                      </span>
                      <span className="text-rem-85 text-foreground truncate">{kb.question}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end gap-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="agent-isDefault" {...register('isDefault')} className="peer sr-only" />
              <label htmlFor="agent-isDefault" className="flex items-center gap-2 cursor-pointer">
                <span className={'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ' + (formValues.isDefault ? 'border-primary bg-primary' : 'border-border bg-background')}>
                  {formValues.isDefault && <CheckIcon className="h-2.5 w-2.5 text-primary-foreground stroke-[3]" />}
                </span>
                <span className="text-rem-85 text-foreground">Jadikan agent default</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <p className="text-rem-85 font-medium text-foreground">Embed Chatbot</p>
            <span className="inline-flex items-center text-muted-foreground cursor-help" title="Salin script HTML ini dan tempelkan ke halaman website Anda."><Info className="h-3.5 w-3.5" /></span>
          </div>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border bg-muted/30 px-4 py-3 text-rem-70 font-mono leading-relaxed whitespace-pre-wrap text-foreground">
              {getEmbedScript()}
            </pre>
            <button type="button" onClick={handleCopyEmbed} className="absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background px-2.5 py-1.5 text-rem-70 font-medium text-foreground hover:bg-muted transition-colors">
              {embedCopied ? <><CheckIcon className="h-3 w-3" />Tersalin!</> : <><Copy className="h-3 w-3" />Salin</>}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <p className="text-rem-85 font-medium text-foreground">WhatsApp Chatbot</p>
            <span className="inline-flex items-center text-muted-foreground cursor-help" title="Bagikan link ini ke pelanggan Anda."><Info className="h-3.5 w-3.5" /></span>
          </div>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border bg-muted/30 px-4 py-3 text-rem-70 font-mono leading-relaxed whitespace-pre-wrap text-foreground">
              {getWhatsAppLink()}
            </pre>
            <button type="button" onClick={handleCopyWA} className="absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background px-2.5 py-1.5 text-rem-70 font-medium text-foreground hover:bg-muted transition-colors">
              {waCopied ? <><CheckIcon className="h-3 w-3" />Tersalin!</> : <><Copy className="h-3 w-3" />Salin</>}
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-1">
          <button type="button" onClick={handlePreviewClick} className="flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-rem-90 font-medium text-foreground hover:bg-muted transition-colors">
            <Eye className="h-4 w-4" /> Preview Agent
          </button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-primary px-5 py-2.5 text-rem-90 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {getSubmitLabel()}
          </button>
        </div>
      </form>
    </div>
  )
}

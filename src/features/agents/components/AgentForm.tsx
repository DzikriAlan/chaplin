'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, Eye, Info, Copy, Check as CheckIcon } from 'lucide-react'
import type { DataAgent } from '../types/agentsTypes'

export type AgentPrefillData = {
  name?: string
  description?: string
  personalization?: string
}

export const agentSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  description: z.string(),
  image: z.string(),
  personalization: z.string(),
  isDefault: z.boolean(),
})

export type AgentFormValues = z.infer<typeof agentSchema>

export interface AgentFormHandle {
  triggerPreview: () => void
}

interface AgentFormProps {
  agent: DataAgent | null
  isSaving: boolean
  prefillData?: AgentPrefillData
  onSave: (d: { name: string; description: string; image: string; personalization: string; isDefault: boolean }) => void
  onPreview: (a: DataAgent) => void
}

const AgentForm = forwardRef<AgentFormHandle, AgentFormProps>(function AgentForm(
  { agent, isSaving, prefillData, onSave, onPreview }: Readonly<AgentFormProps>,
  ref,
) {
  // states / variable
  const isEdit = agent != null
  const [imagePreview, setImagePreview] = useState(agent?.image ?? '')
  const [embedCopied, setEmbedCopied] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [imageBoxSize, setImageBoxSize] = useState(160)
  const rightColRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: { name: '', description: '', image: '', personalization: '', isDefault: false },
  })
  const formValues = watch()

  // function / methode
  const getEmbedScript = () => {
    const baseUrl = globalThis.window?.location.origin ?? ''
    const id = agent?.id ?? 'AGENT_ID'
    return `<iframe
  src="${baseUrl}/embed/chat?agent=${id}"
  width="100%"
  height="600"
  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);"
  allow="clipboard-write"
></iframe>`
  }

  const getSubmitLabel = () => {
    if (isSaving) return 'Menyimpan...'
    if (isEdit) return 'Simpan Perubahan'
    return 'Buat Agent'
  }

  const saveAgent = (values: AgentFormValues) => {
    onSave({ ...values })
  }

  const syncEmbedCopied = async () => {
    await navigator.clipboard.writeText(getEmbedScript())
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const loadPreview = () => {
    onPreview({
      id: agent?.id ?? 'preview',
      name: formValues.name || 'Preview Agent',
      description: formValues.description || null,
      image: formValues.image || null,
      personalization: formValues.personalization || null,
      isDefault: formValues.isDefault,
      embedScript: null,
      whatsappScript: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // lifecycle react
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    const el = rightColRef.current
    if (!el || !isDesktop) return
    const observer = new ResizeObserver(() => setImageBoxSize(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop])

  useEffect(() => {
    if (agent) {
      reset({ name: agent.name, description: agent.description ?? '', image: agent.image ?? '', personalization: agent.personalization ?? '', isDefault: agent.isDefault })
      setImagePreview(agent.image ?? '')
    } else {
      reset({ name: '', description: '', image: '', personalization: '', isDefault: false })
      setImagePreview('')
    }
  }, [agent, reset])

  useEffect(() => {
    if (prefillData) {
      reset((prev) => ({
        ...prev,
        ...(prefillData.name !== undefined && { name: prefillData.name }),
        ...(prefillData.description !== undefined && { description: prefillData.description }),
        ...(prefillData.personalization !== undefined && { personalization: prefillData.personalization }),
      }))
    }
  }, [prefillData, reset])

  useImperativeHandle(ref, () => ({ triggerPreview: loadPreview }))

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-rem-130 font-bold text-foreground tracking-tight">{isEdit ? 'Edit Agent' : 'Buat Agent Baru'}</h2>
      </div>

      <form onSubmit={handleSubmit(saveAgent)} className="space-y-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div
            className="shrink-0 w-24 h-24"
            style={isDesktop ? { width: imageBoxSize, height: imageBoxSize } : undefined}
          >
            <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50 transition-colors overflow-hidden">
              {imagePreview ? (
                <Image src={imagePreview} alt="Agent" className="h-full w-full object-cover" width={160} height={160} />
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

          <div ref={rightColRef} className="flex-1 min-w-0 space-y-3 w-full">
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
          <textarea id="agent-pers" {...register('personalization')} rows={2} placeholder="Kamu asisten AI yang bantu..." className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1.5" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="agent-isDefault" {...register('isDefault')} className="peer sr-only" />
          <label htmlFor="agent-isDefault" className="flex items-center gap-2 cursor-pointer">
            <span className={'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ' + (formValues.isDefault ? 'border-primary bg-primary' : 'border-border bg-background')}>
              {formValues.isDefault && <CheckIcon className="h-2.5 w-2.5 text-primary-foreground stroke-[3]" />}
            </span>
            <span className="text-rem-85 text-foreground">Jadikan agent default</span>
          </label>
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
            <button type="button" onClick={syncEmbedCopied} className="absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background px-2.5 py-1.5 text-rem-70 font-medium text-foreground hover:bg-muted transition-colors">
              {embedCopied ? <><CheckIcon className="h-3 w-3" />Tersalin!</> : <><Copy className="h-3 w-3" />Salin</>}
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-1">
          <button type="button" onClick={loadPreview} className="flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-rem-90 font-medium text-foreground hover:bg-muted transition-colors">
            <Eye className="h-4 w-4" /> Preview Agent
          </button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-primary px-5 py-2.5 text-rem-90 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {getSubmitLabel()}
          </button>
        </div>
      </form>
    </div>
  )
})

export default AgentForm

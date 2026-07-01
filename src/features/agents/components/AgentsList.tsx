'use client'

import { useState, useMemo, useRef } from 'react'
import { Bot, Plus, Search, X, ArrowLeft, PanelLeft, Sparkles } from 'lucide-react'
import type { DataAgent } from '../types/agentsTypes'
import { useAgentsControllers } from '../controllers/agentsControllers'
import { useAgentsStates } from '../states/agentsStates'
import { useUIStates } from '@/shared/states/uiStates'
import AgentForm, { type AgentFormHandle, type AgentPrefillData } from './AgentForm'
import AgentPreviewInline from './AgentPreviewInline'
import AgentCard from './AgentCard'
import GenerateAgentModal from './GenerateAgentModal'

type ViewMode = 'list' | 'create' | 'preview'

export default function AgentsList() {
  // variable importer
  const { storeAgent, removeAgent, changeAgent } = useAgentsControllers()
  const { toggleSidebar } = useUIStates()
  const { agentsList } = useAgentsStates()

  // states / variable
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editAgent, setEditAgent] = useState<DataAgent | null>(null)
  const [previewAgent, setPreviewAgent] = useState<DataAgent | null>(null)
  const [prevMode, setPrevMode] = useState<ViewMode>('list')
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [prefillData, setPrefillData] = useState<AgentPrefillData | undefined>()
  const agentFormRef = useRef<AgentFormHandle>(null)
  const isSaving = storeAgent.isPending || changeAgent.isPending
  const filtered = ((agentsList.data as DataAgent[]) ?? []).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
  const skeletonIds = useMemo(() => ['sk-1', 'sk-2', 'sk-3', 'sk-4'], [])

  // function / methode

  const saveAgent = async (data: {
    name: string; description: string; image: string; personalization: string; isDefault: boolean
  }) => {
    if (editAgent) {
      await changeAgent.mutateAsync({ id: editAgent.id, payload: data })
    } else {
      await storeAgent.mutateAsync(data)
    }
    setViewMode('list')
    setEditAgent(null)
    setPrefillData(undefined)
  }

  const handleGenerated = (data: AgentPrefillData) => {
    setEditAgent(null)
    setPrefillData(data)
    setViewMode('create')
  }

  const destroyAgent = async (id: string) => {
    if (!confirm('Hapus agent ini?')) return
    await removeAgent.mutateAsync(id)
  }

  const syncViewMode = () => {
    if (viewMode === 'preview' && prevMode === 'create') {
      setViewMode('create')
      setPrevMode('list')
    } else {
      setViewMode('list')
      setEditAgent(null)
      setPreviewAgent(null)
    }
  }

  const loadPreview = (a: DataAgent) => {
    setPrevMode(viewMode)
    setPreviewAgent(a)
    setViewMode('preview')
  }

  // lifecycle react (implicit - no effects for this component)
  if (viewMode === 'create') {
    return (
      <div className="flex-1 max-w-3xl mx-auto w-full">
        {/* Mobile navbar overlay */}
        <div className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-card border-b flex items-center justify-between px-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={syncViewMode}
            className="flex items-center gap-1.5 text-rem-90 font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
        </div>
        {/* Desktop back button */}
        <button type="button" onClick={syncViewMode} className="hidden md:flex items-center gap-1.5 text-rem-90 font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Kembali ke daftar agent
        </button>
        <AgentForm ref={agentFormRef} agent={editAgent} isSaving={isSaving} prefillData={prefillData} onSave={saveAgent} onPreview={loadPreview} />
      </div>
    )
  }

  if (viewMode === 'preview' && previewAgent) {
    return (
      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col min-h-0">
        {/* Mobile navbar overlay */}
        <div className="md:hidden fixed top-0 inset-x-0 h-14 z-40 bg-card border-b flex items-center justify-between px-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={syncViewMode}
            className="flex items-center gap-1.5 text-rem-90 font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {prevMode === 'create' ? 'Kembali ke buat agent' : 'Kembali'}
          </button>
        </div>
        {/* Desktop back button */}
        <button type="button" onClick={syncViewMode} className="hidden md:flex items-center gap-1.5 text-rem-90 font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 shrink-0">
          <ArrowLeft className="h-4 w-4" /> {prevMode === 'create' ? 'Kembali ke buat agent' : 'Kembali ke daftar agent'}
        </button>
        <AgentPreviewInline agent={previewAgent} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Bot className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-rem-150 font-bold text-foreground tracking-tight">AI Agents</h1>
        <p className="text-rem-95 text-muted-foreground">Kelola agent AI Anda dengan personalisasi dan knowledge base</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari agent..." className="w-full rounded-xl border bg-background pl-10 pr-8 py-2.5 text-rem-95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {search && <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
        </div>
        <button type="button" onClick={() => setGenerateModalOpen(true)} className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-rem-90 font-medium text-foreground hover:bg-muted transition-colors shrink-0">
          <Sparkles className="h-4 w-4 text-primary" /> Generate AI
        </button>
        <button type="button" onClick={() => { setEditAgent(null); setPrefillData(undefined); setViewMode('create') }} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-rem-90 font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0">
          <Plus className="h-4 w-4" /> Buat Agent
        </button>
      </div>

      <GenerateAgentModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onGenerated={handleGenerated}
      />

      {agentsList.status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skeletonIds.map((id) => (
            <div key={id} className="rounded-xl border bg-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-full bg-muted" /><div className="space-y-1.5 flex-1"><div className="h-4 w-28 bg-muted rounded" /><div className="h-3 w-40 bg-muted rounded" /></div></div>
              <div className="h-3 w-full bg-muted rounded mb-1.5" /><div className="h-3 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {agentsList.status !== 'loading' && filtered.length === 0 && !search && (
        <div className="py-16 text-center">
          <Bot className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-rem-110 font-semibold text-foreground">Belum ada agent</p>
          <p className="text-rem-90 text-muted-foreground mt-1">Buat agent pertama Anda dengan klik tombol di atas</p>
        </div>
      )}

      {agentsList.status !== 'loading' && filtered.length === 0 && search && (
        <div className="py-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-rem-100 font-semibold text-foreground">Tidak ditemukan</p>
          <p className="text-rem-85 text-muted-foreground mt-1">Tidak ada agent dengan nama &quot;{search}&quot;</p>
        </div>
      )}

      {agentsList.status !== 'loading' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={(a) => { setEditAgent(a); setViewMode('create') }}
              onPreview={loadPreview}
              onDelete={destroyAgent}
            />
          ))}
        </div>
      )}
    </div>
  )
}

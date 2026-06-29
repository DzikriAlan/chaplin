'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, ChevronDown, Star } from 'lucide-react'
import type { DataAgent } from '../types/agentsTypes'
import { useAgentsControllers } from '../controllers/agentsControllers'
import { useAgentsStates } from '../states/agentsStates'

interface AgentsSwitchProps {
  selectedAgentId: string | null
  onSelectAgent: (agent: DataAgent | null) => void
}

export default function AgentsSwitch({ selectedAgentId, onSelectAgent }: Readonly<AgentsSwitchProps>) {
  // variable importer
  useAgentsControllers()

  // states / variable
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { agentsList } = useAgentsStates()
  const agents = (agentsList.data as DataAgent[]) ?? []
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null

  // function / methode
  const getClickOutsideHandler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  // lifecycle react
  useEffect(() => {
    document.addEventListener('mousedown', getClickOutsideHandler)
    return () => document.removeEventListener('mousedown', getClickOutsideHandler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-rem-80 font-medium text-foreground hover:bg-muted transition-colors"
      >
        {selectedAgent ? (
          <>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
              {selectedAgent.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedAgent.image} alt={selectedAgent.name} className="h-full w-full object-cover" />
              ) : (
                <Bot className="h-3 w-3 text-primary" />
              )}
            </div>
            <span className="max-w-[120px] truncate">{selectedAgent.name}</span>
            {selectedAgent.isDefault && <Star className="h-3 w-3 text-amber-500 shrink-0" />}
          </>
        ) : (
          <>
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Default (Knowledge Base)</span>
          </>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 rounded-xl border bg-card shadow-xl z-30 py-1 max-h-60 overflow-y-auto">
          {/* Default option */}
          <button
            type="button"
            onClick={() => {
              onSelectAgent(null)
              setOpen(false)
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
              selectedAgentId ? 'hover:bg-muted text-foreground' : 'bg-primary/10 text-primary'
            }`}
          >
            <Bot className="h-4 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-rem-80 font-medium truncate">Default (Knowledge Base)</p>
              <p className="text-rem-70 text-muted-foreground">Menggunakan semua KB</p>
            </div>
          </button>

          {agents.length === 0 && (
            <p className="px-3 py-2 text-rem-75 text-muted-foreground">Belum ada agent</p>
          )}

          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => {
                onSelectAgent(agent)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                selectedAgentId === agent.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                {agent.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={agent.image} alt={agent.name} className="h-full w-full object-cover" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-rem-80 font-medium truncate">{agent.name}</p>
                {agent.personalization && (
                  <p className="text-rem-70 text-muted-foreground truncate">{agent.personalization}</p>
                )}
              </div>
              {agent.isDefault && <Star className="h-3 w-3 text-amber-500 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

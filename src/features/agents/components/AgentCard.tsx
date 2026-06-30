import { Bot, Star, Eye, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { DataAgent } from '../types/agentsTypes'

interface AgentCardProps {
  agent: DataAgent
  onEdit: (agent: DataAgent) => void
  onPreview: (agent: DataAgent) => void
  onDelete: (id: string) => void
}

export default function AgentCard({ agent, onEdit, onPreview, onDelete }: Readonly<AgentCardProps>) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card hover:shadow-card-md hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
          {agent.image ? <Image src={agent.image} alt={agent.name} className="h-full w-full object-cover" /> : <Bot className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-rem-100 font-semibold text-foreground truncate">{agent.name}</h3>
            {agent.isDefault && <span className="flex items-center gap-0.5 text-rem-70 font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0"><Star className="h-2.5 w-2.5" />Default</span>}
          </div>
          {agent.description && <p className="text-rem-85 text-muted-foreground mt-0.5 line-clamp-2">{agent.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
        <button type="button" onClick={() => onEdit(agent)} className="text-rem-85 font-medium text-muted-foreground hover:text-foreground rounded-lg px-2.5 py-1.5 transition-colors">Ubah</button>
        <button type="button" onClick={() => onPreview(agent)} className="text-rem-85 font-medium text-muted-foreground hover:text-foreground rounded-lg px-2.5 py-1.5 transition-colors"><Eye className="h-3.5 w-3.5 inline mr-1" />Cek Agent</button>
        <button type="button" onClick={() => onDelete(agent.id)} className="text-rem-85 font-medium text-destructive hover:opacity-70 rounded-lg px-2.5 py-1.5 transition-colors ml-auto"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  )
}

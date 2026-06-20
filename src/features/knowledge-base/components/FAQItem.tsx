import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import type { DataKnowledgeBase } from '../types/knowledgeBaseTypes'

interface FAQItemProps {
  item: DataKnowledgeBase
  onDeleteItem: (id: string) => void
}

export default function FAQItem({ item, onDeleteItem }: Readonly<FAQItemProps>) {
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => setExpanded((v) => !v)

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30"
      >
        <span className="text-rem-90 font-medium text-dark-text pr-4">{item.question}</span>
        {expanded ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 pt-0 border-t">
          <p className="text-rem-90 text-dark-text leading-relaxed mt-3">{item.answer}</p>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-rem-75 font-medium text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <span className="text-rem-75 text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString('id-ID')}
            </span>
            <button
              type="button"
              onClick={() => onDeleteItem(item.id)}
              className="flex items-center gap-1.5 text-rem-80 font-medium text-destructive hover:opacity-70"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

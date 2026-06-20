import { Loader2 } from 'lucide-react'

interface StatusBadge {
  label: string
  color: string
  isAnimating?: boolean
}

interface ListCardRowProps {
  title: string
  subtitle?: string
  statusBadge?: StatusBadge
  tags?: string[]
  date?: string
  isSelected?: boolean
  dragOver?: boolean
  selectionNode?: React.ReactNode
  prefixNode?: React.ReactNode
  onClickContent?: () => void
  actions?: React.ReactNode
  style?: React.CSSProperties
}

export default function ListCardRow({
  title,
  subtitle,
  statusBadge,
  tags,
  date,
  isSelected,
  dragOver,
  selectionNode,
  prefixNode,
  onClickContent,
  actions,
  style,
}: Readonly<ListCardRowProps>) {
  const bgClass = dragOver
    ? 'bg-primary/10'
    : isSelected
      ? 'bg-primary/[0.06]'
      : 'hover:bg-muted/30'

  const contentInner = (
    <>
      <div className="flex items-center gap-1.5">
        {prefixNode}
        <p className="text-rem-90 font-medium text-foreground truncate">{title}</p>
      </div>
      {(subtitle !== undefined || statusBadge !== undefined) && (
        <div className="flex items-center gap-2 flex-wrap">
          {statusBadge !== undefined && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-rem-70 font-medium ${statusBadge.color}`}>
              {statusBadge.isAnimating === true && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
              {statusBadge.label}
            </span>
          )}
          {subtitle !== undefined && (
            <span className="text-rem-80 text-muted-foreground line-clamp-2">{subtitle}</span>
          )}
        </div>
      )}
      {tags !== undefined && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-rem-70 font-medium text-primary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3.5 transition-colors ${bgClass}`}
      style={style}
    >
      {selectionNode !== undefined && (
        <div className="shrink-0 pt-1">{selectionNode}</div>
      )}
      {onClickContent !== undefined ? (
        <button
          type="button"
          onClick={onClickContent}
          className="flex-1 min-w-0 space-y-1 text-left"
        >
          {contentInner}
        </button>
      ) : (
        <div className="flex-1 min-w-0 space-y-1">{contentInner}</div>
      )}
      {(date !== undefined || actions !== undefined) && (
        <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
          {date !== undefined && (
            <span className="text-rem-75 text-muted-foreground mr-1.5">{date}</span>
          )}
          {actions}
        </div>
      )}
    </div>
  )
}

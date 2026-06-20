import type { CSSProperties, ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  colorTitle?: string
  colorSubtitle?: string
  image?: ReactNode
  action?: ReactNode
  className?: string
}

export default function PlaceholderSection({
  title,
  subtitle,
  colorTitle,
  colorSubtitle,
  image,
  action,
  className,
}: Readonly<Props>) {
  const style: CSSProperties = {
    ...(colorTitle && { color: colorTitle }),
    ...(colorSubtitle && { color: colorSubtitle }),
  }

  return (
    <div className={['section-placeholder', className].filter(Boolean).join(' ')}>
      <div className="placeholder-content">
        {image}
        <h3 className="dark-inverted" style={style}>
          {title}
        </h3>
        {subtitle && <p style={style}>{subtitle}</p>}
        {action}
      </div>
    </div>
  )
}

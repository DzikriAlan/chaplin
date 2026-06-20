import { type CSSProperties, type ReactNode, useMemo } from 'react'

export type VLoaderSize = 'small' | 'large' | 'xl'
export type VLoaderWrapperRadius = 'regular' | 'smooth' | 'rounded'

interface Props {
  size?: VLoaderSize
  card?: VLoaderWrapperRadius
  active?: boolean
  grey?: boolean
  translucent?: boolean
  transparent?: boolean
  height?: string
  style?: CSSProperties
  children?: ReactNode
}

export default function VLoader({
  size,
  card,
  active = false,
  grey = false,
  translucent = false,
  transparent = false,
  height = '100%',
  style,
  children,
}: Readonly<Props>) {
  const wrapperStyle = useMemo<CSSProperties>(() => {
    return { ...(height ? { height } : {}), ...style }
  }, [height, style])

  const sizeClass = useMemo(() => {
    switch (size) {
      case 'small':
        return 'h-8 w-8 border-[3px]'
      case 'large':
        return 'h-20 w-20 border-[5px]'
      case 'xl':
        return 'h-28 w-28 border-[7px]'
      default:
        return 'h-12 w-12 border-[4px]'
    }
  }, [size])

  const overlayBg = useMemo(() => {
    if (transparent) return 'bg-transparent'
    if (grey) return 'bg-muted'
    return 'bg-background'
  }, [grey, transparent])

  const cardClass = useMemo(() => {
    switch (card) {
      case 'regular':
        return 'rounded-sm'
      case 'smooth':
        return 'rounded-md'
      case 'rounded':
        return 'rounded-lg'
      default:
        return ''
    }
  }, [card])

  return (
    <div
      className={`relative ${active ? 'overflow-hidden' : ''}`}
      style={wrapperStyle}
    >
      {active && (
        <div
          className={`absolute inset-0 z-[5] flex items-center justify-center transition-opacity duration-300 ${overlayBg} ${cardClass} ${translucent ? 'opacity-65' : ''}`}
        >
          <span
            className={`block animate-spin rounded-full ${sizeClass}`}
            style={{
              borderColor: 'hsl(var(--muted-foreground) / 0.3)',
              borderRightColor: 'transparent',
              borderTopColor: 'transparent',
              animationDuration: '500ms',
            }}
          />
        </div>
      )}
      {children}
    </div>
  )
}

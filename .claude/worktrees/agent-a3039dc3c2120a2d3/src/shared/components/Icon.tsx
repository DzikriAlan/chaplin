import Image from 'next/image'
import type { CSSProperties } from 'react'

interface Props {
  icon: string
  nospan?: boolean
  flexItem?: boolean
  color?: string
  width?: number
  height?: number
  className?: string
  tooltip?: string
  label?: string
}

function getCleansingIconify(value: string) {
  return value
}

function getType(value: string) {
  return /^(\/|\.\/|https?:\/\/|data:image)/.test(value)
}

export default function Icon({
  icon,
  nospan,
  flexItem,
  color,
  width,
  height,
  className,
  tooltip,
  label,
}: Readonly<Props>) {
  const iconify = getCleansingIconify(icon)
  const isIconify = !!iconify && iconify.includes(':') && !iconify.startsWith('data:')
  const isSvgPath = getType(iconify)

  const iconStyle: CSSProperties = {
    ...(color && { color }),
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
  }

  function renderIconEl(extraClass?: string) {
    if (isIconify) {
      return (
        <i
          aria-hidden="true"
          className={['iconify', extraClass].filter(Boolean).join(' ')}
          data-icon={iconify}
          style={iconStyle}
          title={tooltip}
        />
      )
    }
    if (isSvgPath) {
      return (
        <Image
          alt=""
          aria-hidden="true"
          src={iconify}
          width={width ?? 24}
          height={height ?? 24}
          style={iconStyle}
          title={tooltip}
        />
      )
    }
    return (
      <i
        aria-hidden="true"
        className={[iconify, extraClass].filter(Boolean).join(' ')}
        style={iconStyle}
        title={tooltip}
      />
    )
  }

  if (nospan) {
    return (
      <>
        {renderIconEl(className)}
        {label && <span className="ml-2">{label}</span>}
      </>
    )
  }

  return (
    <span
      className={[
        'is-inline-flex is-align-items-center',
        flexItem && 'is-flex is-align-items-center is-justify-content-center',
        className,
      ].filter(Boolean).join(' ')}
      title={tooltip}
    >
      {renderIconEl()}
      {label && <span className="ml-2" style={{ paddingBottom: '2px' }}>{label}</span>}
    </span>
  )
}

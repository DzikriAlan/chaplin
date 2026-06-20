'use client'

/* eslint-disable react/no-array-index-key */

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import ListEksekutif from './ListEksekutif'

interface CardDataProps {
  title?: string
  tooltip?: string
  data?: unknown[]
  type?: string
  withNumber?: boolean
  withAvatar?: boolean
  children?: ReactNode
}

export default function CardData({
  title,
  tooltip,
  data,
  type,
  withNumber,
  withAvatar,
  children,
}: Readonly<CardDataProps>) {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = useMemo(() => data ?? [], [data])
  const totalSlides = slides.length
  const hasSlider = totalSlides > 1
  const activeIndex = useMemo(() => {
    if (activeSlide >= totalSlides) return 0
    return activeSlide
  }, [activeSlide, totalSlides])

  const handleDotClick = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  function renderHeader() {
    if (!title && !tooltip) return null

    return (
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {tooltip && (
          <span
            className="cursor-help text-muted-foreground"
            title={tooltip}
          >
            &#9432;
          </span>
        )}
      </div>
    )
  }

  function renderBullets() {
    if (!hasSlider) return null

    return (
      <div className="flex items-center justify-center gap-2 pb-4">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => handleDotClick(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === activeIndex
                ? 'bg-foreground'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      {renderHeader()}

      <div className="relative overflow-hidden px-6 py-4">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((item, index) => (
            <div key={`slide-${index}`} className="w-full flex-shrink-0">
              {children ?? (
                <ListEksekutif
                  type={type ?? ''}
                  data={item}
                  withNumber={withNumber}
                  withAvatar={withAvatar}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderBullets()}
    </div>
  )
}
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

const TV_BREAKPOINT = 1920
const CAROUSEL_TYPES = new Set(['media_teratas', 'jurnalis_teratas', 'artikel_teratas'])

type Item = Record<string, unknown>

interface MappedItem {
  avatar: string | undefined
  title: string | undefined
  subtitle: string
  rightTag: string[]
  leftTag: string[]
  content: string | undefined
  badge: string | undefined
  description: string | undefined
  count: unknown
}

interface Props {
  type: string
  data: unknown
  withNumber?: boolean
  withAvatar?: boolean
}

function getArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (value !== undefined && value !== null && value !== '') return [String(value)]
  return []
}

function getTagParts(tag: string): { prefix: string; number: string } | null {
  const match = tag.match(/^(.*?\s)([\d.,]+)$/)
  return match ? { prefix: match[1], number: match[2] } : null
}

function getSentimentTitle(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positif':
    case 'pos':
      return 'Positif'
    case 'negatif':
    case 'neg':
      return 'Negatif'
    default:
      return 'Netral'
  }
}

function getSentimentColor(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positif':
    case 'pos':
      return 'is-success col-white'
    case 'negatif':
    case 'neg':
      return 'is-danger'
    default:
      return 'is-grey'
  }
}

function getBadge3PColor(tag: string): string {
  switch (tag?.toLowerCase()) {
    case 'portfolio': return 'is-badge-portfolio'
    case 'people': return 'is-badge-people'
    case 'public contribution': return 'is-badge-public'
    default: return ''
  }
}

function getClassTag(type: string, tag: string): string {
  if (type === 'sorotan_3p') return getBadge3PColor(tag)
  if (type === 'media_teratas' || type === 'jurnalis_teratas') {
    if (tag === 'Positif') return 'is-sentiment-pos'
    if (tag === 'Negatif') return 'is-sentiment-neg'
    return 'is-sentiment-net'
  }
  return ''
}

function getInitials(value: string): string {
  return value
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function setSubtitle(item: Item): string {
  if (item.username) return `${item.username} • ${item.date}`
  if (item.source) return String(item.source)
  return String(item.date ?? '')
}

function renderTagParts(tag: string) {
  const parts = getTagParts(tag)
  if (parts) return <>{parts.prefix}<b>{parts.number}</b></>
  return <>{tag}</>
}

function renderAvatar(item: MappedItem, extraClass?: string) {
  return (
    <div className={['list-avatar', extraClass].filter(Boolean).join(' ')}>
      {item.avatar ? (
        <Image src={item.avatar} alt={item.title ?? ''} width={40} height={40} className="list-avatar-img" />
      ) : (
        <span className="list-avatar-initials">{getInitials(item.title ?? '?')}</span>
      )}
    </div>
  )
}

export default function ListEksekutif({ type, data, withNumber, withAvatar }: Readonly<Props>) {
  const [displayCount, setDisplayCount] = useState(3)

  const rawData = Array.isArray(data) ? (data as Item[]) : (data ? [data as Item] : [])
  const slicedData = CAROUSEL_TYPES.has(type) ? rawData.slice(0, displayCount) : rawData

  const items: MappedItem[] = slicedData.map((item) => ({
    avatar: item.photo as string | undefined,
    title: (item.name || item.title) as string | undefined,
    subtitle: setSubtitle(item),
    rightTag: setRightTag(item),
    leftTag: setLeftTag(item),
    content: item.content as string | undefined,
    badge: (item.type || item.platform) as string | undefined,
    description: item.description as string | undefined,
    count: item.total_data,
  }))

  function setLeftTag(item: Item): string[] {
    if (item.count && type === 'sorotan_engagement') return getArray(`Total Engagement ${item.count}`)
    if (type === 'sorotan_volume') return getArray(`Total Volume ${item.count}`)
    if (type === 'isu_negatif') return getArray(item.sources)
    if (type === 'sorotan_3p') return getArray(item.sources)
    if (type === 'media_teratas') return getArray(item.sources)
    return []
  }

  function setRightTag(item: Item): string[] {
    if (item.count && type === 'sorotan_engagement') return getArray(`Total Engagement ${item.count}`)
    if (type === 'sorotan_volume') return getArray(`Total Volume ${item.count}`)
    if (type === 'isu_negatif') return getArray(item.sources)
    if (type === 'sorotan_3p') return getArray(item.tag)
    if (type === 'media_teratas') return getArray(item.sentiment)
    if (type === 'jurnalis_teratas') return getArray(item.sentiment)
    if (type === 'artikel_teratas') return getArray(`Skor Artikel: ${item.score}`)
    return []
  }

  function renderSorotanVolume(item: MappedItem, index: number) {
    return (
      <div className="w-full">
        <div className="news-body is-flex is-justify-content-space-between">
          <div className="is-flex is-align-items-center">
            {withNumber && (
              <div className="is-flex is-align-items-center item-number">
                <b>{index + 1}</b>
              </div>
            )}
            <p className="news-title">{item.content}</p>
          </div>
          {!!item.leftTag.length && (
            <span>
              {item.leftTag.map((leftTag) => (
                <span key={leftTag} className={['tag is-rounded', getClassTag(type, leftTag)].filter(Boolean).join(' ')}>
                  {renderTagParts(leftTag)}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    )
  }

  function renderMediaTeratas(item: MappedItem, index: number) {
    return (
      <div className="w-full">
        <div className="news-body is-flex">
          {withNumber && (
            <div className="is-flex is-align-items-center item-number">
              <b>{index + 1}</b>
            </div>
          )}
          {renderAvatar(item, 'mr-4')}
          <div className="is-flex is-align-items-center is-justify-content-space-between w-full">
            <div>
              <p className="news-title">{item.title}</p>
              <div className="meta-tags">
                <div className={['meta-tags more-than-1200', type].join(' ')}>
                  {item.leftTag.map((leftTag) => (
                    <span key={leftTag} className="is-rounded meta-tag">{leftTag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="is-flex is-align-items-center">
              {!!item.rightTag.length && (
                <div className={['badge-3p mr-2 more-than-1200', type].join(' ')}>
                  {item.rightTag.map((rightTag) => (
                    <span key={rightTag} className={['tag is-rounded', getSentimentColor(rightTag)].filter(Boolean).join(' ')}>
                      {getSentimentTitle(rightTag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderJurnalisTeratas(item: MappedItem, index: number) {
    return (
      <div className="w-full">
        <div className="news-body is-flex">
          {withNumber && (
            <div className="is-flex is-align-items-center item-number">
              <b>{index + 1}</b>
            </div>
          )}
          <div className="is-flex is-align-items-center is-justify-content-space-between w-full">
            <div>
              <p className="news-title">{item.title}</p>
              <p className="col-dark-text">{String(item.count ?? '')}</p>
              <p className="news-description">{item.description}</p>
            </div>
            <div className="meta-tags">
              <div className={['meta-tags more-than-1200', type].join(' ')}>
                {item.rightTag.map((rightTag) => (
                  <span key={rightTag} className={['tag is-rounded', getSentimentColor(rightTag)].filter(Boolean).join(' ')}>
                    {getSentimentTitle(rightTag)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderArtikelTeratas(item: MappedItem, index: number) {
    return (
      <div className="w-full">
        <div className="news-body is-flex">
          {withNumber && (
            <div className="is-flex is-align-items-center item-number">
              <b>{index + 1}</b>
            </div>
          )}
          {renderAvatar(item, 'mr-4')}
          <div className="is-flex is-align-items-center is-justify-content-space-between w-full">
            <div>
              <p className="news-title">{item.title}</p>
              <p className="news-title font-bold pt-1">{item.subtitle}</p>
            </div>
            {!!item.rightTag.length && (
              <div className={['badge-3p', type].join(' ')}>
                {item.rightTag.map((rightTag) => (
                  <span key={rightTag} className="tag is-rounded">
                    {renderTagParts(rightTag)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function renderDefault(item: MappedItem, index: number) {
    return (
      <div className="w-full">
        <div className="is-flex mb-1">
          {withNumber && (
            <div className="is-flex is-align-items-center item-number">
              <b>{index + 1}</b>
            </div>
          )}
          {withAvatar !== false && (
            <div className="ml-2 mr-4 media-logo-wrapper">
              {renderAvatar(item)}
            </div>
          )}
          <div className="media-info">
            <div className={['media-name is-flex', type].join(' ')}>
              {item.title}
              {!!item.rightTag.length && (
                <div className={['badge-3p mr-2 more-than-1200', type].join(' ')}>
                  {item.rightTag.map((rightTag) => (
                    <span key={rightTag} className={['tag is-rounded', getClassTag(type, rightTag)].filter(Boolean).join(' ')}>
                      {renderTagParts(rightTag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="news-date">{item.subtitle}</div>
            <div className={['meta-tags more-than-1200', type].join(' ')}>
              {item.leftTag.map((leftTag) => (
                <span key={leftTag} className="is-rounded meta-tag">{leftTag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="is-flex is-align-items-center py-3 less-than-1200">
          {!!item.rightTag.length && (
            <div className={['badge-3p mr-2 less-than-1200', type].join(' ')}>
              {item.rightTag.map((rightTag) => (
                <span key={rightTag} className={['tag is-rounded', getClassTag(type, rightTag)].filter(Boolean).join(' ')}>
                  {renderTagParts(rightTag)}
                </span>
              ))}
            </div>
          )}
          {!!item.leftTag.length && (
            <div className={['meta-tags less-than-1200', type].join(' ')}>
              {item.leftTag.map((leftTag) => (
                <span key={leftTag} className={['tag is-rounded meta-tag', getClassTag(type, leftTag)].filter(Boolean).join(' ')}>
                  {leftTag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="news-body">
          <p className="news-title">{item.content}</p>
        </div>
      </div>
    )
  }

  function renderItem(item: MappedItem, index: number) {
    if (type === 'sorotan_volume') return renderSorotanVolume(item, index)
    if (type === 'media_teratas') return renderMediaTeratas(item, index)
    if (type === 'jurnalis_teratas') return renderJurnalisTeratas(item, index)
    if (type === 'artikel_teratas') return renderArtikelTeratas(item, index)
    return renderDefault(item, index)
  }

  useEffect(() => {
    function updateDisplayCount() {
      setDisplayCount(window.innerWidth >= TV_BREAKPOINT ? 5 : 3)
    }
    updateDisplayCount()
    window.addEventListener('resize', updateDisplayCount)
    return () => window.removeEventListener('resize', updateDisplayCount)
  }, [])

  return (
    <div className="news-list" data-type={type} data-with-number={withNumber}>
      {items.map((item, index) => (
        <div key={index} className="news-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

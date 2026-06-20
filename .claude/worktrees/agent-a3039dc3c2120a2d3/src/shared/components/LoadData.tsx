import Image from 'next/image'
import { type CSSProperties, type ReactNode, useMemo } from 'react'

import type { LoadDataResponse } from './types/loadDataTypes'
import { Icon, Loader, PlaceholderSection } from './'

interface Props {
  response?: LoadDataResponse | null
  customLoader?: boolean
  icon?: string
  sizeIcon?: number
  colorIcon?: string
  colorTitle?: string
  sizeImage?: number
  children?: ReactNode
}

export default function LoadData({
  response,
  customLoader,
  icon,
  sizeIcon,
  colorIcon,
  colorTitle,
  sizeImage,
  children,
}: Readonly<Props>) {
  const iconStyle = useMemo<CSSProperties>(() => {
    const result: CSSProperties = {}
    if (sizeIcon) {
      result.width = sizeIcon
      result.height = sizeIcon
    }
    if (sizeImage) {
      result.width = sizeImage
      result.height = sizeImage
    }
    return result
  }, [sizeIcon, sizeImage])

  const noData = useMemo(() => {
    if (!response) return undefined
    if (response.isEmpty) return { title: response.emptyTitle, subtitle: response.emptySubtitle, image: response.emptyImage }
    if (response.isError) return { title: response.errorTitle, subtitle: response.errorSubtitle, image: response.errorImage }
    if (response.isNoVerified) return { title: response.noVerifiedTitle, subtitle: response.noVerifiedSubtitle, image: response.noVerifiedImage }
    return undefined
  }, [response])

  if (response?.isLoading) {
    if (customLoader) {
      return <>{children}</>
    }

    return (
      <div style={{ minHeight: '30vh' }}>
        <Loader active />
      </div>
    )
  }

  if (response?.isEmpty || response?.isError || response?.isNoVerified) {
    return (
      <PlaceholderSection
        title={noData?.title || ''}
        subtitle={noData?.subtitle || ''}
        colorTitle={colorTitle}
        className="empty-data h-full"
        image={
          icon ? (
            <Icon
              icon={icon}
              color={colorIcon}
              width={sizeIcon}
              height={sizeIcon}
            />
          ) : (
            <Image
              src={noData?.image || ''}
              width={typeof iconStyle.width === 'number' ? iconStyle.width : 24}
              height={typeof iconStyle.height === 'number' ? iconStyle.height : 24}
              style={iconStyle}
              alt="isEmpty"
            />
          )
        }
      />
    )
  }

  return <>{children}</>
}
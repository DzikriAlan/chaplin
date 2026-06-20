import { cn } from '@/shared/lib/utils'

interface Props {
  className?: string
}

export default function Skeleton({ className }: Readonly<Props>) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

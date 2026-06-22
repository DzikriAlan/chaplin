import Skeleton from '@/shared/components/Skeleton'

interface FAQTableSkeletonProps { rows?: number }

export default function KBFaqTableSkeleton({ rows = 5 }: Readonly<FAQTableSkeletonProps>) {
  const keys = Array.from({ length: rows }, (_, i) => i)
  return (
    <div className="divide-y divide-border">
      {keys.map((k) => (
        <div key={k} className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <Skeleton className="h-3.5 w-14 mr-0.5" />
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

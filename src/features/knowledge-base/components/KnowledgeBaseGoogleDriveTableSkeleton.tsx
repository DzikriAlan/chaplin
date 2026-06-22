import Skeleton from '@/shared/components/Skeleton'

export default function DocumentsTableSkeleton() {
  const rows = ['a', 'b', 'c', 'd', 'e']
  return (
    <div className="divide-y divide-border">
      {rows.map((k) => (
        <div key={k} className="flex items-start gap-3 px-4 py-3.5">
          <Skeleton className="h-4 w-4 shrink-0 rounded mt-1" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
      ))}
    </div>
  )
}

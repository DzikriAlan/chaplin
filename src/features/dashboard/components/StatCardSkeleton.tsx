import Skeleton from '@/shared/components/Skeleton'

function StatCardSkeletonItem() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-8 w-16 mb-1.5" />
      <Skeleton className="h-4 w-28" />
    </div>
  )
}

export default function StatCardSkeleton() {
  const keys = ['doc', 'chunk', 'chat', 'soal', 'faq']
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {keys.map((k) => <StatCardSkeletonItem key={k} />)}
    </div>
  )
}

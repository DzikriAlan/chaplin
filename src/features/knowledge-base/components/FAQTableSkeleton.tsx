import Skeleton from '@/shared/components/Skeleton'

interface FAQTableSkeletonProps { rows?: number }

export default function FAQTableSkeleton({ rows = 5 }: Readonly<FAQTableSkeletonProps>) {
  const keys = Array.from({ length: rows }, (_, i) => i)
  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            {['Pertanyaan', 'Jawaban', 'Tags', 'Dibuat', 'Aksi'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k} className="border-b border-border last:border-0">
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-48" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-64" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-14" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

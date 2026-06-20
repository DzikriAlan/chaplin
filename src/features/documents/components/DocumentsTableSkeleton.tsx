import Skeleton from '@/shared/components/Skeleton'

export default function DocumentsTableSkeleton() {
  const rows = ['a', 'b', 'c', 'd', 'e']
  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3 w-10"><Skeleton className="h-4 w-4" /></th>
            <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Nama Dokumen</th>
            <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Chunks</th>
            <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Diperbarui</th>
            <th className="px-4 py-3 text-left text-rem-80 font-semibold text-muted-foreground">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((k) => (
            <tr key={k} className="border-b border-border last:border-0">
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-4" /></td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </td>
              <td className="px-4 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-14" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

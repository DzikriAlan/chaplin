import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  href: string
  iconBg: string
}

export default function StatCard({ label, value, icon, href, iconBg }: Readonly<StatCardProps>) {
  return (
    <Link href={href} className="block group">
      <div className="rounded-xl border bg-card p-5 shadow-card hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-rem-200 font-bold text-foreground tabular-nums">{value.toLocaleString('id-ID')}</p>
        <p className="text-rem-85 text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Link>
  )
}

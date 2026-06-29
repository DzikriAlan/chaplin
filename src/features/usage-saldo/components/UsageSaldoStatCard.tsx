interface UsageSaldoStatCardProps {
  title: string
  value: string
}

export default function UsageSaldoStatCard({ title, value }: Readonly<UsageSaldoStatCardProps>) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-rem-85 text-muted-foreground mb-2">{title}</p>
      <p className="text-rem-200 font-bold text-foreground leading-none">{value}</p>
    </div>
  )
}

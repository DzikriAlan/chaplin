import { MessageSquare, RefreshCw, TrendingDown } from 'lucide-react'
import type { DataUsageSaldoLog } from '../types/usageSaldoTypes'

interface UsageSaldoLogRowProps {
  log: DataUsageSaldoLog
}

export default function UsageSaldoLogRow({ log }: Readonly<UsageSaldoLogRowProps>) {
  // variable / states
  const icon = log.activityType === 'chat'
    ? <MessageSquare className="h-3.5 w-3.5" />
    : <RefreshCw className="h-3.5 w-3.5" />


  // function / methode
  const getFormatRupiah = (amount: number) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

  const getFormatDate = (iso: string) =>
    new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  const getLabel = () => {
    if (log.activityType !== 'chat') return 'Sync dokumen'
    return log.senderName ? `Chat — ${log.senderName}` : 'Chat masuk'
  }

  // lifecycle react
  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pl-4 text-rem-85 text-muted-foreground">{getFormatDate(log.createdAt)}</td>
      <td className="py-3 px-3">
        <span className="inline-flex items-center gap-1.5 text-rem-85 text-foreground">{icon} {getLabel()}</span>
      </td>
      <td className="py-3 px-3 text-rem-85 font-medium text-destructive">
        <span className="inline-flex items-center gap-0.5">
          <TrendingDown className="h-3 w-3" /> -{getFormatRupiah(log.deduction)}
        </span>
      </td>
      <td className="py-3 pr-4 text-rem-85 text-foreground font-medium text-right">{getFormatRupiah(log.balanceAfter)}</td>
    </tr>
  )
}

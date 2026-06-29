'use client'

import { useState, useEffect } from 'react'
import { TrendingDown, RefreshCw, MessageSquare, Download } from 'lucide-react'
import { useUsageSaldoControllers } from '../controllers/usageSaldoControllers'
import { useUsageSaldoStates } from '../states/usageSaldoStates'
import type { DataUsageSaldoBalance, DataUsageSaldoLog, DataUsageSaldoLogList } from '../types/usageSaldoTypes'

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: Readonly<StatCardProps>) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-rem-85 text-muted-foreground mb-2">{title}</p>
      <p className="text-rem-200 font-bold text-foreground leading-none">{value}</p>
    </div>
  )
}

interface LogRowProps {
  log: DataUsageSaldoLog
  formatDate: (iso: string) => string
  formatRupiah: (amount: number) => string
}

function LogRow({ log, formatDate, formatRupiah }: Readonly<LogRowProps>) {
  const isChat = log.activityType === 'chat'
  const icon = isChat ? <MessageSquare className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />
  const chatLabel = log.senderName ? `Chat — ${log.senderName}` : 'Chat masuk'
  const label = isChat ? chatLabel : 'Sync dokumen'

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pl-4 text-rem-85 text-muted-foreground">{formatDate(log.createdAt)}</td>
      <td className="py-3 px-3">
        <span className="inline-flex items-center gap-1.5 text-rem-85 text-foreground">{icon} {label}</span>
      </td>
      <td className="py-3 px-3 text-rem-85 font-medium text-destructive">
        <span className="inline-flex items-center gap-0.5">
          <TrendingDown className="h-3 w-3" /> -{formatRupiah(log.deduction)}
        </span>
      </td>
      <td className="py-3 pr-4 text-rem-85 text-foreground font-medium text-right">{formatRupiah(log.balanceAfter)}</td>
    </tr>
  )
}

export default function UsageSaldoView() {
  const { storeTopup } = useUsageSaldoControllers()
  const { balance, usageLogs, payloadGetLogs, setGetLogs } = useUsageSaldoStates()
  const [isMounted, setIsMounted] = useState(false)

  const formatRupiah = (amount: number) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  const getMonthLabel = (year: number, month: number) =>
    `${year} - ${new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short' })}`

  const getMonthOptions = () => {
    const now = new Date()
    const options = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      options.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: getMonthLabel(d.getFullYear(), d.getMonth() + 1),
      })
    }
    return options
  }

  const aggregateDailyData = (logs: DataUsageSaldoLog[], year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const totals = new Array<number>(daysInMonth).fill(0)
    for (const log of logs) {
      const d = new Date(log.createdAt)
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        totals[d.getDate() - 1] += log.deduction
      }
    }
    return totals
  }

  useEffect(() => { setIsMounted(true) }, [])

  const balanceData = balance.data as DataUsageSaldoBalance | undefined
  const logsData = usageLogs.data as DataUsageSaldoLogList | undefined
  const logs = logsData?.logs ?? []

  const selectedYear = Number.parseInt(payloadGetLogs.year ?? String(new Date().getFullYear()))
  const selectedMonth = Number.parseInt(payloadGetLogs.month ?? String(new Date().getMonth() + 1))
  const monthlyTotal = logs.reduce((sum, log) => sum + log.deduction, 0)
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
  const dailyData = aggregateDailyData(logs, selectedYear, selectedMonth)
  const monthOptions = getMonthOptions()

  const syncMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split('-')
    setGetLogs({ year: String(year), month: String(month) })
  }

  const saveTopUp = () => {
    const amountStr = prompt('Masukkan jumlah top-up (Rp):')
    if (!amountStr) return
    const amount = Number.parseInt(amountStr.replaceAll('.', '').replaceAll(',', ''))
    if (!Number.isNaN(amount) && amount > 0) storeTopup.mutate({ amount })
  }

  const syncExport = () => {
    const csvRows = [
      ['Tanggal', 'Aktivitas', 'Potongan', 'Sisa Saldo'],
      ...logs.map((log) => [
        new Date(log.createdAt).toLocaleDateString('id-ID'),
        log.activityType,
        String(log.deduction),
        String(log.balanceAfter),
      ]),
    ]
    const csv = csvRows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `usage-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadChart = () => {
    if (!isMounted) {
      return <div className="h-[200px] bg-muted/20 rounded animate-pulse" />
    }

    // Dynamic require needed for client-side hydration compatibility with SSR
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const Highcharts = require('highcharts') as typeof import('highcharts')
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const HighchartsReact = (require('highcharts-react-official') as { default: typeof import('highcharts-react-official').default }).default

    const allDayCategories = Array.from(
      { length: daysInMonth },
      (_, i) => `${selectedMonth}-${i + 1}`,
    )

    const chartOptions = {
      chart: { type: 'column', backgroundColor: 'transparent', height: 200, margin: [20, 0, 30, 55] },
      title: { text: '' },
      xAxis: {
        categories: allDayCategories,
        labels: { step: 5, style: { color: '#6B7280', fontSize: '10px' } },
        lineColor: '#374151',
        tickColor: 'transparent',
      },
      yAxis: {
        title: { text: '' },
        labels: {
          format: 'Rp {value}',
          style: { color: '#6B7280', fontSize: '10px' },
        },
        gridLineColor: '#374151',
      },
      series: [{
        type: 'column',
        name: 'Pengeluaran',
        data: dailyData,
        color: '#F59E0B',
        borderWidth: 0,
        borderRadius: 2,
        pointPadding: 0.05,
        groupPadding: 0,
      }],
      legend: { enabled: false },
      tooltip: {
        backgroundColor: '#1F2937',
        style: { color: '#F9FAFB', fontSize: '12px' },
        headerFormat: '',
        pointFormat: '{point.category}: <b>Rp {point.y}</b>',
      },
      credits: { enabled: false },
      plotOptions: { column: { borderWidth: 0 } },
    }

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-rem-200 font-bold text-foreground tracking-tight">Usage</h1>
        <p className="text-rem-85 text-muted-foreground mt-1">
          Semua tanggal dan waktu berbasis UTC, data mungkin tertunda hingga 5 menit.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Topped-up balance"
          value={balanceData ? formatRupiah(balanceData.balance) : '—'}
        />
        <StatCard
          title={`Pengeluaran ${getMonthLabel(selectedYear, selectedMonth)}`}
          value={formatRupiah(monthlyTotal)}
        />
      </div>

      {/* Top Up + Alert */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={saveTopUp}
          className="rounded-lg border bg-foreground text-background px-4 py-2 text-rem-90 font-semibold hover:opacity-90 transition-opacity"
        >
          Top up
        </button>
        <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
          <p className="text-rem-80 font-medium text-amber-600 dark:text-amber-400">Balance alert dinonaktifkan</p>
        </div>
      </div>

      {/* Monthly Usage */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-4 py-4 border-b flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-rem-100 font-semibold text-foreground">Monthly usage</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={`${selectedYear}-${selectedMonth}`}
              onChange={syncMonth}
              className="rounded-lg border bg-muted text-foreground text-rem-85 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {monthOptions.map((opt) => (
                <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={syncExport}
              className="flex items-center gap-1.5 rounded-lg border bg-foreground text-background px-3 py-1.5 text-rem-85 font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        <div className="px-5 pt-4 pb-1">
          <p className="text-rem-85 text-muted-foreground">
            Pengeluaran{' '}
            <span className="font-semibold text-foreground">{formatRupiah(monthlyTotal)}</span>
          </p>
        </div>

        <div className="px-4 pb-4">
          {loadChart()}
        </div>
      </div>

      {/* Usage Logs */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h2 className="text-rem-95 font-semibold text-foreground">Riwayat Penggunaan</h2>
        </div>

        {usageLogs.status === 'loading' && (
          <div className="p-6 space-y-3">
            {['r1', 'r2', 'r3'].map((k) => (
              <div key={k} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        )}

        {usageLogs.status !== 'loading' && logs.length === 0 && (
          <div className="py-12 text-center">
            <TrendingDown className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-rem-90 font-medium text-foreground">Belum ada aktivitas</p>
            <p className="text-rem-80 text-muted-foreground mt-1">Riwayat chat akan muncul di sini</p>
          </div>
        )}

        {usageLogs.status !== 'loading' && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2.5 pl-4 text-left text-rem-75 font-semibold text-muted-foreground">Waktu</th>
                  <th className="py-2.5 px-3 text-left text-rem-75 font-semibold text-muted-foreground">Aktivitas</th>
                  <th className="py-2.5 px-3 text-left text-rem-75 font-semibold text-muted-foreground">Potongan</th>
                  <th className="py-2.5 pr-4 text-right text-rem-75 font-semibold text-muted-foreground">Sisa Saldo</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => <LogRow key={log.id} log={log} formatDate={formatDate} formatRupiah={formatRupiah} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

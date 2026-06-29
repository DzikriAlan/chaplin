'use client'

import { useState, useEffect } from 'react'
import { TrendingDown, Download } from 'lucide-react'
import { useUsageSaldoControllers } from '../controllers/usageSaldoControllers'
import { useUsageSaldoStates } from '../states/usageSaldoStates'
import type { DataUsageSaldoBalance, DataUsageSaldoLog, DataUsageSaldoLogList } from '../types/usageSaldoTypes'
import UsageSaldoStatCard from './UsageSaldoStatCard'
import UsageSaldoLogRow from './UsageSaldoLogRow'
import UsageSaldoChart from './UsageSaldoChart'

export default function UsageSaldoView() {
  // variable importer
  const { storeTopup } = useUsageSaldoControllers()
  const { balance, usageLogs, payloadGetLogs, setGetLogs } = useUsageSaldoStates()

  // states / variable
  const [isMounted, setIsMounted] = useState(false)

  const balanceData = balance.data as DataUsageSaldoBalance | undefined
  const logsData = usageLogs.data as DataUsageSaldoLogList | undefined
  const logs = logsData?.logs ?? []

  const selectedYear = Number.parseInt(payloadGetLogs.year ?? String(new Date().getFullYear()))
  const selectedMonth = Number.parseInt(payloadGetLogs.month ?? String(new Date().getMonth() + 1))
  const monthlyTotal = logs.reduce((sum, log) => sum + log.deduction, 0)
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()

  // function / methode
  const getFormatRupiah = (amount: number) => `Rp ${Math.abs(amount).toLocaleString('id-ID')}`

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

  const getAggregateDailyData = (logList: DataUsageSaldoLog[], year: number, month: number) => {
    const total = new Date(year, month, 0).getDate()
    const totals = new Array<number>(total).fill(0)
    for (const log of logList) {
      const d = new Date(log.createdAt)
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        totals[d.getDate() - 1] += log.deduction
      }
    }
    return totals
  }

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

  const dailyData = getAggregateDailyData(logs, selectedYear, selectedMonth)
  const monthOptions = getMonthOptions()

  // lifecycle react
  useEffect(() => { setIsMounted(true) }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-rem-200 font-bold text-foreground tracking-tight">Usage</h1>
        <p className="text-rem-85 text-muted-foreground mt-1">
          Semua tanggal dan waktu berbasis UTC, data mungkin tertunda hingga 5 menit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UsageSaldoStatCard
          title="Topped-up balance"
          value={balanceData ? getFormatRupiah(balanceData.balance) : '—'}
        />
        <UsageSaldoStatCard
          title={`Pengeluaran ${getMonthLabel(selectedYear, selectedMonth)}`}
          value={getFormatRupiah(monthlyTotal)}
        />
      </div>

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
            <span className="font-semibold text-foreground">{getFormatRupiah(monthlyTotal)}</span>
          </p>
        </div>

        <div className="px-4 pb-4">
          <UsageSaldoChart
            isMounted={isMounted}
            daysInMonth={daysInMonth}
            selectedMonth={selectedMonth}
            dailyData={dailyData}
          />
        </div>
      </div>

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
                {logs.map((log) => <UsageSaldoLogRow key={log.id} log={log} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { FileText, MessageSquare, HelpCircle, Database } from 'lucide-react'
import { useDashboardControllers } from '../controllers/dashboardControllers'
import type { DataDashboard } from '../types/dashboardTypes'
import LoadData from '@/shared/components/LoadData'
import StatCard from './StatCard'
import StatCardSkeleton from './StatCardSkeleton'
import QuickActions from './QuickActions'

export default function DashboardView() {
  const { fetchDashboard } = useDashboardControllers()
  const stats = fetchDashboard.data as DataDashboard | null

  function getLoadStatus() {
    if (fetchDashboard.isLoading) return 'loading'
    if (fetchDashboard.isError) return 'error'
    return 'success'
  }
  const loadStatus = getLoadStatus()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-rem-150 font-bold text-foreground">Selamat Datang</h1>
        <p className="text-rem-90 text-muted-foreground mt-0.5">
          Platform AI untuk mendukung operasional instansi Anda
        </p>
      </div>

      <LoadData status={loadStatus} skeleton={<StatCardSkeleton />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Dokumen"
            value={stats?.documentCount ?? 0}
            icon={<FileText className="h-5 w-5 text-primary" />}
            href="/documents"
            iconBg="bg-primary/10"
          />
          <StatCard
            label="Chunks Terindeks"
            value={stats?.chunkCount ?? 0}
            icon={<Database className="h-5 w-5 text-violet-600" />}
            href="/documents"
            iconBg="bg-violet-50"
          />
          <StatCard
            label="Percakapan Chat"
            value={stats?.chatCount ?? 0}
            icon={<MessageSquare className="h-5 w-5 text-emerald-600" />}
            href="/chat"
            iconBg="bg-emerald-50"
          />
          <StatCard
            label="FAQ Aktif"
            value={stats?.knowledgeCount ?? 0}
            icon={<HelpCircle className="h-5 w-5 text-rose-600" />}
            href="/knowledge-base"
            iconBg="bg-rose-50"
          />
        </div>
      </LoadData>

      <QuickActions />
    </div>
  )
}

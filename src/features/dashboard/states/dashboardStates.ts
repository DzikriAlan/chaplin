import { create } from 'zustand'
import type { Dashboard } from '../types/dashboardTypes'

interface DashboardStore {
  dashboard: Dashboard
}

export const useDashboardStates = create<DashboardStore>(() => ({
  dashboard: {
    status: 'loading',
    statusTitle: 'Memuat data',
    statusSubtitle: 'Mohon tunggu...',
    data: null,
  },
}))

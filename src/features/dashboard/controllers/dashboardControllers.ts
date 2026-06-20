import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../services/dashboardServices'

export const useDashboardControllers = () => {
  const fetchDashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  })

  return { fetchDashboard }
}

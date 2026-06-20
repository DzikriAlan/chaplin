import { useQuery } from '@tanstack/react-query'
import { useUsageStates } from '../states/usageStates'
import { getUsage } from '../services/usageServices'

export const useUsageControllers = () => {
  const { payloadGetUsage } = useUsageStates()

  const fetchUsage = useQuery({
    queryKey: ['usage', payloadGetUsage],
    queryFn: () => getUsage(payloadGetUsage),
  })

  return { fetchUsage }
}

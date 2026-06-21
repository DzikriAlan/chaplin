import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUsageSaldoStates } from '../states/usageSaldoStates'
import { getUsageSaldoBalance, postUsageSaldoTopup, getUsageSaldoLogs } from '../services/usageSaldoServices'
import type { PayloadPostUsageSaldoTopup } from '../types/usageSaldoTypes'

export const useUsageSaldoControllers = () => {
  const queryClient = useQueryClient()
  const { payloadGetLogs } = useUsageSaldoStates()

  // Balance queries
  const fetchBalance = useQuery({
    queryKey: ['usage-saldo', 'balance'],
    queryFn: getUsageSaldoBalance,
  })

  const storeTopup = useMutation({
    mutationFn: (payload: PayloadPostUsageSaldoTopup) => postUsageSaldoTopup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-saldo', 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['usage-saldo', 'logs'] })
    },
  })

  // Usage queries
  const fetchLogs = useQuery({
    queryKey: ['usage-saldo', 'logs', payloadGetLogs],
    queryFn: () => getUsageSaldoLogs(payloadGetLogs),
  })

  return { fetchBalance, storeTopup, fetchLogs }
}

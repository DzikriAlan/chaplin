import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUsageSaldoStates } from '../states/usageSaldoStates'
import { getUsageSaldoBalance, postUsageSaldoTopup, getUsageSaldoLogs } from '../services/usageSaldoServices'
import type { PayloadPostUsageSaldoTopup, DataUsageSaldoBalance, DataUsageSaldoLogList } from '../types/usageSaldoTypes'

export const useUsageSaldoControllers = () => {
  const queryClient = useQueryClient()
  const { payloadGetLogs, setBalance, setBalanceTopup, setUsageLogs } = useUsageSaldoStates()

  const fetchBalance = useQuery({
    queryKey: ['usage-saldo', 'balance'],
    queryFn: async () => {
      setBalance({ status: 'loading' })
      try {
        const data = await getUsageSaldoBalance()
        setBalance({ status: 'success', statusTitle: 'Success', data: data as DataUsageSaldoBalance })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch balance'
        setBalance({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  const storeTopup = useMutation({
    mutationFn: (payload: PayloadPostUsageSaldoTopup) => postUsageSaldoTopup(payload),
    onMutate: () => {
      setBalanceTopup({ status: 'loading', statusTitle: 'Processing...' })
    },
    onSuccess: () => {
      setBalanceTopup({ status: 'success', statusTitle: 'Topup Successful' })
      queryClient.invalidateQueries({ queryKey: ['usage-saldo', 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['usage-saldo', 'logs'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to process topup'
      setBalanceTopup({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const fetchLogs = useQuery({
    queryKey: ['usage-saldo', 'logs', payloadGetLogs],
    queryFn: async () => {
      setUsageLogs({ status: 'loading' })
      try {
        const data = await getUsageSaldoLogs(payloadGetLogs)
        setUsageLogs({ status: 'success', statusTitle: 'Success', data: data as DataUsageSaldoLogList })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch logs'
        setUsageLogs({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  return { fetchBalance, storeTopup, fetchLogs }
}

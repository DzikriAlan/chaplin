import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBalance, postBalance } from '../services/balanceServices'
import type { PayloadPostBalance } from '../types/balanceTypes'

export const useBalanceControllers = () => {
  const queryClient = useQueryClient()

  const fetchBalance = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
  })

  const storeBalance = useMutation({
    mutationFn: (payload: PayloadPostBalance) => postBalance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    },
  })

  return { fetchBalance, storeBalance }
}

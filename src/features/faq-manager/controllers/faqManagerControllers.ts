import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFaqManager, postFaqManager, deleteFaqManager } from '../services/faqManagerServices'
import type { PayloadPostFaqManager } from '../types/faqManagerTypes'

export const useFaqManagerControllers = () => {
  const queryClient = useQueryClient()

  const fetchFaqManager = useQuery({
    queryKey: ['faqManager'],
    queryFn: getFaqManager,
  })

  const storeFaqManager = useMutation({
    mutationFn: (payload: PayloadPostFaqManager) => postFaqManager(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqManager'] })
    },
  })

  const removeFaqManager = useMutation({
    mutationFn: (id: string) => deleteFaqManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqManager'] })
    },
  })

  return { fetchFaqManager, storeFaqManager, removeFaqManager }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSentimentStates } from '../states/sentimentStates'
import { postSentimentAnalytics } from '../services/sentimentServices'
import type { PayloadPostSentimentAnalytics } from '../types/sentimentTypes'

export const useSentimentControllers = () => {
  const queryClient = useQueryClient()
  const { sentimentAnalytics } = useSentimentStates()

  const storeSentimentAnalytics = useMutation({
    mutationFn: (payload: PayloadPostSentimentAnalytics) => postSentimentAnalytics(payload),
    onMutate: () => {
      sentimentAnalytics.status = 'loading'
    },
    onSuccess: (data) => {
      sentimentAnalytics.data = data ?? null
      sentimentAnalytics.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['sentimentAnalytics'] })
    },
    onError: () => {
      sentimentAnalytics.status = 'error'
    },
  })

  return { storeSentimentAnalytics }
}

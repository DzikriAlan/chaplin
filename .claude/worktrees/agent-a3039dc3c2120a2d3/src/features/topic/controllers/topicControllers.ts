import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTopicStates } from '../states/topicStates'
import { postTopicAnalytics } from '../services/topicServices'
import type { PayloadPostTopicAnalytics } from '../types/topicTypes'

export const useTopicControllers = () => {
  const queryClient = useQueryClient()
  const { topicAnalytics } = useTopicStates()

  const storeTopicAnalytics = useMutation({
    mutationFn: (payload: PayloadPostTopicAnalytics) => postTopicAnalytics(payload),
    onMutate: () => {
      topicAnalytics.status = 'loading'
    },
    onSuccess: (data) => {
      topicAnalytics.data = data ?? null
      topicAnalytics.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['topicAnalytics'] })
    },
    onError: () => {
      topicAnalytics.status = 'error'
    },
  })

  return { storeTopicAnalytics }
}

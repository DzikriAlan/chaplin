import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useIssuesStates } from '../states/issuesStates'
import { postIssuesMap } from '../services/issuesServices'
import type { PayloadPostIssuesMap } from '../types/issuesTypes'

export const useIssuesControllers = () => {
  const queryClient = useQueryClient()
  const { issuesMap } = useIssuesStates()

  const storeIssuesMap = useMutation({
    mutationFn: (payload: PayloadPostIssuesMap) => postIssuesMap(payload),
    onMutate: () => {
      issuesMap.status = 'loading'
    },
    onSuccess: (data) => {
      issuesMap.data = data ?? null
      issuesMap.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['issuesMap'] })
    },
    onError: () => {
      issuesMap.status = 'error'
    },
  })

  return { storeIssuesMap }
}

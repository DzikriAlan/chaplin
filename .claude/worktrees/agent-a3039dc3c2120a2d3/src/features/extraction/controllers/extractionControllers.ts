import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useExtractionStates } from '../states/extractionStates'
import { postExtractionMap } from '../services/extractionServices'
import type { PayloadPostExtractionMap } from '../types/extractionTypes'

export const useExtractionControllers = () => {
  const queryClient = useQueryClient()
  const { extractionMap } = useExtractionStates()

  const storeExtractionMap = useMutation({
    mutationFn: (payload: PayloadPostExtractionMap) => postExtractionMap(payload),
    onMutate: () => {
      extractionMap.status = 'loading'
    },
    onSuccess: (data) => {
      extractionMap.data = data ?? null
      extractionMap.status = data ? 'success' : 'empty'
      queryClient.invalidateQueries({ queryKey: ['extractionMap'] })
    },
    onError: () => {
      extractionMap.status = 'error'
    },
  })

  return { storeExtractionMap }
}

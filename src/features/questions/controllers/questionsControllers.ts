import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuestions, postQuestionsGenerate } from '../services/questionsServices'
import type { PayloadPostQuestionsGenerate } from '../types/questionsTypes'

export const useQuestionsControllers = () => {
  const queryClient = useQueryClient()

  const fetchQuestions = useQuery({
    queryKey: ['questions'],
    queryFn: () => getQuestions(),
  })

  const storeQuestionsGenerate = useMutation({
    mutationFn: (payload: PayloadPostQuestionsGenerate) => postQuestionsGenerate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })

  return { fetchQuestions, storeQuestionsGenerate }
}

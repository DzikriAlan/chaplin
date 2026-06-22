import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKBFaqItems,
  postKBFaqItems,
  deleteKBFaqItemsId,
  patchKBFaqItemsId,
} from '../services/knowledgeBaseFaqServices'
import type { PayloadPostKbFaq } from '../types/knowledgeBaseTypes'

export const useKBFaqControllers = () => {
  const queryClient = useQueryClient()

  const fetchKnowledgeBase = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: getKBFaqItems,
  })

  const storeKnowledgeBase = useMutation({
    mutationFn: (payload: PayloadPostKbFaq) => postKBFaqItems(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  const removeKnowledgeBase = useMutation({
    mutationFn: (id: string) => deleteKBFaqItemsId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  const changeKnowledgeBase = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PayloadPostKbFaq> }) =>
      patchKBFaqItemsId(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  return { fetchKnowledgeBase, storeKnowledgeBase, removeKnowledgeBase, changeKnowledgeBase }
}

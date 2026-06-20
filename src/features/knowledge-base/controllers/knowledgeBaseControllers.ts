import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKnowledgeBase,
  postKnowledgeBase,
  deleteKnowledgeBase,
  patchKnowledgeBase,
} from '../services/knowledgeBaseServices'
import type { PayloadPostKnowledgeBase } from '../types/knowledgeBaseTypes'

export const useKnowledgeBaseControllers = () => {
  const queryClient = useQueryClient()

  const fetchKnowledgeBase = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: getKnowledgeBase,
  })

  const storeKnowledgeBase = useMutation({
    mutationFn: (payload: PayloadPostKnowledgeBase) => postKnowledgeBase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  const removeKnowledgeBase = useMutation({
    mutationFn: (id: string) => deleteKnowledgeBase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  const changeKnowledgeBase = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PayloadPostKnowledgeBase> }) =>
      patchKnowledgeBase(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
    },
  })

  return { fetchKnowledgeBase, storeKnowledgeBase, removeKnowledgeBase, changeKnowledgeBase }
}

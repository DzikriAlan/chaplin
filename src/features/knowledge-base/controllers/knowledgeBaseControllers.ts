import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKbFaqStates } from '../states/knowledgeBaseFaqStates'
import {
  getKBFaqItems,
  postKBFaqItems,
  deleteKBFaqItemsId,
  patchKBFaqItemsId,
} from '../services/knowledgeBaseFaqServices'
import type { PayloadPostKbFaq } from '../types/knowledgeBaseFaqTypes'

export const useKBFaqControllers = () => {
  const queryClient = useQueryClient()
  const { setKbFaq } = useKbFaqStates()

  const fetchKnowledgeBase = useQuery({
    queryKey: ['knowledgeBase', 'faq'],
    queryFn: async () => {
      setKbFaq({ status: 'loading' })
      try {
        const data = await getKBFaqItems()
        setKbFaq({ status: 'success', statusTitle: 'Success' })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch'
        setKbFaq({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  const storeKnowledgeBase = useMutation({
    mutationFn: (payload: PayloadPostKbFaq) => postKBFaqItems(payload),
    onMutate: () => {
      setKbFaq({ status: 'loading', statusTitle: 'Saving...' })
    },
    onSuccess: () => {
      setKbFaq({ status: 'success', statusTitle: 'Saved' })
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'faq'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to create'
      setKbFaq({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeKnowledgeBase = useMutation({
    mutationFn: (id: string) => deleteKBFaqItemsId(id),
    onMutate: () => {
      setKbFaq({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setKbFaq({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'faq'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setKbFaq({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const changeKnowledgeBase = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PayloadPostKbFaq> }) =>
      patchKBFaqItemsId(id, payload),
    onMutate: () => {
      setKbFaq({ status: 'loading', statusTitle: 'Updating...' })
    },
    onSuccess: () => {
      setKbFaq({ status: 'success', statusTitle: 'Updated' })
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'faq'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to update'
      setKbFaq({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  return {
    fetchKnowledgeBase,
    storeKnowledgeBase,
    removeKnowledgeBase,
    changeKnowledgeBase,
  }
}

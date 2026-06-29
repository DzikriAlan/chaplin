import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAgentsStates } from '../states/agentsStates'
import {
  getAgents,
  postAgent,
  deleteAgent,
  patchAgent,
} from '../services/agentsServices'
import type { PayloadPostAgent, PayloadPatchAgent, DataAgent } from '../types/agentsTypes'

/**
 * Agents Controllers
 * Handles React Query logic and syncs status to Zustand store
 */
export const useAgentsControllers = () => {
  const queryClient = useQueryClient()
  const { setAgentsList } = useAgentsStates()

  const fetchAgents = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      setAgentsList({ status: 'loading' })
      try {
        const data = await getAgents()
        setAgentsList({ status: 'success', statusTitle: 'Success', data: data as DataAgent[] })
        return data
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Failed to fetch'
        setAgentsList({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
        throw error
      }
    },
  })

  const storeAgent = useMutation({
    mutationFn: (payload: PayloadPostAgent) => postAgent(payload),
    onMutate: () => {
      setAgentsList({ status: 'loading', statusTitle: 'Saving...' })
    },
    onSuccess: () => {
      setAgentsList({ status: 'success', statusTitle: 'Saved' })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to create'
      setAgentsList({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const removeAgent = useMutation({
    mutationFn: (id: string) => deleteAgent(id),
    onMutate: () => {
      setAgentsList({ status: 'loading', statusTitle: 'Deleting...' })
    },
    onSuccess: () => {
      setAgentsList({ status: 'success', statusTitle: 'Deleted' })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to delete'
      setAgentsList({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  const changeAgent = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayloadPatchAgent }) =>
      patchAgent(id, payload),
    onMutate: () => {
      setAgentsList({ status: 'loading', statusTitle: 'Updating...' })
    },
    onSuccess: () => {
      setAgentsList({ status: 'success', statusTitle: 'Updated' })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error) => {
      const err = error instanceof Error ? error.message : 'Failed to update'
      setAgentsList({ status: 'error', statusTitle: 'Error', statusSubtitle: err })
    },
  })

  return { fetchAgents, storeAgent, removeAgent, changeAgent }
}

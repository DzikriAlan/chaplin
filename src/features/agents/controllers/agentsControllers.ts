import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAgents,
  postAgent,
  deleteAgent,
  patchAgent,
} from '../services/agentsServices'
import type { PayloadPostAgent, PayloadPatchAgent } from '../types/agentsTypes'

export const useAgentsControllers = () => {
  const queryClient = useQueryClient()

  const fetchAgents = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  })

  const storeAgent = useMutation({
    mutationFn: (payload: PayloadPostAgent) => postAgent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  const removeAgent = useMutation({
    mutationFn: (id: string) => deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  const changeAgent = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayloadPatchAgent }) =>
      patchAgent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  return { fetchAgents, storeAgent, removeAgent, changeAgent }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getChat, postChat, getChatSessions } from '../services/chatServices'
import type { PayloadPostChat } from '../types/chatTypes'

export const useChatControllers = (sessionId: string) => {
  const queryClient = useQueryClient()

  const fetchChat = useQuery({
    queryKey: ['chat', sessionId],
    queryFn: () => getChat(sessionId),
    enabled: !!sessionId,
  })

  const storeChat = useMutation({
    mutationFn: (payload: PayloadPostChat) => postChat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', sessionId] })
    },
  })

  return { fetchChat, storeChat }
}

export const useChatSessionsControllers = () => {
  const fetchChatSessions = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => getChatSessions(),
    refetchInterval: 10_000,
  })

  return { fetchChatSessions }
}

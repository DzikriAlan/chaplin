import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ChatView from '@/features/chat/components/ChatView'
import { useUIStates } from '@/shared/states/uiStates'

export default function EmbedChat() {
  const router = useRouter()
  const docsParam = typeof router.query['docs'] === 'string' ? router.query['docs'] : undefined
  const docs = docsParam ? docsParam.split(',').filter(Boolean) : undefined
  const agentParam = typeof router.query['agent'] === 'string' ? router.query['agent'] : undefined

  const { setSelectedAgentId } = useUIStates()

  useEffect(() => {
    if (agentParam) {
      setSelectedAgentId(agentParam)
    }
  }, [agentParam, setSelectedAgentId])

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col h-screen bg-background">
        <ChatView docs={docs} isEmbed />
      </div>
    </>
  )
}

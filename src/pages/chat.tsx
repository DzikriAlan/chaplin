import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import type { DataAgent } from '@/features/agents/types/agentsTypes'
import { useUIStates } from '@/shared/states/uiStates'
import Layout from '@/shared/components/Layout'
import AgentsSwitch from '@/features/agents/components/AgentsSwitch'
import ChatView from '@/features/chat/components/ChatView'

const ChatPage: NextPage = () => {
  const { selectedAgentId, setSelectedAgentId } = useUIStates()

  function handleSelectAgent(agent: DataAgent | null) {
    setSelectedAgentId(agent?.id ?? null)
  }

  return (
    <>
      <Head>
        <title>Chatbot — Chaplin</title>
      </Head>
      <Toaster position="top-right" />
      <Layout
        noPadding
        headerRight={
          <AgentsSwitch selectedAgentId={selectedAgentId} onSelectAgent={handleSelectAgent} />
        }
      >
        <ChatView />
      </Layout>
    </>
  )
}

export default ChatPage

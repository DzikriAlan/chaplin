import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/shared/components/Layout'
import ChatView from '@/features/chat/components/ChatView'

const ChatDetailPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Head>
        <title>Chat — Chaplin</title>
      </Head>
      <Layout noPadding>
        <ChatView conversationId={id as string} />
      </Layout>
    </>
  )
}

export default ChatDetailPage

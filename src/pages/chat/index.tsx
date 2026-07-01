import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '@/shared/components/Layout'
import ChatView from '@/features/chat/components/ChatView'

const ChatPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat — Chaplin</title>
      </Head>
      <Layout noPadding>
        <ChatView />
      </Layout>
    </>
  )
}

export default ChatPage

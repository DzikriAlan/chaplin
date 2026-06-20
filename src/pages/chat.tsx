import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Layout from '@/shared/components/Layout'
import ChatView from '@/features/chat/components/ChatView'

const ChatPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chatbot — Chaplin</title>
      </Head>
      <Toaster position="top-right" />
      <Layout noPadding>
        <ChatView />
      </Layout>
    </>
  )
}

export default ChatPage

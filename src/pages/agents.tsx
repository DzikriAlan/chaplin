import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Layout from '@/shared/components/Layout'
import AgentsList from '@/features/agents/components/AgentsList'

const AgentsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Agents — Chaplin</title>
      </Head>
      <Toaster position="top-right" />
      <Layout noPadding>
        <div className="p-6 h-full flex flex-col">
          <AgentsList />
        </div>
      </Layout>
    </>
  )
}

export default AgentsPage

import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Layout from '@/shared/components/Layout'
import KnowledgeBaseView from '@/features/knowledge-base/components/KnowledgeBaseView'

const KnowledgeBasePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Knowledge Base — Chaplin</title>
      </Head>
      <Toaster position="top-right" />
      <Layout>
        <KnowledgeBaseView />
      </Layout>
    </>
  )
}

export default KnowledgeBasePage

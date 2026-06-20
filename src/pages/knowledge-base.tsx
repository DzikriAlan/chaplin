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
      <Layout title="Knowledge Base" hideTitleMobile noPadding>
        <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-auto p-4 md:p-6">
          <KnowledgeBaseView />
        </div>
      </Layout>
    </>
  )
}

export default KnowledgeBasePage

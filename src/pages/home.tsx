import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '@/shared/components/Layout'
import HomeChatView from '@/features/home/components/HomeChatView'

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home — Chaplin</title>
      </Head>
      <Layout noPadding>
        <HomeChatView />
      </Layout>
    </>
  )
}

export default HomePage

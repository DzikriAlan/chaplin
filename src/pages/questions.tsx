import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { useQuestionsControllers } from '@/features/questions/controllers/questionsControllers'
import Layout from '@/shared/components/Layout'
import QuestionsGenerate from '@/features/questions/components/QuestionsGenerate'
import QuestionsList from '@/features/questions/components/QuestionsList'

const QuestionsPage: NextPage = () => {
  const { fetchQuestions } = useQuestionsControllers()
  const questions = (fetchQuestions.data ?? []) as import('@/features/questions/types/questionsTypes').DataQuestions[]

  const handleGenerated = () => {
    fetchQuestions.refetch()
  }

  return (
    <>
      <Head>
        <title>Generate Soal — AI Sekolah</title>
      </Head>
      <Toaster position="top-right" />
      <Layout title="Generate Soal">
        <div className="space-y-6">
          <QuestionsGenerate onGenerated={handleGenerated} />
          <QuestionsList
            questions={questions}
            isLoading={fetchQuestions.isLoading}
            isError={fetchQuestions.isError}
          />
        </div>
      </Layout>
    </>
  )
}

export default QuestionsPage

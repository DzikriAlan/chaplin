import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import type { DataQuestions } from '../types/questionsTypes'
import LoadData from '@/shared/components/LoadData'

interface QuestionCardProps {
  question: DataQuestions
  index: number
}

function QuestionCard({ question, index }: Readonly<QuestionCardProps>) {
  const [showAnswer, setShowAnswer] = useState(false)
  const isMultiple = question.type === 'multiple_choice'
  const options = question.options

  const handleToggleAnswer = () => setShowAnswer((v) => !v)

  return (
    <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-rem-80 font-bold">
          {index}
        </span>
        <p className="text-rem-90 font-medium text-dark-text leading-relaxed flex-1">{question.question}</p>
      </div>

      {isMultiple && options && (
        <div className="ml-10 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {options.map((opt) => (
            <div
              key={opt}
              className={`rounded-lg border px-3 py-2 text-rem-85 ${
                showAnswer && opt.startsWith(question.answer)
                  ? 'border-pos bg-pos-light text-pos font-semibold'
                  : 'text-dark-text'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      <div className="ml-10">
        <button
          type="button"
          onClick={handleToggleAnswer}
          className="flex items-center gap-1.5 text-rem-80 font-medium text-primary hover:opacity-80"
        >
          {showAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showAnswer ? 'Sembunyikan Jawaban' : 'Lihat Jawaban'}
        </button>

        {showAnswer && (
          <div className="mt-2 space-y-2">
            <div className="rounded-lg bg-pos-light p-3">
              <p className="text-rem-85 font-semibold text-pos">
                Jawaban: {question.answer}
              </p>
            </div>
            {question.discussion && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-rem-80 text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-dark-text">Pembahasan: </span>
                  {question.discussion}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-10 flex items-center gap-3 pt-1">
        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-rem-75 font-medium text-secondary">
          {isMultiple ? 'Pilihan Ganda' : 'Esai'}
        </span>
        <span className="text-rem-75 text-muted-foreground">{question.topic}</span>
      </div>
    </div>
  )
}

interface Props {
  questions: DataQuestions[]
  isLoading: boolean
  isError: boolean
}

export default function QuestionsList({ questions, isLoading, isError }: Readonly<Props>) {
  function getListStatus() {
    if (isLoading) return 'loading'
    if (isError) return 'error'
    return questions.length === 0 ? 'empty' : 'success'
  }
  const listStatus = getListStatus()

  return (
    <LoadData
      status={listStatus}
      statusTitle="Belum ada soal"
      statusSubtitle="Generate soal baru menggunakan form di atas"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-rem-110 font-semibold text-dark-text">
            {questions.length} Soal Tersimpan
          </h2>
        </div>
        {questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i + 1} />
        ))}
      </div>
    </LoadData>
  )
}

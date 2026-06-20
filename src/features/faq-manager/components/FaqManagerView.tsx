'use client'

import { useState } from 'react'
import { Plus, Trash2, HelpCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFaqManagerControllers } from '../controllers/faqManagerControllers'
import type { DataFaqManager } from '../types/faqManagerTypes'

const MAX_FAQ = 50
const MAX_QUESTION_CHARS = 250
const MAX_ANSWER_CHARS = 1000

const schema = z.object({
  question: z.string().min(1, 'Pertanyaan wajib diisi').max(MAX_QUESTION_CHARS, `Maksimal ${MAX_QUESTION_CHARS} karakter`),
  answer: z.string().min(1, 'Jawaban wajib diisi').max(MAX_ANSWER_CHARS, `Maksimal ${MAX_ANSWER_CHARS} karakter`),
})
type FormValues = z.infer<typeof schema>

interface FaqRowProps {
  item: DataFaqManager
  onDelete: (id: string) => void
  isDeleting: boolean
}

function FaqRow({ item, onDelete, isDeleting }: Readonly<FaqRowProps>) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-xl bg-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-rem-90 font-medium text-foreground flex-1 min-w-0 truncate">{item.question}</span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t">
          <p className="text-rem-85 text-foreground mt-3 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqManagerView() {
  const { fetchFaqManager, storeFaqManager, removeFaqManager } = useFaqManagerControllers()
  const items = (fetchFaqManager.data as DataFaqManager[]) ?? []
  const isFull = items.length >= MAX_FAQ

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: '', answer: '' },
  })
  const questionLen = watch('question').length
  const answerLen = watch('answer').length

  const handleAdd = (values: FormValues) => {
    storeFaqManager.mutate(values, { onSuccess: () => reset() })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    removeFaqManager.mutate(id)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-rem-150 font-bold text-foreground tracking-tight">FAQ Manager</h1>
            <p className="text-rem-85 text-muted-foreground">
              {items.length}/{MAX_FAQ} FAQ terdaftar
            </p>
          </div>
        </div>
      </div>

      {!isFull && (
        <form onSubmit={handleSubmit(handleAdd)} className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="text-rem-95 font-semibold text-foreground">Tambah FAQ Baru</h2>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-rem-85 font-medium text-foreground">Pertanyaan</p>
              <span className={`text-rem-75 ${questionLen > MAX_QUESTION_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                {questionLen}/{MAX_QUESTION_CHARS}
              </span>
            </div>
            <input
              {...register('question')}
              placeholder="Apa saja metode pembayaran yang tersedia?"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.question && <p className="text-rem-80 text-destructive mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-rem-85 font-medium text-foreground">Jawaban</p>
              <span className={`text-rem-75 ${answerLen > MAX_ANSWER_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                {answerLen}/{MAX_ANSWER_CHARS}
              </span>
            </div>
            <textarea
              {...register('answer')}
              rows={3}
              placeholder="Kami menerima transfer bank, QRIS, dan COD untuk area tertentu."
              className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.answer && <p className="text-rem-80 text-destructive mt-1">{errors.answer.message}</p>}
          </div>

          <button
            type="submit"
            disabled={storeFaqManager.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-rem-90 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {storeFaqManager.isPending ? 'Menyimpan...' : 'Tambah FAQ'}
          </button>
        </form>
      )}

      {isFull && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-rem-85 text-amber-700 dark:text-amber-400">
            Batas maksimal {MAX_FAQ} FAQ tercapai. Hapus FAQ lama untuk menambah yang baru.
          </p>
        </div>
      )}

      {fetchFaqManager.isLoading && (
        <div className="space-y-3">
          {['f1', 'f2', 'f3'].map((k) => (
            <div key={k} className="h-12 rounded-xl border bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!fetchFaqManager.isLoading && items.length === 0 && (
        <div className="py-12 text-center">
          <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-rem-90 font-medium text-foreground">Belum ada FAQ</p>
          <p className="text-rem-80 text-muted-foreground mt-1">Tambahkan pertanyaan dan jawaban yang sering ditanyakan pelanggan</p>
        </div>
      )}

      {!fetchFaqManager.isLoading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <FaqRow
              key={item.id}
              item={item}
              onDelete={handleDelete}
              isDeleting={removeFaqManager.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}

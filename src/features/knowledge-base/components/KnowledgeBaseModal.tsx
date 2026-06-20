import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { DataKnowledgeBase } from '../types/knowledgeBaseTypes'

const schema = z.object({
  question: z.string().min(3, 'Pertanyaan minimal 3 karakter'),
  answer: z.string().min(5, 'Jawaban minimal 5 karakter'),
  tags: z.string(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  item?: DataKnowledgeBase | null
  isSaving: boolean
  onSave: (question: string, answer: string, tags: string[]) => void
  onClose: () => void
}

export default function KnowledgeBaseModal({ item, isSaving, onSave, onClose }: Readonly<Props>) {
  const isEdit = item != null

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: '', answer: '', tags: '' },
  })

  useEffect(() => {
    if (item) {
      reset({ question: item.question, answer: item.answer, tags: item.tags.join(', ') })
    } else {
      reset({ question: '', answer: '', tags: '' })
    }
  }, [item, reset])

  const handleFormSubmit = (values: FormValues) => {
    const tags = values.tags.split(',').map((t) => t.trim()).filter(Boolean)
    onSave(values.question, values.answer, tags)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-rem-100 font-semibold text-foreground">
            {isEdit ? 'Edit FAQ' : 'Tambah FAQ'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="question" className="text-rem-85 font-medium text-foreground">Pertanyaan</label>
            <input
              id="question"
              {...register('question')}
              placeholder="Tulis pertanyaan di sini..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.question && <p className="text-rem-75 text-destructive">{errors.question.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="answer" className="text-rem-85 font-medium text-foreground">Jawaban</label>
            <textarea
              id="answer"
              {...register('answer')}
              rows={4}
              placeholder="Tulis jawaban di sini..."
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.answer && <p className="text-rem-75 text-destructive">{errors.answer.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tags" className="text-rem-85 font-medium text-foreground">
              Tags <span className="text-muted-foreground font-normal">(pisahkan dengan koma)</span>
            </label>
            <input
              id="tags"
              {...register('tags')}
              placeholder="Contoh: umum, akademik, keuangan"
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-rem-85 font-medium text-foreground hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary px-4 py-2 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

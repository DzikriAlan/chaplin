import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { DataKbFaq } from '../types/knowledgeBaseFaqTypes'

type FormValues = z.infer<typeof schema>

interface Props {
  item?: DataKbFaq | null
  isSaving: boolean
  onSave: (question: string, answer: string, tags: string[]) => void
  onClose: () => void
}

const schema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters'),
  answer: z.string().min(5, 'Answer must be at least 5 characters'),
  tags: z.string(),
})

export default function KnowledgeBaseModal({ item, isSaving, onSave, onClose }: Readonly<Props>) {
  // variable importer
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: '', answer: '', tags: '' },
  })

  // states / variable
  const isEdit = item != null

  // function / methode
  const getSubmitLabel = () => {
    if (isSaving) return 'Saving...'
    return isEdit ? 'Save Changes' : 'Add FAQ'
  }

  const saveFaq = (values: FormValues) => {
    const tags = values.tags.split(',').map((t) => t.trim()).filter(Boolean)
    onSave(values.question, values.answer, tags)
  }

  // lifecycle react
  useEffect(() => {
    if (item) {
      reset({ question: item.question, answer: item.answer, tags: item.tags.join(', ') })
    } else {
      reset({ question: '', answer: '', tags: '' })
    }
  }, [item, reset])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-rem-100 font-semibold text-foreground">
            {isEdit ? 'Edit FAQ' : 'Add FAQ'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(saveFaq)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="question" className="text-rem-85 font-medium text-foreground">Question</label>
            <input
              id="question"
              {...register('question')}
              placeholder="Type your question here..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.question && <p className="text-rem-75 text-destructive">{errors.question.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="answer" className="text-rem-85 font-medium text-foreground">Answer</label>
            <textarea
              id="answer"
              {...register('answer')}
              rows={4}
              placeholder="Type your answer here..."
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.answer && <p className="text-rem-75 text-destructive">{errors.answer.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tags" className="text-rem-85 font-medium text-foreground">
              Tags <span className="text-muted-foreground font-normal">(separated by comma)</span>
            </label>
            <input
              id="tags"
              {...register('tags')}
              placeholder="Example: general, academic, finance"
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-rem-85 font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary px-4 py-2 text-rem-85 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {getSubmitLabel()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

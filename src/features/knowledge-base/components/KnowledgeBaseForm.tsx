import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useKBFaqControllers } from '../controllers/knowledgeBaseControllers'
import Loader from '@/shared/components/Loader'

const schema = z.object({
  question: z.string().min(5, 'Pertanyaan minimal 5 karakter'),
  answer: z.string().min(10, 'Jawaban minimal 10 karakter'),
})

type FormValues = z.infer<typeof schema>

export default function KnowledgeBaseForm() {
  // variable importer
  const { storeKnowledgeBase } = useKBFaqControllers()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: '', answer: '' },
  })

  // states / variable
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const isLoading = storeKnowledgeBase.isPending

  // function / methode
  const syncTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
    setTagInput('')
  }

  const destroyTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const syncTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      syncTag()
    }
  }

  const saveKnowledgeBase = async (values: FormValues) => {
    try {
      await storeKnowledgeBase.mutateAsync({ ...values, tags })
      toast.success('FAQ berhasil ditambahkan')
      form.reset()
      setTags([])
    } catch {
      toast.error('Gagal menyimpan FAQ')
    }
  }

  // lifecycle react
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h2 className="text-rem-110 font-semibold text-dark-text mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Tambah FAQ Baru
      </h2>

      <form onSubmit={form.handleSubmit(saveKnowledgeBase)} className="space-y-4">
        <div>
          <label htmlFor="kb-question" className="block text-rem-85 font-medium text-dark-text mb-1">Pertanyaan</label>
          <input
            id="kb-question"
            {...form.register('question')}
            placeholder="Apa jam belajar sekolah?"
            className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {form.formState.errors.question && (
            <p className="text-rem-75 text-destructive mt-1">{form.formState.errors.question.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="kb-answer" className="block text-rem-85 font-medium text-dark-text mb-1">Jawaban</label>
          <textarea
            id="kb-answer"
            {...form.register('answer')}
            placeholder="Jam belajar sekolah adalah..."
            rows={4}
            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {form.formState.errors.answer && (
            <p className="text-rem-75 text-destructive mt-1">{form.formState.errors.answer.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="kb-tag" className="block text-rem-85 font-medium text-dark-text mb-1">Tag (opsional)</label>
          <div className="flex gap-2">
            <input
              id="kb-tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={syncTagKeyDown}
              placeholder="Tambah tag, tekan Enter"
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={syncTag}
              className="rounded-lg border px-4 py-2 text-rem-85 font-medium text-dark-text hover:bg-muted"
            >
              Tambah
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-rem-80 text-secondary font-medium">
                  {tag}
                  <button type="button" onClick={() => destroyTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-rem-90 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? <Loader size="sm" inline /> : <Plus className="h-4 w-4" />}
          {isLoading ? 'Menyimpan...' : 'Simpan FAQ'}
        </button>
      </form>
    </div>
  )
}

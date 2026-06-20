import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuestionsControllers } from '../controllers/questionsControllers'
import Loader from '@/shared/components/Loader'

const schema = z.object({
  topic: z.string().min(3, 'Topik minimal 3 karakter'),
  count: z.number().min(1).max(50),
  type: z.enum(['multiple_choice', 'essay']),
  gradeLevel: z.string(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onGenerated: () => void
}

export default function QuestionsGenerate({ onGenerated }: Readonly<Props>) {
  const { storeQuestionsGenerate } = useQuestionsControllers()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: '', count: 10, type: 'multiple_choice', gradeLevel: '' },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      await storeQuestionsGenerate.mutateAsync(values)
      toast.success(`Berhasil membuat ${values.count} soal`)
      form.reset()
      onGenerated()
    } catch {
      toast.error('Gagal membuat soal')
    }
  }

  const isLoading = storeQuestionsGenerate.isPending

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h2 className="text-rem-110 font-semibold text-dark-text mb-4 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-primary" />
        Generate Soal Otomatis
      </h2>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-rem-85 font-medium text-dark-text mb-1">
            Topik / Materi
          </label>
          <input
            id="topic"
            {...form.register('topic')}
            placeholder="Contoh: Fotosintesis, Bab 1-3 Matematika"
            className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {form.formState.errors.topic && (
            <p className="text-rem-75 text-destructive mt-1">{form.formState.errors.topic.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="count" className="block text-rem-85 font-medium text-dark-text mb-1">Jumlah Soal</label>
            <input
              id="count"
              type="number"
              {...form.register('count', { valueAsNumber: true })}
              min={1}
              max={50}
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-rem-85 font-medium text-dark-text mb-1">Tipe Soal</label>
            <select
              id="type"
              {...form.register('type')}
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="multiple_choice">Pilihan Ganda</option>
              <option value="essay">Esai</option>
            </select>
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-rem-85 font-medium text-dark-text mb-1">Kelas (opsional)</label>
            <input
              id="gradeLevel"
              {...form.register('gradeLevel')}
              placeholder="Contoh: Kelas 10 SMA"
              className="w-full rounded-lg border bg-background px-3 py-2 text-rem-90 text-dark-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-rem-90 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? <Loader size="sm" inline /> : <Wand2 className="h-4 w-4" />}
          {isLoading ? 'Membuat soal...' : 'Generate Soal'}
        </button>
      </form>
    </div>
  )
}

import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    { label: 'Sinkronisasi Dokumen', href: '/documents', description: 'Sync & kelola dokumen dari Google Drive' },
    { label: 'Mulai Percakapan', href: '/chat', description: 'Tanyakan sesuatu kepada AI' },
    { label: 'Generate Soal', href: '/questions', description: 'Buat soal ujian otomatis dari materi' },
    { label: 'Kelola FAQ', href: '/knowledge-base', description: 'Tambah atau edit knowledge base' },
  ]

  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <h2 className="text-rem-100 font-semibold text-foreground mb-3">Aksi Cepat</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex flex-col gap-0.5 rounded-lg border bg-background px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <span className="text-rem-90 font-medium text-foreground group-hover:text-primary transition-colors">
              {action.label}
            </span>
            <span className="text-rem-80 text-muted-foreground">{action.description}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

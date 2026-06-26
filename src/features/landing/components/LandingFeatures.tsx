import { Bot, Database, Wallet, Zap, Shield, Globe } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: Readonly<FeatureCardProps>) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-colors">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-rem-100 font-semibold text-foreground">{title}</h3>
      <p className="text-rem-90 text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

const features = [
  {
    icon: <Bot className="h-5 w-5 text-primary" />,
    title: 'AI Agents',
    description: 'Buat dan kelola AI agent yang dapat menjawab pertanyaan berdasarkan knowledge base Anda secara otomatis.',
  },
  {
    icon: <Database className="h-5 w-5 text-primary" />,
    title: 'Knowledge Base',
    description: 'Upload dokumen, FAQ, dan data dari Google Drive atau My Drive sebagai sumber pengetahuan agent.',
  },
  {
    icon: <Wallet className="h-5 w-5 text-primary" />,
    title: 'Usage & Saldo',
    description: 'Monitor penggunaan dan kelola kredit API dengan dashboard yang informatif dan transparan.',
  },
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: 'Real-time Streaming',
    description: 'Respons AI agent dikirim secara streaming, memberikan pengalaman percakapan yang cepat dan natural.',
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: 'Autentikasi Aman',
    description: 'Login dengan Google Account yang terintegrasi dengan NextAuth, menjaga data Anda tetap aman.',
  },
  {
    icon: <Globe className="h-5 w-5 text-primary" />,
    title: 'Teknologi Modern',
    description: 'Dibangun di atas Next.js 14, TypeScript, TanStack Query, Zustand, dan Tailwind CSS untuk performa terbaik.',
  },
]

const techStack = [
  { label: 'Next.js 14', desc: 'Pages Router' },
  { label: 'TypeScript', desc: 'Type Safety' },
  { label: 'Tailwind CSS', desc: 'Styling' },
  { label: 'Shadcn/UI', desc: 'Components' },
  { label: 'TanStack Query', desc: 'Server State' },
  { label: 'Zustand', desc: 'Client State' },
  { label: 'Prisma', desc: 'ORM' },
  { label: 'React Hook Form', desc: 'Forms' },
]

export default function LandingFeatures() {
  return (
    <section id="features" className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Semua yang Anda butuhkan
          </h2>
          <p className="text-rem-100 text-muted-foreground max-w-xl mx-auto">
            Chaplin hadir dengan fitur lengkap untuk membangun dan mengelola AI agent perusahaan Anda.
          </p>
        </div>

        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-8">
          <h3 className="mb-6 text-center text-rem-100 font-semibold text-foreground">Tech Stack</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {techStack.map((tech) => (
              <div key={tech.label} className="rounded-xl border border-border bg-card px-4 py-3 text-center">
                <p className="text-rem-90 font-semibold text-foreground">{tech.label}</p>
                <p className="text-rem-75 text-muted-foreground mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

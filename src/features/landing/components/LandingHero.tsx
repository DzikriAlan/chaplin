import { ArrowRight, Bot, TrendingUp, Users, Clock } from 'lucide-react'

function StatCard({ icon, value, label }: Readonly<{ icon: React.ReactNode; value: string; label: string }>) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-rem-90 font-bold text-foreground leading-none">{value}</p>
        <p className="mt-0.5 text-rem-75 text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-14 pb-20 md:px-6">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Fade grid at edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      {/* Center glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-foreground/5 blur-[100px]" />
      </div>

      {/* Decorative corner dots */}
      <div className="pointer-events-none absolute top-24 left-8 hidden lg:grid grid-cols-4 gap-2">
        {['a1','a2','a3','a4','b1','b2','b3','b4','c1','c2','c3','c4','d1','d2','d3','d4'].map((id) => (
          <span key={id} className="h-1 w-1 rounded-full bg-foreground/15" />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-24 right-8 hidden lg:grid grid-cols-4 gap-2">
        {['e1','e2','e3','e4','f1','f2','f3','f4','g1','g2','g3','g4','h1','h2','h3','h4'].map((id) => (
          <span key={id} className="h-1 w-1 rounded-full bg-foreground/15" />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
          <span className="text-rem-80 text-muted-foreground font-medium">Portfolio Project</span>
        </div>

        <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
          Chaplin
          <br />
          <span className="text-muted-foreground">AI Agent Platform</span>
        </h1>

        <p className="mb-10 text-rem-100 md:text-rem-110 text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Platform manajemen AI agent dengan knowledge base terintegrasi. Dibangun dengan standar arsitektur dan naming convention yang ketat sebagai portofolio engineering.
        </p>

        {/* Stat cards — centered below tagline */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <StatCard
            icon={<Bot className="h-4 w-4 text-primary" />}
            value="12 Agent"
            label="Aktif sekarang"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            value="70%"
            label="Hemat waktu support"
          />
          <StatCard
            icon={<Users className="h-4 w-4 text-primary" />}
            value="98%"
            label="Kepuasan pelanggan"
          />
          <StatCard
            icon={<Clock className="h-4 w-4 text-primary" />}
            value="24/7"
            label="Tanpa hari libur"
          />
        </div>

        <a
          href="#rules"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-rem-95 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Lihat Rules
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}

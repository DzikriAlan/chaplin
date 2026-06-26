import Link from 'next/link'
import { Bot, ArrowRight } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-20 md:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-rem-80 text-muted-foreground font-medium">AI-Powered Platform</span>
        </div>

        <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
          Bangun AI Agent
          <br />
          <span className="text-muted-foreground">dalam hitungan menit</span>
        </h1>

        <p className="mb-10 text-rem-100 md:text-rem-110 text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Chaplin memudahkan tim Anda membuat, mengelola, dan mendeploy AI agent berbasis knowledge base — tanpa perlu coding.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-rem-95 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Coba Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-rem-95 font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Lihat Demo
          </a>
        </div>
      </div>
    </section>
  )
}

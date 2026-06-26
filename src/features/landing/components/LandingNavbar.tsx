'use client'

import Link from 'next/link'
import Image from 'next/image'
import chaplinLogo from '@/shared/assets/chaplin.png'
import ThemeToggle from '@/shared/components/ThemeToggle'

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={chaplinLogo} alt="Chaplin" height={28} className="select-none" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-rem-90 text-muted-foreground hover:text-foreground transition-colors">Fitur</a>
          <a href="#demo" className="text-rem-90 text-muted-foreground hover:text-foreground transition-colors">Demo</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle collapsed />
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-rem-85 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </header>
  )
}

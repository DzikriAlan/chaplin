import Link from 'next/link'
import Image from 'next/image'
import chaplinLogo from '@/shared/assets/chaplin.png'

export default function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={chaplinLogo} alt="Chaplin" height={24} className="select-none" />
          </Link>

          <nav className="flex items-center gap-6">
            <a href="#features" className="text-rem-85 text-muted-foreground hover:text-foreground transition-colors">Fitur</a>
            <a href="#demo" className="text-rem-85 text-muted-foreground hover:text-foreground transition-colors">Demo</a>
            <Link href="/agents" className="text-rem-85 text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </nav>

          <p className="text-rem-80 text-muted-foreground">
            © {currentYear} Chaplin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

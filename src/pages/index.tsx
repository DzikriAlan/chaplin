import LandingNavbar from '@/features/landing/components/LandingNavbar'
import LandingHero from '@/features/landing/components/LandingHero'
import LandingFeatures from '@/features/landing/components/LandingFeatures'
import LandingVideo from '@/features/landing/components/LandingVideo'
import LandingFooter from '@/features/landing/components/LandingFooter'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingVideo />
      <LandingFooter />
    </div>
  )
}

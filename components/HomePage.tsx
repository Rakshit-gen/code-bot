import Background from './Background'
import FloatingOrbs from './FloatingOrbs'
import Hero from './Hero'
// import FeaturesSection from './FeaturesSection'
import CTACard from './CTACard'

interface HomepageProps {
  onNavigate: () => void
}

export default function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="min-h-screen text-white p-12 font-sans relative">
      <Background />
      <FloatingOrbs />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Hero onGetStarted={onNavigate} />
        <CTACard onClick={onNavigate} />
      </div>
    </div>
  )
}
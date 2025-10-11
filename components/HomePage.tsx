// HomePage.tsx
import Background from './Background'
import FloatingOrbs from './FloatingOrbs'
import Hero from './Hero'
import CTACard from './CTACard'
import CTACard2 from './CTACard2'

interface HomepageProps {
  onNavigateToPR: () => void
  onNavigateToCodebase: () => boolean
}

export default function Homepage({ onNavigateToPR, onNavigateToCodebase }: HomepageProps) {
  return (
    <div className="min-h-screen text-white p-12 font-sans relative">
      <Background />
      <FloatingOrbs />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Hero onGetStarted={onNavigateToPR} />
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          <CTACard onClick={onNavigateToPR} />
          <CTACard2 onClick={onNavigateToCodebase} />
        </div>
      </div>
    </div>
  )
}
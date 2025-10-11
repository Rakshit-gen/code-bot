import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="text-center mb-24 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none animate-glow" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-6 mb-8">
          <Sparkles className="text-blue-400 animate-pulse" size={48} strokeWidth={2.5} />
          <h1 className="text-8xl font-semibold bg-gradient-to-r from-white via-blue-400 via-purple-400 to-white bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_80px_rgba(59,130,246,0.4)]">
            Aegis
          </h1>
          <Sparkles 
            className="text-purple-400 animate-pulse" 
            size={48} 
            strokeWidth={2.5}
            style={{ animationDelay: '1s' }}
          />
        </div>
        
        <p className="text-slate-400 text-2xl font-normal tracking-wide mb-12 max-w-3xl mx-auto">
          AI-powered code intelligence that detects bugs, security vulnerabilities, and performance bottlenecks across your pull requests and codebase.
          </p>
        
      </div>
    </div>
  )
}
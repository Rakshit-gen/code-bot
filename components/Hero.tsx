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
            AI Agent
          </h1>
          <Sparkles 
            className="text-purple-400 animate-pulse" 
            size={48} 
            strokeWidth={2.5}
            style={{ animationDelay: '1s' }}
          />
        </div>
        
        <p className="text-slate-400 text-2xl font-normal tracking-wide mb-12 max-w-3xl mx-auto">
          AI-powered code analysis that finds bugs, security issues, and performance improvements in your pull requests
        </p>
        
        <Button
          onClick={onGetStarted}
          size="lg"
          className="group px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-xl font-bold shadow-[0_20px_60px_-5px_rgba(59,130,246,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_30px_80px_-5px_rgba(59,130,246,0.8),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 tracking-wide h-auto"
        >
          Get Started 
          <ArrowRight className="ml-4" size={24} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  )
}
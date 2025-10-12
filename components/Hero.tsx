import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypewriterEffect } from './ui/typewriter-effect'

interface HeroProps {
  onGetStarted: () => void
}

const words = [
  { text: "Empower", className: "bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent" },
  { text: "developers", className: "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" },
  { text: "to", className: "text-gray-400" },
  { text: "ship", className: "bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent" },
  { text: "flawless", className: "bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent" },
  { text: "code", className: "bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse" },
  { text: "with", className: "text-gray-400" },
  { text: "Aegis", className: "bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-500 bg-clip-text text-transparent animate-text-flow" },
];


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
        
        <TypewriterEffect className='mt-10' words={words} />
        
      </div>
    </div>
  )
}
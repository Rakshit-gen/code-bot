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
        <div className="flex flex-col items-center justify-center mb-12 relative overflow-visible">
  <div className="flex items-center justify-center gap-8 relative overflow-visible">
    <Sparkles 
      className="text-cyan-400 animate-[pulse_1.8s_ease-in-out_infinite]" 
      size={52} 
      strokeWidth={2.6} 
    />
    
    <div className="relative overflow-visible">
      <h1
        className="relative text-8xl font-bold tracking-tighter 
        bg-gradient-to-r from-cyan-300 via-blue-500 via-purple-500 to-fuchsia-400 
        bg-[length:200%_auto] bg-clip-text text-transparent 
        animate-[gradientFlow_4s_linear_infinite] drop-shadow-[0_0_100px_rgba(99,102,241,0.5)] 
        overflow-visible"
      >
        Aegis
      </h1>
      <span className="absolute -inset-8 blur-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 opacity-30 animate-[glowPulse_3s_ease-in-out_infinite] rounded-full pointer-events-none" />
    </div>

    <Sparkles 
      className="text-fuchsia-400 animate-[pulse_1.8s_ease-in-out_infinite]" 
      size={52} 
      strokeWidth={2.6}
      style={{ animationDelay: '0.8s' }}
    />
  </div>
  </div>
        
        <TypewriterEffect className='mt-10' words={words} />
        
      </div>
    </div>
  )
}
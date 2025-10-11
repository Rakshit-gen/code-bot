'use client'

import { useState } from 'react'
import { Code, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CodebaseAnalyzerCTACardProps {
  onClick: () => boolean
}

export default function CTACard2({ onClick }: CodebaseAnalyzerCTACardProps) {
  const [hover, setHover] = useState(false)
  
  return (
    <Card
      onClick={onClick}
      className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 cursor-pointer overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-opacity duration-400 pointer-events-none ${hover ? 'opacity-100' : 'opacity-0'}`} />
      
      <CardHeader className="relative z-10 text-center pt-16">
        <div className="inline-flex p-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl mb-8 border border-purple-500/40 shadow-[0_0_60px_rgba(147,51,234,0.4)] mx-auto w-fit">
          <Code size={64} className="text-purple-400" strokeWidth={2.5} />
        </div>
        
        <CardTitle className="text-4xl font-semibold bg-gradient-to-r from-white via-purple-400 via-pink-400 to-white bg-clip-text text-transparent mb-4">
          Analyze Your Codebase
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 text-center pb-16">
        <CardDescription className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
          Get deep insights into architecture, security, code quality, and performance with AI-powered analysis
        </CardDescription>
        
        <div className="inline-flex items-center gap-3 text-purple-400 text-lg font-bold">
          Analyse codebase Now 
          <ArrowRight 
            size={24} 
            strokeWidth={2.5} 
            className={`transition-transform duration-300 ${hover ? 'translate-x-2' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
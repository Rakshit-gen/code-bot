'use client'

import { useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export default function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const [hover, setHover] = useState(false)
  
  return (
    <Card
      className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:shadow-[0_40px_100px_-10px_rgba(0,0,0,0.7)] hover:-translate-y-2 transition-all duration-400 overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`
        }}
      />
      
      <CardHeader className="relative z-10">
        <div 
          className="inline-flex p-6 rounded-2xl mb-4 shadow-lg border w-fit"
          style={{
            background: `linear-gradient(135deg, ${color}30 0%, ${color}20 100%)`,
            boxShadow: `0 0 40px ${color}40`,
            borderColor: `${color}40`
          }}
        >
          <Icon size={36} color={color} strokeWidth={2.5} />
        </div>
        
        <CardTitle className="text-3xl font-semibold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <CardDescription className="text-slate-400 text-lg leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

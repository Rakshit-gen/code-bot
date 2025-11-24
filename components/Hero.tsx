"use client"

import { memo } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Hero = memo(function Hero() {
  return (
    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            Aegis
          </h1>
        </div>
      </div>
      
      <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6 max-w-3xl mx-auto px-4">
        AI-Powered Code Review That Never Misses
      </p>
      
      <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
        Comprehensive security, performance, and quality analysis for your pull requests and codebase. 
        Get detailed, actionable feedback in seconds, not hours.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          asChild
          size="lg"
          className="text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14 w-full sm:w-auto"
        >
          <Link href="/review">Start Reviewing PRs</Link>
        </Button>
      </div>
    </div>
  )
})

export default Hero

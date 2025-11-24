"use client"

import { memo } from 'react'
import Link from 'next/link'
import Hero from './Hero'
import CTACard from './CTACard'
import CTACard2 from './CTACard2'
import FeaturesSection from './FeaturesSection'
import HowItWorks from './HowItWorks'
import BenefitsSection from './BenefitsSection'
import { ThemeToggle } from './theme-toggle'

const Homepage = memo(function Homepage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-4 right-4 z-50 sm:absolute">
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <Hero />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 lg:mt-16 max-w-5xl mx-auto">
          <Link href="/review" className="h-full">
            <CTACard />
          </Link>
          <Link href="/analyze" className="h-full">
            <CTACard2 />
          </Link>
        </div>
      </div>
      
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
    </div>
  )
})

export default Homepage
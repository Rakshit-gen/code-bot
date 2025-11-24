"use client"

import { memo } from 'react'
import { Upload, Search, FileCheck, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    icon: Upload,
    title: 'Provide Repository',
    description: 'Enter your GitHub repository URL and pull request number or select codebase analysis.',
  },
  {
    icon: Search,
    title: 'AI Analysis',
    description: 'Our AI agents thoroughly analyze your code for security, performance, and quality issues.',
  },
  {
    icon: FileCheck,
    title: 'Get Results',
    description: 'Receive detailed feedback with actionable recommendations to improve your code.',
  },
]

const HowItWorks = memo(function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and comprehensive code analysis in three easy steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative">
                <Card className="h-full group hover:shadow-lg transition-all hover:border-primary/50">
                  <CardHeader className="text-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Step {i + 1}
                      </span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default HowItWorks


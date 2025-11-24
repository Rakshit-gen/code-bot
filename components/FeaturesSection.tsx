"use client"

import { memo } from 'react'
import { Shield, Zap, Code2, GitBranch, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Shield,
    title: 'Security Analysis',
    description: 'Detects potential security vulnerabilities, injection attacks, and unsafe practices before they reach production.',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Identifies performance bottlenecks, memory leaks, and inefficient algorithms to keep your code fast.',
  },
  {
    icon: Code2,
    title: 'Code Quality',
    description: 'Ensures best practices, clean code principles, and maintainable architecture across your codebase.',
  },
  {
    icon: GitBranch,
    title: 'PR Review',
    description: 'Comprehensive pull request analysis with detailed feedback on every change and potential issues.',
  },
  {
    icon: AlertTriangle,
    title: 'Issue Detection',
    description: 'Automatically finds bugs, anti-patterns, and code smells that could cause problems later.',
  },
  {
    icon: CheckCircle2,
    title: 'Best Practices',
    description: 'Enforces coding standards, documentation requirements, and architectural guidelines.',
  },
]

const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to maintain high-quality, secure, and performant code
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="group hover:shadow-lg transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default FeaturesSection

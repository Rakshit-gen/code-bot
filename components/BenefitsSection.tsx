"use client"

import { memo } from 'react'
import { Clock, DollarSign, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const benefits = [
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Automated code review reduces manual inspection time by up to 80%, letting you focus on building features.',
  },
  {
    icon: DollarSign,
    title: 'Reduce Costs',
    description: 'Catch issues early before they reach production, saving on debugging, hotfixes, and technical debt.',
  },
  {
    icon: Users,
    title: 'Team Productivity',
    description: 'Consistent code quality standards across your team with automated enforcement and clear feedback.',
  },
  {
    icon: TrendingUp,
    title: 'Better Code',
    description: 'Continuous improvement through actionable insights that help developers learn and write better code.',
  },
]

const BenefitsSection = memo(function BenefitsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Aegis?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            The intelligent code review assistant that helps teams ship better code faster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <Card key={i} className="group hover:shadow-lg transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
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

export default BenefitsSection


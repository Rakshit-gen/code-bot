"use client"

import { memo } from 'react'
import Link from 'next/link'
import { GitPullRequest, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CTACard = memo(function CTACard() {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
          <GitPullRequest className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-semibold">
          Review Pull Requests
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow text-center">
        <CardDescription className="text-base sm:text-lg mb-6">
          Analyze your pull requests and get instant AI-powered feedback
        </CardDescription>
        
        <Button 
          asChild
          variant="outline" 
          className="mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <Link href="/review">
            Analyze PR
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
})

export default CTACard


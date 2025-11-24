"use client"

import { memo } from 'react'
import Link from 'next/link'
import { Code, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CTACard2 = memo(function CTACard2() {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
          <Code className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-semibold">
          Analyze Codebase
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow text-center">
        <CardDescription className="text-base sm:text-lg mb-6">
          Get deep insights into architecture, security, code quality, and performance
        </CardDescription>
        
        <Button 
          asChild
          variant="outline" 
          className="mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <Link href="/analyze">
            Analyze Codebase
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
})

export default CTACard2

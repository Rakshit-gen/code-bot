'use client'

import { useState } from 'react'
import { FileCode, Hash, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Issue {
  file?: string
  line?: number
  type?: string
  description: string
  suggestion?: string
}

interface IssueCardProps {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <Card
      className="relative bg-gradient-to-br from-slate-900/80 to-black/60 border border-slate-700/10 rounded-2xl shadow-lg mb-6 transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-red-500 via-amber-500 to-blue-500 transition-opacity duration-300 ${hover ? 'opacity-60' : 'opacity-0'}`}
      />
      
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-3 mb-5">
          {issue.file && (
            <Badge variant="outline" className="bg-slate-700/30 text-slate-300 border-slate-600/50 uppercase text-xs font-bold px-3 py-1.5">
              <FileCode size={14} strokeWidth={2.5} className="mr-2" />
              {issue.file}
            </Badge>
          )}
          {issue.line !== null && issue.line !== undefined && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/40 uppercase text-xs font-bold px-3 py-1.5">
              <Hash size={14} strokeWidth={2.5} className="mr-2" />
              Line {issue.line}
            </Badge>
          )}
          {issue.type && (
            <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/40 uppercase text-xs font-bold px-3 py-1.5">
              <Zap size={14} strokeWidth={2.5} className="mr-2" />
              {issue.type}
            </Badge>
          )}
        </div>

        <p className="text-slate-100 text-lg leading-relaxed mb-4 font-medium">
          {issue.description}
        </p>

        {issue.suggestion && (
          <Alert className="bg-gradient-to-br from-blue-500/15 to-purple-500/10 border-l-4 border-l-blue-500 border-blue-500/20 rounded-r-2xl">
            <span className="text-2xl mr-3">💡</span>
            <AlertDescription className="text-blue-300 text-base font-medium leading-relaxed">
              {issue.suggestion}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
'use client'

import { useState } from 'react'
import { FileCode, Hash, Zap, Shield, Users, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Issue {
  file?: string
  line?: number
  type?: string
  description: string
  suggestion?: string
  detected_by?: string
  severity?: string
  impact?: string
}

interface IssueCardProps {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [hover, setHover] = useState(false)

  const getSeverityColor = (severity?: string) => {
    const sev = (severity || issue.impact || '').toLowerCase()
    if (sev === 'critical' || sev === 'high') {
      return 'bg-destructive/10 text-destructive border-destructive/20'
    }
    if (sev === 'medium') {
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20'
    }
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20'
  }

  const getTypeColor = (type?: string) => {
    const t = (type || '').toLowerCase()
    if (t === 'security') {
      return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20'
    }
    if (t === 'performance') {
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20'
    }
    if (t === 'architecture') {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20'
    }
    if (t === 'quality') {
      return 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20'
    }
    return 'bg-muted text-muted-foreground border-border'
  }

  return (
    <Card
      className="border transition-all hover:shadow-md"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent className="p-6">
        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {issue.type && (
            <Badge variant="outline" className={getTypeColor(issue.type)}>
              <Zap className="h-3 w-3 mr-1" />
              {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
            </Badge>
          )}
          
          {(issue.severity || issue.impact) && (
            <Badge variant="outline" className={getSeverityColor(issue.severity || issue.impact)}>
              <Shield className="h-3 w-3 mr-1" />
              {((issue.severity || issue.impact) || '').charAt(0).toUpperCase() + ((issue.severity || issue.impact) || '').slice(1)}
            </Badge>
          )}
          
          {issue.line !== null && issue.line !== undefined && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Hash className="h-3 w-3 mr-1" />
              Line {issue.line}
            </Badge>
          )}
          
          {issue.detected_by && (
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20">
              <Users className="h-3 w-3 mr-1" />
              {issue.detected_by.replace('Agent', '').replace('agent', '')}
            </Badge>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-foreground leading-relaxed font-medium">
              {issue.description}
            </p>
          </div>
        </div>

        {/* Suggestion */}
        {issue.suggestion && (
          <Alert className="bg-primary/5 border-primary/20">
            <AlertDescription className="text-foreground">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <div className="font-semibold mb-1 text-sm text-muted-foreground">Suggestion:</div>
                  <div className="text-sm leading-relaxed">{issue.suggestion}</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

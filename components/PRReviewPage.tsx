'use client'

import { useState, memo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GitPullRequest, Loader2, ExternalLink, CheckCircle2, AlertCircle, Info, TrendingUp, Clock, ArrowLeft, Shield, Zap, Building2, Code, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ThemeToggle } from './theme-toggle'
import FileCard from './FileCard'

interface AgentProgress {
  agent: string
  status: string
  progress: number
  message: string
  timestamp: string
}

const PRReviewPage = memo(function PRReviewPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [pr, setPr] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<AgentProgress[]>([])
  const [taskId, setTaskId] = useState<string | null>(null)

  const API = 'https://agent-prm.onrender.com'

  const agentIcons: Record<string, any> = {
    'SecurityAgent': Shield,
    'Security Agent': Shield,
    'PerformanceAgent': Zap,
    'Performance Agent': Zap,
    'ArchitectureAgent': Building2,
    'Architecture Agent': Building2,
    'QualityAgent': Code,
    'Quality Agent': Code,
    'System': Info
  }

  const agentColors: Record<string, string> = {
    'SecurityAgent': 'text-red-500',
    'Security Agent': 'text-red-500',
    'PerformanceAgent': 'text-yellow-500',
    'Performance Agent': 'text-yellow-500',
    'ArchitectureAgent': 'text-blue-500',
    'Architecture Agent': 'text-blue-500',
    'QualityAgent': 'text-green-500',
    'Quality Agent': 'text-green-500',
    'System': 'text-purple-500'
  }

  const validateInputs = () => {
    if (!url.trim()) {
      setError('Please enter a repository URL')
      return false
    }
    if (!pr.trim()) {
      setError('Please enter a PR number')
      return false
    }
    if (isNaN(parseInt(pr))) {
      setError('PR number must be a valid number')
      return false
    }
    if (!url.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL')
      return false
    }
    return true
  }

  const analyze = async () => {
    setError(null)
    
    if (!validateInputs()) {
      return
    }

    setLoading(true)
    setResult(null)
    setProgress([])
    
    try {
      const res = await fetch(`${API}/analyze-pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: url, pr_number: parseInt(pr) })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (!data?.task_id) {
        setError('Failed to start analysis. Please try again.')
        setLoading(false)
        return
      }
      
      setTaskId(data.task_id)
      checkStatus(data.task_id)
    } catch (err) {
      console.error(err)
      setError('Server error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const checkStatus = async (id: string) => {
    let attempts = 0
    const maxAttempts = 60 // 2.5 minutes max (60 * 2.5s) - optimized for speed
    
    const interval = setInterval(async () => {
      attempts++
      
      if (attempts > maxAttempts) {
        clearInterval(interval)
        setError('Analysis timeout. Please try again.')
        setLoading(false)
        return
      }
      
      try {
        const res = await fetch(`${API}/status/${id}`)
        const data = await res.json()
        
        // Update progress
        if (data.progress && Array.isArray(data.progress)) {
          setProgress(data.progress)
        }
        
        if (data.status === 'completed') {
          clearInterval(interval)
          await checkResult(id)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setError(data.error || 'Analysis failed. Please check your repository URL and PR number.')
          setLoading(false)
        }
      } catch (err) {
        console.error('Status check error:', err)
      }
    }, 2500)
  }

  const checkResult = async (id: string) => {
    try {
      const res = await fetch(`${API}/results/${id}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch results')
      }
      
      const data = await res.json()
      const finalResult = data.results || data.result
      
      if (finalResult) {
        setResult(finalResult)
      } else {
        setError('No results found. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Could not fetch results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      analyze()
    }
  }

  const getTotalIssues = () => {
    if (!result?.files) return 0
    return result.files.reduce((total: number, file: any) => 
      total + (file.issues?.length || 0), 0
    )
  }

  const getIssuesByAgent = () => {
    if (!result?.files) return {}
    
    const agentCounts: Record<string, number> = {}
    
    result.files.forEach((file: any) => {
      file.issues?.forEach((issue: any) => {
        const agent = issue.detected_by || 'unknown'
        agentCounts[agent] = (agentCounts[agent] || 0) + 1
      })
    })
    
    return agentCounts
  }

  const getIssuesSeverity = () => {
    if (!result?.files) return { critical: 0, warning: 0, info: 0 }
    
    let critical = 0, warning = 0, info = 0
    
    result.files.forEach((file: any) => {
      file.issues?.forEach((issue: any) => {
        const severity = issue.severity || issue.impact || ''
        if (severity === 'critical' || issue.type?.toLowerCase().includes('security')) {
          critical++
        } else if (severity === 'high' || severity === 'medium' || issue.type?.toLowerCase().includes('performance')) {
          warning++
        } else {
          info++
        }
      })
    })
    
    return { critical, warning, info }
  }

  const getAgentSummary = () => {
    if (!result?.agents) return []
    
    return Object.entries(result.agents).map(([key, value]: [string, any]) => ({
      name: key,
      summary: value.summary || {},
      issues: value.issues || []
    }))
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-4 right-4 z-50 sm:absolute">
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Input Card */}
        <Card className="mb-8 hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <GitPullRequest className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Multiagentic PR Review
                </CardTitle>
                <CardDescription className="mt-1">
                  Powered by specialized AI agents for deep code analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input
                id="repo-url"
                type="text"
                placeholder="https://github.com/user/repo"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Example: https://github.com/facebook/react
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pr-number">PR Number</Label>
              <Input
                id="pr-number"
                type="text"
                placeholder="42"
                value={pr}
                onChange={(e) => {
                  setPr(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                The pull request number from your repository
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Our optimized multiagentic system uses specialized AI agents (Security, Performance, Architecture, Quality) 
                for comprehensive analysis. Optimized for speed - typically completes in 10-20 seconds.
              </AlertDescription>
            </Alert>

            <Button
              onClick={analyze}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Multiagentic Analysis in Progress...' : 'Start Multiagentic Analysis'}
            </Button>
          </CardContent>
        </Card>

        {/* Agent Progress */}
        {loading && progress.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.map((p, idx) => {
                  const Icon = agentIcons[p.agent] || Info
                  const colorClass = agentColors[p.agent] || 'text-gray-500'
                  const isCompleted = p.status === 'completed'
                  const isError = p.status === 'error'
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${colorClass}`} />
                          <span className="font-semibold">{p.agent}</span>
                          {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {isError && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(p.progress * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isError ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ width: `${p.progress * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{p.message}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && progress.length === 0 && (
          <Card className="mb-8">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">Initializing Multiagentic System...</h3>
                  <p className="text-muted-foreground">Starting specialized AI agents for deep analysis</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Summary Stats Card */}
            <Card className="mb-8">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Multiagentic Analysis Summary
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Total Issues</div>
                    <div className="text-2xl sm:text-3xl font-bold">{getTotalIssues()}</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-destructive/50">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Critical</div>
                    <div className="text-2xl sm:text-3xl font-bold text-destructive">{getIssuesSeverity().critical}</div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Warnings</div>
                    <div className="text-2xl sm:text-3xl font-bold">{getIssuesSeverity().warning}</div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Files Analyzed</div>
                    <div className="text-2xl sm:text-3xl font-bold">{result.files?.length || 0}</div>
                  </div>
                </div>

                {/* Agent Breakdown */}
                {result.summary?.total_agents > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-4">Agents Deployed</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getAgentSummary().map((agent) => {
                        const Icon = agentIcons[agent.name] || Code
                        const colorClass = agentColors[agent.name] || 'text-gray-500'
                        const issueCount = agent.summary.total_issues || 0
                        
                        return (
                          <div key={agent.name} className="border rounded-lg p-3 flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${colorClass}`} />
                            <div className="flex-1">
                              <div className="text-xs font-medium">{agent.name.replace('Agent', '')}</div>
                              <div className="text-sm font-bold">{issueCount} issues</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PR Details Card */}
            <Card className="mb-8">
              <CardHeader className="border-b pb-6">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-2xl sm:text-3xl font-bold mb-3">
                      {result.pr_title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="secondary">
                        <Clock className="mr-1.5 h-3 w-3" />
                        {new Date(result.analyzed_at).toLocaleString()}
                      </Badge>
                      {getTotalIssues() === 0 && (
                        <Badge variant="outline" className="border-green-500/50 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          No Issues Found
                        </Badge>
                      )}
                      {result.summary?.total_agents && (
                        <Badge variant="outline">
                          <Users className="mr-1.5 h-3 w-3" />
                          {result.summary.total_agents} Agents
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <a href={result.pr_url} target="_blank" rel="noopener noreferrer">
                    View Pull Request on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardHeader>

              <CardContent className="pt-6">
                {result.files && result.files.length > 0 ? (
                  <div className="space-y-4">
                    {result.files.map((file: any, i: number) => (
                      <FileCard key={i} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">All Clear!</h3>
                    <p className="text-muted-foreground">No files with issues were found in this pull request.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
})

export default PRReviewPage

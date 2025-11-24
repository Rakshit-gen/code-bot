'use client'

import { useState, memo, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { GitPullRequest, Loader2, ExternalLink, CheckCircle2, AlertCircle, Info, TrendingUp, Clock, ArrowLeft, Shield, Zap, Building2, Code, Users, Filter, Search, X, BarChart3, PieChart } from 'lucide-react'
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
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('severity')

  const API = 'https://agent-prm.onrender.com'
  // const API = 'http://localhost:8000'

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

  // Get all unique issue types
  const getAllIssueTypes = () => {
    if (!result?.files) return []
    const types = new Set<string>()
    result.files.forEach((file: any) => {
      file.issues?.forEach((issue: any) => {
        if (issue.type) types.add(issue.type)
      })
    })
    return Array.from(types)
  }

  // Get issues by type
  const getIssuesByType = () => {
    if (!result?.files) return {}
    const typeCounts: Record<string, number> = {}
    result.files.forEach((file: any) => {
      file.issues?.forEach((issue: any) => {
        const type = issue.type || 'unknown'
        typeCounts[type] = (typeCounts[type] || 0) + 1
      })
    })
    return typeCounts
  }

  // Filtered and sorted files
  const filteredFiles = useMemo(() => {
    if (!result?.files) return []
    
    let filtered = [...result.files]
    
    // Filter by agent
    if (filterAgent !== 'all') {
      filtered = filtered.map((file: any) => ({
        ...file,
        issues: file.issues?.filter((issue: any) => 
          issue.detected_by === filterAgent
        ) || []
      })).filter((file: any) => file.issues.length > 0)
    }
    
    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered.map((file: any) => ({
        ...file,
        issues: file.issues?.filter((issue: any) => {
          const severity = issue.severity || issue.impact || ''
          return severity.toLowerCase() === filterSeverity.toLowerCase()
        }) || []
      })).filter((file: any) => file.issues.length > 0)
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.map((file: any) => ({
        ...file,
        issues: file.issues?.filter((issue: any) => 
          issue.type?.toLowerCase() === filterType.toLowerCase()
        ) || []
      })).filter((file: any) => file.issues.length > 0)
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.map((file: any) => ({
        ...file,
        issues: file.issues?.filter((issue: any) => 
          issue.description?.toLowerCase().includes(query) ||
          issue.suggestion?.toLowerCase().includes(query) ||
          file.name.toLowerCase().includes(query)
        ) || []
      })).filter((file: any) => file.issues.length > 0)
    }
    
    // Sort files
    filtered.sort((a: any, b: any) => {
      if (sortBy === 'severity') {
        const getMaxSeverity = (file: any) => {
          const severities = file.issues?.map((i: any) => {
            const s = i.severity || i.impact || ''
            if (s === 'critical') return 4
            if (s === 'high') return 3
            if (s === 'medium') return 2
            return 1
          }) || []
          return Math.max(...severities, 0)
        }
        return getMaxSeverity(b) - getMaxSeverity(a)
      } else if (sortBy === 'count') {
        return (b.issues?.length || 0) - (a.issues?.length || 0)
      }
      return a.name.localeCompare(b.name)
    })
    
    return filtered
  }, [result, filterAgent, filterSeverity, filterType, searchQuery, sortBy])

  // Calculate statistics for visualization
  const getStatistics = () => {
    const stats = {
      total: getTotalIssues(),
      critical: getIssuesSeverity().critical,
      warning: getIssuesSeverity().warning,
      info: getIssuesSeverity().info,
      byAgent: getIssuesByAgent(),
      byType: getIssuesByType()
    }
    return stats
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
            {/* Enhanced Summary Stats Card */}
            <Card className="mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Analysis Dashboard
                  </h3>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a href={result.pr_url} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-lg p-4 bg-card border-border hover:bg-accent/50 transition-colors">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Total Issues</div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{getTotalIssues()}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Across {result.files?.length || 0} files
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card border-destructive/30 hover:bg-destructive/5 transition-colors">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Critical</div>
                    <div className="text-2xl sm:text-3xl font-bold text-destructive">
                      {getIssuesSeverity().critical}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getTotalIssues() > 0 
                        ? Math.round((getIssuesSeverity().critical / getTotalIssues()) * 100) 
                        : 0}% of total
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card border-border hover:bg-accent/50 transition-colors">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Warnings</div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {getIssuesSeverity().warning}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getTotalIssues() > 0 
                        ? Math.round((getIssuesSeverity().warning / getTotalIssues()) * 100) 
                        : 0}% of total
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card border-border hover:bg-accent/50 transition-colors">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Info</div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {getIssuesSeverity().info}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getTotalIssues() > 0 
                        ? Math.round((getIssuesSeverity().info / getTotalIssues()) * 100) 
                        : 0}% of total
                    </div>
                  </div>
                </div>

                {/* Severity Distribution Bar */}
                {getTotalIssues() > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Severity Distribution</span>
                      <span className="text-xs text-muted-foreground">
                        {getIssuesSeverity().critical + getIssuesSeverity().warning + getIssuesSeverity().info} issues
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                      {getIssuesSeverity().critical > 0 && (
                        <div 
                          className="bg-red-500 h-full transition-all"
                          style={{ width: `${(getIssuesSeverity().critical / getTotalIssues()) * 100}%` }}
                          title={`Critical: ${getIssuesSeverity().critical}`}
                        />
                      )}
                      {getIssuesSeverity().warning > 0 && (
                        <div 
                          className="bg-yellow-500 h-full transition-all"
                          style={{ width: `${(getIssuesSeverity().warning / getTotalIssues()) * 100}%` }}
                          title={`Warnings: ${getIssuesSeverity().warning}`}
                        />
                      )}
                      {getIssuesSeverity().info > 0 && (
                        <div 
                          className="bg-blue-500 h-full transition-all"
                          style={{ width: `${(getIssuesSeverity().info / getTotalIssues()) * 100}%` }}
                          title={`Info: ${getIssuesSeverity().info}`}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Agent Performance */}
                {result.summary?.total_agents > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Agent Performance
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getAgentSummary().map((agent) => {
                        const Icon = agentIcons[agent.name] || Code
                        const colorClass = agentColors[agent.name] || 'text-gray-500'
                        const issueCount = agent.summary.total_issues || 0
                        const critical = agent.summary.critical || agent.summary.high_severity || agent.summary.high_impact || 0
                        
                        return (
                          <div 
                            key={agent.name} 
                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                              filterAgent === agent.name ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setFilterAgent(filterAgent === agent.name ? 'all' : agent.name)}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={`h-5 w-5 ${colorClass}`} />
                              <div className="flex-1">
                                <div className="text-sm font-semibold">{agent.name.replace('Agent', '').replace('agent', '')}</div>
                                <div className="text-xs text-muted-foreground">
                                  {critical > 0 && (
                                    <span className="text-red-500 font-bold">{critical} critical</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold">{issueCount}</div>
                            <div className="text-xs text-muted-foreground">issues found</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Issue Types Breakdown */}
                {Object.keys(getIssuesByType()).length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Issues by Type
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(getIssuesByType()).map(([type, count]) => (
                        <div
                          key={type}
                          className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                            filterType === type ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setFilterType(filterType === type ? 'all' : type)}
                        >
                          <div className="text-sm font-medium capitalize">{type}</div>
                          <div className="text-lg font-bold">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <Card className="mb-8">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {/* Search */}
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search issues, files, descriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={filterAgent}
                      onChange={(e) => setFilterAgent(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="all">All Agents</option>
                      {getAgentSummary().map((agent) => (
                        <option key={agent.name} value={agent.name}>
                          {agent.name.replace('Agent', '').replace('agent', '')}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="all">All Types</option>
                      {getAllIssueTypes().map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="severity">Sort by Severity</option>
                      <option value="count">Sort by Count</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {(filterAgent !== 'all' || filterSeverity !== 'all' || filterType !== 'all' || searchQuery) && (
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {filterAgent !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Agent: {filterAgent.replace('Agent', '').replace('agent', '')}
                        <button onClick={() => setFilterAgent('all')}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {filterSeverity !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Severity: {filterSeverity}
                        <button onClick={() => setFilterSeverity('all')}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {filterType !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Type: {filterType}
                        <button onClick={() => setFilterType('all')}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery('')}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterAgent('all')
                        setFilterSeverity('all')
                        setFilterType('all')
                        setSearchQuery('')
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Results count */}
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredFiles.reduce((sum: number, f: any) => sum + (f.issues?.length || 0), 0)} issues 
                  in {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
                  {filteredFiles.length !== (result.files?.length || 0) && (
                    <span> (filtered from {result.files?.length || 0} total files)</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PR Header */}
            <Card className="mb-8">
              <CardHeader className="border-b pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      <CardTitle className="text-2xl sm:text-3xl font-bold">
                        {result.pr_title}
                      </CardTitle>
                    </div>
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
                      <Badge variant="outline">
                        <Code className="mr-1.5 h-3 w-3" />
                        {result.files?.length || 0} Files
                      </Badge>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a href={result.pr_url} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Filtered Files */}
            {filteredFiles.length > 0 ? (
              <div className="space-y-4">
                {filteredFiles.map((file: any, i: number) => (
                  <FileCard key={i} file={file} />
                ))}
              </div>
            ) : result.files && result.files.length > 0 ? (
              <Card className="mb-8">
                <CardContent className="p-12 text-center">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No issues match your filters</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterAgent('all')
                      setFilterSeverity('all')
                      setFilterType('all')
                      setSearchQuery('')
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">No files with issues were found in this pull request.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
})

export default PRReviewPage

'use client'

import { useState } from 'react'
import { Sparkles, GitPullRequest, Loader2, ExternalLink, CheckCircle2, AlertCircle, Info, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Background from './Background'
import FloatingOrbs from './FloatingOrbs'
import FileCard from './FileCard'

interface PRReviewPageProps {
  onBack: () => void
}

export default function PRReviewPage({ onBack }: PRReviewPageProps) {
  const [url, setUrl] = useState('')
  const [pr, setPr] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardHover, setCardHover] = useState(false)

  const API = 'https://agent-prm.onrender.com'

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
      
      checkStatus(data.task_id)
    } catch (err) {
      console.error(err)
      setError('Server error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const checkStatus = async (id: string) => {
    let attempts = 0
    const maxAttempts = 120 // 5 minutes max (120 * 2.5s)
    
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
        
        if (data.status === 'completed') {
          clearInterval(interval)
          await checkResult(id)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setError('Analysis failed. Please check your repository URL and PR number.')
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

  const getIssuesSeverity = () => {
    if (!result?.files) return { critical: 0, warning: 0, info: 0 }
    
    let critical = 0, warning = 0, info = 0
    
    result.files.forEach((file: any) => {
      file.issues?.forEach((issue: any) => {
        if (issue.type?.toLowerCase().includes('security') || 
            issue.type?.toLowerCase().includes('critical')) {
          critical++
        } else if (issue.type?.toLowerCase().includes('warning') ||
                   issue.type?.toLowerCase().includes('performance')) {
          warning++
        } else {
          info++
        }
      })
    })
    
    return { critical, warning, info }
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans relative">
      <Background />
      <FloatingOrbs />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-8 bg-slate-800/80 border-slate-700/20 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl px-6 py-3 transition-all duration-300"
        >
          ← Back to Home
        </Button>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 flex-wrap">
            <Sparkles className="text-blue-400 animate-pulse" size={42} strokeWidth={2.5} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
              Analyze Pull Request
            </h1>
            <Sparkles className="text-purple-400 animate-pulse" size={42} strokeWidth={2.5} />
          </div>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Enter your repository details to get instant AI-powered feedback on code quality, security, and performance
          </p>
        </div>

        {/* Input Card */}
        <Card
          className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-400 mb-12"
          onMouseEnter={() => setCardHover(true)}
          onMouseLeave={() => setCardHover(false)}
        >
          <CardHeader>
            <div className="flex items-center gap-5 mb-2">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <GitPullRequest size={32} className="text-blue-400" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
                  Repository Details
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Provide your GitHub repository and PR number
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-7">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-300 rounded-2xl">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="repo-url" className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                Repository URL
              </Label>
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
                className="bg-black/50 border-slate-700/20 text-white text-lg font-medium rounded-2xl px-6 py-6 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                disabled={loading}
              />
              <p className="text-slate-500 text-sm mt-2 ml-1">
                Example: https://github.com/facebook/react
              </p>
            </div>

            <div>
              <Label htmlFor="pr-number" className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                PR Number
              </Label>
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
                className="bg-black/50 border-slate-700/20 text-white text-lg font-medium rounded-2xl px-6 py-6 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                disabled={loading}
              />
              <p className="text-slate-500 text-sm mt-2 ml-1">
                The pull request number from your repository
              </p>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-300 rounded-2xl">
              <Info className="h-5 w-5" />
              <AlertDescription className="text-sm">
                Make sure the repository is public or you have access to it. The analysis typically takes 30-60 seconds.
              </AlertDescription>
            </Alert>

            <Button
              onClick={analyze}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-2xl px-3 py-3 shadow-[0_10px_40px_-5px_rgba(59,130,246,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_20px_50px_-5px_rgba(59,130,246,0.7),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed h-auto"
            >
              {loading && <Loader2 className="mr-3 animate-spin" size={24} strokeWidth={2.5} />}
              {loading ? 'Analyzing PR...' : 'Analyze Pull Request'}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] mb-12">
            <CardContent className="p-12">
              <div className="flex items-center gap-6 mb-8">
                <Loader2 className="text-blue-400 animate-spin" size={36} strokeWidth={2.5} />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Processing Pull Request...</h3>
                  <p className="text-slate-400">This may take up to a minute. Please wait.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-5 bg-gradient-to-r from-slate-700/30 via-slate-700/50 to-slate-700/30 bg-[length:200%_100%] animate-shimmer rounded-lg" />
                <div className="h-5 bg-gradient-to-r from-slate-700/30 via-slate-700/50 to-slate-700/30 bg-[length:200%_100%] animate-shimmer rounded-lg" />
                <div className="h-5 w-3/4 bg-gradient-to-r from-slate-700/30 via-slate-700/50 to-slate-700/30 bg-[length:200%_100%] animate-shimmer rounded-lg" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Summary Stats Card */}
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="text-blue-400" size={28} strokeWidth={2.5} />
                  Analysis Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                    <div className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">Total Issues</div>
                    <div className="text-4xl font-black text-white">{getTotalIssues()}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-2xl p-6">
                    <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">Critical</div>
                    <div className="text-4xl font-black text-white">{getIssuesSeverity().critical}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl p-6">
                    <div className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">Warnings</div>
                    <div className="text-4xl font-black text-white">{getIssuesSeverity().warning}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
                    <div className="text-green-400 text-sm font-bold uppercase tracking-wider mb-2">Files Analyzed</div>
                    <div className="text-4xl font-black text-white">{result.files?.length || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PR Details Card */}
            <Card className="bg-gradient-to-br from-slate-900/98 to-slate-800/90 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(148,163,184,0.1)] mb-8">
              <CardHeader className="border-b border-slate-700/10 pb-8">
                <div className="flex items-start gap-5 mb-4">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={36} strokeWidth={2.5} />
                  <div className="flex-1">
                    <CardTitle className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent leading-tight mb-3">
                      {result.pr_title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                        <Clock size={14} className="mr-1.5" />
                        {new Date(result.analyzed_at).toLocaleString()}
                      </Badge>
                      {getTotalIssues() === 0 && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                          <CheckCircle2 size={14} className="mr-1.5" />
                          No Issues Found
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-fit bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 rounded-xl px-6 py-3 transition-all duration-300"
                >
                  <a href={result.pr_url} target="_blank" rel="noopener noreferrer">
                    View Pull Request on GitHub
                    <ExternalLink className="ml-2" size={18} strokeWidth={2.5} />
                  </a>
                </Button>
              </CardHeader>

              <CardContent className="pt-8">
                {result.files && result.files.length > 0 ? (
                  result.files.map((file: any, i: number) => (
                    <FileCard key={i} file={file} />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <CheckCircle2 size={64} className="text-green-400 mx-auto mb-4" strokeWidth={2} />
                    <h3 className="text-2xl font-bold text-white mb-2">All Clear!</h3>
                    <p className="text-slate-400 text-lg">No files with issues were found in this pull request.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
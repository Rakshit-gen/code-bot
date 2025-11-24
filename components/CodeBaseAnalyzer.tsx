'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Code, ArrowLeft, Loader2, Info, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from './theme-toggle'

interface AnalysisResult {
  success: boolean
  repository: string
  analysis_type: string
  analysis: string
  files_analyzed: number
  stars: number
  language?: string
}

// Component to render formatted analysis text
function FormattedAnalysis({ text }: { text: string }) {
  // Split text into sections
  const sanitizedText = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
  const lines = sanitizedText.split('\n')
  const sections: { title: string; content: string[] }[] = []
  let currentSection: { title: string; content: string[] } | null = null

  lines.forEach(line => {
    // Check if it's a header (lines with === or ### or **)
    if (line.includes('===') || line.startsWith('###') || line.startsWith('##')) {
      if (currentSection) sections.push(currentSection)
      const title = line.replace(/[=#*]/g, '').trim()
      currentSection = { title, content: [] }
    } else if (line.startsWith('* **') || line.startsWith('**')) {
      // Bold headers
      if (currentSection) {
        currentSection.content.push(line)
      }
    } else if (line.trim()) {
      if (!currentSection) {
        currentSection = { title: 'Overview', content: [] }
      }
      currentSection.content.push(line)
    }
  })
  
  if (currentSection) sections.push(currentSection)

  return (
    <div className="space-y-8">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <h3 className="text-2xl font-bold text-white">
              {section.title}
            </h3>
          </div>

          {/* Section Content */}
          <div className="space-y-3 pl-4">
            {section.content.map((line, lineIdx) => {
              // Check if it's a bullet point
              if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                const content = line.replace(/^[*-]\s*/, '').trim()
                const isBold = content.startsWith('**')
                const cleanContent = content.replace(/\*\*/g, '')
                
                // Check if it's a numbered list item
                const hasColon = cleanContent.includes(':')
                const [label, ...rest] = cleanContent.split(':')
                
                return (
                  <div key={lineIdx} className="flex gap-3 items-start group">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:bg-purple-300 transition-colors flex-shrink-0" />
                    <div className="flex-1">
                      {hasColon && isBold ? (
                        <>
                          <span className="font-bold text-purple-300">{label}:</span>
                          <span className="text-slate-300"> {rest.join(':')}</span>
                        </>
                      ) : (
                        <span className={isBold ? 'font-semibold text-slate-200' : 'text-slate-300'}>
                          {cleanContent}
                        </span>
                      )}
                    </div>
                  </div>
                )
              }
              
              // Code blocks
              if (line.trim().startsWith('```')) {
                return null // Skip code fence markers
              }
              
              // Regular paragraphs
              if (line.trim()) {
                const isBold = line.includes('**')
                const cleanLine = line.replace(/\*\*/g, '')
                
                return (
                  <p key={lineIdx} className={`leading-relaxed ${isBold ? 'font-semibold text-slate-200' : 'text-slate-300'}`}>
                    {cleanLine}
                  </p>
                )
              }
              
              return null
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const CodebaseAnalyzerPage = memo(function CodebaseAnalyzerPage() {
  const router = useRouter()
  const [repository, setRepository] = useState('')
  const [analysisType, setAnalysisType] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const API_URL = 'https://agent-code-manage.onrender.com'

  const analysisTypes = [
    { value: 'general', label: 'General', desc: 'Comprehensive overview' },
    { value: 'security', label: 'Security', desc: 'Find vulnerabilities' },
    { value: 'architecture', label: 'Architecture', desc: 'Design patterns' },
    { value: 'quality', label: 'Quality', desc: 'Best practices' },
    { value: 'performance', label: 'Performance', desc: 'Optimization tips' }
  ]

  const handleAnalyze = async () => {
    if (!repository.trim()) {
      setError('Please enter a repository name')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository: repository.trim(),
          type: analysisType
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data)
      } else {
        setError(data.detail || data.error || 'Analysis failed')
      }
    } catch (err: any) {
      setError(`Failed to connect: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-4 right-4 z-50 sm:absolute">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Main Card */}
        <Card className="mb-8 hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Codebase Analyzer
                </CardTitle>
                <CardDescription className="mt-1">
                  AI-powered repository analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Repository Input */}
            <div className="space-y-2">
              <Label htmlFor="repository">Repository</Label>
              <Input
                id="repository"
                value={repository}
                onChange={(e) => {
                  setRepository(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                placeholder="e.g., facebook/react or https://github.com/facebook/react"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Enter repository as owner/repo or full GitHub URL
              </p>
            </div>

            {/* Analysis Type Selection */}
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {analysisTypes.map(({ value, label, desc }) => {
                  const isSelected = analysisType === value

                  return (
                    <button
                      key={value}
                      onClick={() => setAnalysisType(value)}
                      disabled={loading}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`font-semibold text-sm mb-1 ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}>
                        {label}
                      </div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Codebase...
                </>
              ) : (
                'Analyze Codebase'
              )}
            </Button>

            {/* Info Alert */}
            {!result && !error && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Analysis typically takes 45-60 seconds depending on repository size
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Display */}
        {result && (
          <Card className="mt-8">
            <CardHeader className="border-b pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold mb-3">
                    Analysis Results
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="secondary">{result.repository}</Badge>
                    <Badge variant="secondary">{result.files_analyzed} files</Badge>
                    <Badge variant="secondary">{result.stars} stars</Badge>
                    {result.language && (
                      <Badge>{result.language}</Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm font-semibold">
                  {result.analysis_type.charAt(0).toUpperCase() + result.analysis_type.slice(1)} Analysis
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 pb-8">
              <FormattedAnalysis text={result.analysis} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
})

export default CodebaseAnalyzerPage
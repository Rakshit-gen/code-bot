'use client'

import { useState } from 'react'
import { Code, Search, Shield, Zap, GitBranch, ArrowLeft, Loader2, FileCode, TrendingUp, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Background from './Background'
import FloatingOrbs from './FloatingOrbs'

interface CodebaseAnalyzerPageProps {
  onBack: () => void
}

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

export default function CodebaseAnalyzerPage({ onBack }: CodebaseAnalyzerPageProps) {
  const [repository, setRepository] = useState('')
  const [analysisType, setAnalysisType] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const API_URL = 'https://agent-code-manage.onrender.com' // Replace with your actual URL

  const analysisTypes = [
    { value: 'general', label: 'General Analysis', icon: Search, color: 'from-purple-500 to-purple-600', desc: 'Comprehensive overview' },
    { value: 'security', label: 'Security Audit', icon: Shield, color: 'from-red-500 to-red-600', desc: 'Find vulnerabilities' },
    { value: 'architecture', label: 'Architecture', icon: GitBranch, color: 'from-blue-500 to-blue-600', desc: 'Design patterns' },
    { value: 'quality', label: 'Code Quality', icon: FileCode, color: 'from-green-500 to-green-600', desc: 'Best practices' },
    { value: 'performance', label: 'Performance', icon: Zap, color: 'from-yellow-500 to-yellow-600', desc: 'Optimization tips' }
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
    <div className="min-h-screen text-white p-8 font-sans relative">
      <Background />
      <FloatingOrbs />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-8 bg-slate-800/80 border-slate-700/20 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl px-6 py-3 transition-all duration-300"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Button>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border-slate-700/10 rounded-3xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)] mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl border border-purple-500/40 shadow-[0_0_40px_rgba(147,51,234,0.3)]">
                <Code size={40} className="text-purple-400" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
                  Codebase Analyzer
                </CardTitle>
                <CardDescription className="text-slate-400 text-lg mt-1">
                  AI-powered repository analysis with Groq
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Repository Input */}
            <div>
              <Label htmlFor="repository" className="text-slate-300 font-semibold text-base mb-2 block">
                Repository
              </Label>
              <Input
                id="repository"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., facebook/react or https://github.com/facebook/react"
                disabled={loading}
                className="bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 text-base"
              />
              <p className="text-slate-500 text-sm mt-2">
                Enter repository as owner/repo or full GitHub URL
              </p>
            </div>

            {/* Analysis Type Selection */}
            <div>
              <Label className="text-slate-300 font-semibold text-base mb-3 block">
                Analysis Type
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {analysisTypes.map(({ value, label, icon: Icon, color, desc }) => {
                  const isSelected = analysisType === value
                  const borderColorClass = isSelected 
                    ? color === 'from-purple-500 to-purple-600' ? 'border-purple-500' 
                    : color === 'from-red-500 to-red-600' ? 'border-red-500'
                    : color === 'from-blue-500 to-blue-600' ? 'border-blue-500'
                    : color === 'from-green-500 to-green-600' ? 'border-green-500'
                    : 'border-yellow-500'
                    : 'border-slate-700/30'
                  
                  const iconColorClass = isSelected
                    ? color === 'from-purple-500 to-purple-600' ? 'text-purple-400' 
                    : color === 'from-red-500 to-red-600' ? 'text-red-400'
                    : color === 'from-blue-500 to-blue-600' ? 'text-blue-400'
                    : color === 'from-green-500 to-green-600' ? 'text-green-400'
                    : 'text-yellow-400'
                    : 'text-slate-400'

                  return (
                    <button
                      key={value}
                      onClick={() => setAnalysisType(value)}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all bg-slate-900/40 hover:bg-slate-800/60 ${borderColorClass} ${
                        isSelected ? 'shadow-lg scale-105' : 'hover:border-slate-600/50'
                      }`}
                    >
                      <Icon 
                        size={24} 
                        className={iconColorClass}
                        strokeWidth={2.5}
                      />
                      <div className={`font-semibold text-sm mt-2 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}>
                        {label}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-[0_10px_40px_-5px_rgba(147,51,234,0.5)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Analyzing Codebase...
                </>
              ) : (
                <>
                  <Search className="mr-2" size={20} />
                  Analyze Codebase
                </>
              )}
            </Button>

            {/* Info Alert */}
            {!result && !error && (
              <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                <Info className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  💡 Analysis typically takes 45-60 seconds depending on repository size
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/30 text-red-300 mb-8">
            <Shield className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Some Error Occurred, Please try again later</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {result && (
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border-slate-700/10 rounded-3xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)]">
            <CardHeader className="border-b border-slate-700/50 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-3">
                    Analysis Results
                  </CardTitle>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700/50 px-3 py-1">
                      <GitBranch size={14} className="mr-2" />
                      {result.repository}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700/50 px-3 py-1">
                      <FileCode size={14} className="mr-2" />
                      {result.files_analyzed} files
                    </Badge>
                    <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700/50 px-3 py-1">
                      <TrendingUp size={14} className="mr-2" />
                      {result.stars} stars
                    </Badge>
                    {result.language && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-3 py-1">
                        {result.language}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm font-semibold">
                  {result.analysis_type.charAt(0).toUpperCase() + result.analysis_type.slice(1)} Analysis
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-12">
              <FormattedAnalysis text={result.analysis} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Code2, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import IssueCard from './IssueCard'

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

interface FileData {
  name: string
  issues?: Issue[]
  agent_breakdown?: Record<string, number>
  code_content?: string
}

interface FileCardProps {
  file: FileData
}

export default function FileCard({ file }: FileCardProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    if (file.code_content) {
      navigator.clipboard.writeText(file.code_content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatCode = (code: string) => {
    if (!code) return ''
    return code
  }

  const formatCodeWithLines = (code: string) => {
    if (!code) return []
    const lines = code.split('\n')
    return lines.map((line, idx) => ({
      number: idx + 1,
      content: line,
      isAdded: line.startsWith('+') && !line.startsWith('+++'),
      isRemoved: line.startsWith('-') && !line.startsWith('---'),
      isContext: line.startsWith('@@') || line.startsWith('diff') || line.startsWith('index')
    }))
  }

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const langMap: Record<string, string> = {
      'py': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'sh': 'bash',
      'yaml': 'yaml',
      'yml': 'yaml',
      'json': 'json',
      'xml': 'xml',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown'
    }
    return langMap[ext || ''] || 'text'
  }

  return (
    <Card className="mb-6 border hover:shadow-lg transition-all">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {file.name}
              </CardTitle>
              {file.issues && file.issues.length > 0 && (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="destructive" className="text-xs">
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    {file.issues.length} {file.issues.length === 1 ? 'Issue' : 'Issues'}
                  </Badge>
                  {file.agent_breakdown && Object.keys(file.agent_breakdown).length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(file.agent_breakdown).map(([agent, count]) => (
                        <Badge key={agent} variant="outline" className="text-xs">
                          {agent.replace('Agent', '').replace('agent', '')}: {count}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {file.code_content && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              className="flex-shrink-0"
            >
              {showCode ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Code
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show Code
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Code Content */}
        {showCode && file.code_content && (
          <div className="mb-6 border rounded-lg overflow-hidden bg-muted/50">
            <div className="flex items-center justify-between p-2 border-b bg-muted">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {getLanguageFromFilename(file.name).toUpperCase()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 px-2"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <div className="relative">
                <table className="w-full border-collapse">
                  <tbody>
                    {formatCodeWithLines(file.code_content).map((line) => (
                      <tr
                        key={line.number}
                        className={`font-mono text-sm ${
                          line.isAdded
                            ? 'bg-green-500/10 dark:bg-green-500/5'
                            : line.isRemoved
                            ? 'bg-red-500/10 dark:bg-red-500/5'
                            : line.isContext
                            ? 'bg-blue-500/10 dark:bg-blue-500/5'
                            : 'bg-transparent'
                        } hover:bg-muted/50 transition-colors`}
                      >
                        <td className="px-4 py-1 text-right text-muted-foreground select-none border-r border-border sticky left-0 bg-inherit">
                          {line.number}
                        </td>
                        <td className={`px-4 py-1 text-foreground ${
                          line.isAdded ? 'text-green-600 dark:text-green-400' :
                          line.isRemoved ? 'text-red-600 dark:text-red-400' :
                          line.isContext ? 'text-blue-600 dark:text-blue-400 font-semibold' :
                          ''
                        }`}>
                          {line.content || '\u00A0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Issues */}
        {file.issues && file.issues.length > 0 ? (
          <div className="space-y-4">
            {file.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <p className="text-muted-foreground">No issues found in this file</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

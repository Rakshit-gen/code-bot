'use client'

import { useState } from 'react'
import { Code2, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import IssueCard from './IssueCard'

interface Issue {
  file?: string
  line?: number
  type?: string
  description: string
  suggestion?: string
}

interface FileData {
  name: string
  issues?: Issue[]
}

interface FileCardProps {
  file: FileData
}

export default function FileCard({ file }: FileCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <Card
      className="bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur-xl border border-slate-700/10 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300 mb-8"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardHeader className="border-b border-slate-700/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Code2 size={24} className="text-blue-400" strokeWidth={2.5} />
          </div>
          
          <CardTitle className="text-2xl font-bold text-white flex-1">
            {file.name}
          </CardTitle>
          
          {file.issues && file.issues.length > 0 && (
            <Badge className="bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 px-4 py-2 text-sm font-extrabold">
              <ShieldAlert size={16} strokeWidth={2.5} className="mr-2" />
              {file.issues.length} {file.issues.length === 1 ? 'Issue' : 'Issues'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        {file.issues && file.issues.length > 0 ? (
          file.issues.map((issue, i) => <IssueCard key={i} issue={issue} />)
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" strokeWidth={2} />
            <p className="text-slate-500 text-lg italic">No issues found in this file</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
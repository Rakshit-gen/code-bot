// page.tsx
'use client'

import { useState } from 'react'
import Homepage from '@/components/HomePage'
import PRReviewPage from '@/components/PRReviewPage'
import CodebaseAnalyzerPage from '@/components/CodeBaseAnalyzer'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'review' | 'codebase'>('home')

  return (
    <>
      {currentPage === 'home' && (
        <Homepage 
          onNavigateToPR={() => setCurrentPage('review')}
          onNavigateToCodebase={() => setCurrentPage('codebase')}
        />
      )}
      {currentPage === 'review' && (
        <PRReviewPage onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'codebase' && (
        <CodebaseAnalyzerPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  )
}
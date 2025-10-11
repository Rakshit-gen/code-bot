'use client'

import { useEffect, useState } from 'react'
import Homepage from '@/components/HomePage'
import PRReviewPage from '@/components/PRReviewPage'
import CodebaseAnalyzerPage from '@/components/CodeBaseAnalyzer'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'review' | 'codebase'>('home')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
      setIsMobile(true)
    }
  }, [])

  if (isMobile) {
    return (
      <div
        style={{
          background: 'black',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          flexDirection: 'column',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Can’t use on mobile</h1>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#ccc' }}>
          Please open this app on a desktop browser.
        </p>
      </div>
    )
  }

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

'use client'

import { useState } from 'react'
import Homepage from '@/components/HomePage'
import PRReviewPage from '@/components/PRReviewPage'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'review'>('home')

  return (
    <>
      {currentPage === 'home' && (
        <Homepage onNavigate={() => setCurrentPage('review')} />
      )}
      {currentPage === 'review' && (
        <PRReviewPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  )
}
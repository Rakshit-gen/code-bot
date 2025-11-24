'use client'

import { useEffect, useState } from 'react'
import PRReviewPage from '@/components/PRReviewPage'
import { useRouter } from 'next/navigation'

export default function ReviewPage() {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
      setIsMobile(true)
    }
  }, [])

  if (isMobile) {
    return (
      <div className="bg-background text-foreground flex justify-center items-center h-screen text-center flex-col p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
          Can&apos;t use on mobile :(
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md">
          Aegis requires a desktop environment for optimal performance. 
          The AI agents perform large-scale code analysis and render complex 
          developer interfaces that aren&apos;t supported on mobile devices. 
          Please open this app on a desktop browser.
        </p>
      </div>
    )
  }

  return <PRReviewPage onBack={() => router.push('/')} />
}


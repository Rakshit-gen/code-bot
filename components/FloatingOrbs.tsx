import { memo } from 'react'

const FloatingOrbs = memo(function FloatingOrbs() {
  return (
    <>
      <div className="fixed top-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-radial from-blue-500/15 to-transparent blur-[80px] animate-float pointer-events-none z-0 will-change-transform" 
        style={{ transform: 'translateZ(0)' }}
      />
      <div 
        className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-radial from-purple-500/12 to-transparent blur-[100px] animate-float pointer-events-none z-0 will-change-transform"
        style={{ animationDelay: '2s', transform: 'translateZ(0)' }}
      />
    </>
  )
})

export default FloatingOrbs

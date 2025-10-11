export default function FloatingOrbs() {
  return (
    <>
      <div className="fixed top-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-radial from-blue-500/15 to-transparent blur-[80px] animate-float pointer-events-none z-0" />
      <div 
        className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-radial from-purple-500/12 to-transparent blur-[100px] animate-float pointer-events-none z-0"
        style={{ animationDelay: '2s' }}
      />
    </>
  )
}

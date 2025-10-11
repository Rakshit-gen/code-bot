export default function Background() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-radial from-slate-900 via-black to-black -z-20" />
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </>
  )
}
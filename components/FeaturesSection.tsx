import { Shield, Zap, Code2 } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Security Analysis',
      description: 'Detects potential security vulnerabilities and suggests fixes before they reach production',
      color: '#ef4444'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Identifies performance bottlenecks and recommends optimizations for faster code',
      color: '#f59e0b'
    },
    {
      icon: Code2,
      title: 'Code Quality',
      description: 'Ensures best practices, clean code principles, and maintainable architecture',
      color: '#3b82f6'
    }
  ]
  
  return (
    <div className="mb-24">
      <h2 className="text-5xl font-semibold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent text-center mb-16">
        Powerful Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </div>
  )
}
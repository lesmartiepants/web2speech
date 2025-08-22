import { Volume2, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="glass-morphism sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 bg-gradient-to-br from-primary-400 via-accent-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl group hover:scale-110 transition-transform duration-300">
              <Volume2 className="w-7 h-7 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-accent-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Web2Speech</h1>
              <p className="text-sm text-gray-300 hidden sm:block font-medium">AI-Powered Text-to-Speech Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 glass-morphism rounded-full">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-white">AI Ready</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-xs text-gray-400">
              <span>v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
import { } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Web2Speech</h1>
              <p className="text-xs text-gray-400 hidden sm:block font-medium">AI-Powered Text-to-Speech</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs text-gray-400">
            <span>PWA</span>
            <span>•</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </header>
  )
}
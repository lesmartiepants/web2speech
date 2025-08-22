import { Download, Eye, Music, BookOpen, Zap } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ProcessModeSelection() {
  const { processMode, setProcessMode, extractedContent } = useAppStore()
  const hasContent = extractedContent.trim().length > 0
  
  if (!hasContent) {
    return null
  }
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Processing Mode</h3>
          <p className="text-gray-300 text-sm">Choose how you want to experience your content</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setProcessMode('generate')}
          className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden ${
            processMode === 'generate'
              ? 'border-accent-400/50 bg-accent-500/10 shadow-xl scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:border-accent-400/30 hover:bg-accent-500/5 hover:scale-[1.01]'
          }`}
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-400/5 to-accent-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                processMode === 'generate' 
                  ? 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg' 
                  : 'bg-white/10 group-hover:bg-accent-500/20'
              }`}>
                <Download className={`w-6 h-6 ${
                  processMode === 'generate' ? 'text-white' : 'text-gray-400 group-hover:text-accent-300'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`text-xl font-bold mb-2 ${
                  processMode === 'generate' ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  Generate & Download
                </h4>
                <p className={`text-sm leading-relaxed ${
                  processMode === 'generate' ? 'text-accent-100' : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  Create high-quality audio files powered by AI and download them for offline listening
                </p>
                <div className="flex items-center space-x-3 mt-4">
                  <span className="flex items-center space-x-1 text-xs px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full border border-blue-400/30 font-medium">
                    <Music className="w-3 h-3" />
                    <span>MP3</span>
                  </span>
                  <span className="flex items-center space-x-1 text-xs px-3 py-1 bg-green-500/20 text-green-200 rounded-full border border-green-400/30 font-medium">
                    <Download className="w-3 h-3" />
                    <span>Offline</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {processMode === 'generate' && (
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
        
        <button
          onClick={() => setProcessMode('stream')}
          className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden ${
            processMode === 'stream'
              ? 'border-primary-400/50 bg-primary-500/10 shadow-xl scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:border-primary-400/30 hover:bg-primary-500/5 hover:scale-[1.01]'
          }`}
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-400/5 to-primary-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                processMode === 'stream' 
                  ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg' 
                  : 'bg-white/10 group-hover:bg-primary-500/20'
              }`}>
                <Eye className={`w-6 h-6 ${
                  processMode === 'stream' ? 'text-white' : 'text-gray-400 group-hover:text-primary-300'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`text-xl font-bold mb-2 ${
                  processMode === 'stream' ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  Read & Listen
                </h4>
                <p className={`text-sm leading-relaxed ${
                  processMode === 'stream' ? 'text-primary-100' : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  Immersive reader view with real-time synchronized audio playback and word highlighting
                </p>
                <div className="flex items-center space-x-3 mt-4">
                  <span className="flex items-center space-x-1 text-xs px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full border border-purple-400/30 font-medium">
                    <Zap className="w-3 h-3" />
                    <span>Live</span>
                  </span>
                  <span className="flex items-center space-x-1 text-xs px-3 py-1 bg-orange-500/20 text-orange-200 rounded-full border border-orange-400/30 font-medium">
                    <BookOpen className="w-3 h-3" />
                    <span>Interactive</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {processMode === 'stream' && (
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
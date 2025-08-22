import { Download, Eye } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ProcessModeSelection() {
  const { processMode, setProcessMode, extractedContent } = useAppStore()
  const hasContent = extractedContent.trim().length > 0
  
  if (!hasContent) {
    return null
  }
  
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Mode</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setProcessMode('generate')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            processMode === 'generate'
              ? 'border-primary-300 bg-primary-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              processMode === 'generate' 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-medium ${
                processMode === 'generate' ? 'text-primary-900' : 'text-gray-700'
              }`}>
                Generate & Download
              </h4>
              <p className={`text-sm mt-1 ${
                processMode === 'generate' ? 'text-primary-700' : 'text-gray-500'
              }`}>
                Create an audio file and download it for offline listening
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  MP3
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Offline
                </span>
              </div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setProcessMode('stream')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            processMode === 'stream'
              ? 'border-primary-300 bg-primary-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              processMode === 'stream' 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-medium ${
                processMode === 'stream' ? 'text-primary-900' : 'text-gray-700'
              }`}>
                Read & Listen
              </h4>
              <p className={`text-sm mt-1 ${
                processMode === 'stream' ? 'text-primary-700' : 'text-gray-500'
              }`}>
                Beautiful reader view with synchronized audio playback
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Live
                </span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Interactive
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          disabled={!hasContent}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {processMode === 'generate' ? 'Generate Audio File' : 'Start Reading Experience'}
        </button>
      </div>
    </div>
  )
}
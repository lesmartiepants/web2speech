import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ErrorDisplay() {
  const { error, setError } = useAppStore()
  
  if (!error) return null
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-6 shadow-2xl border border-red-400/30 bg-red-500/10">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-200 mb-4 leading-relaxed">{error}</p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setError(null)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => setError(null)}
              className="p-2 text-red-300 hover:text-white transition-colors rounded-lg hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
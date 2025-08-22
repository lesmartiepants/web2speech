import { AlertCircle, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ErrorDisplay() {
  const { error, setError } = useAppStore()
  
  if (!error) return null
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  )
}
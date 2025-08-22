import { Switch } from '@headlessui/react'
import { Globe, Upload, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function InputToggle() {
  const { inputMode, setInputMode } = useAppStore()
  const isFileMode = inputMode === 'file'
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-accent-400" />
          <h2 className="text-2xl font-bold text-white">Choose Your Input</h2>
        </div>
        <Switch
          checked={isFileMode}
          onChange={(checked) => setInputMode(checked ? 'file' : 'url')}
          className={`${
            isFileMode ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 'bg-gradient-to-r from-primary-500 to-primary-600'
          } relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-400/50 shadow-lg`}
        >
          <span
            className={`${
              isFileMode ? 'translate-x-9' : 'translate-x-1'
            } inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg`}
          />
        </Switch>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
          !isFileMode 
            ? 'border-primary-400/50 bg-primary-500/10 shadow-xl' 
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
        onClick={() => setInputMode('url')}
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              !isFileMode 
                ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg' 
                : 'bg-white/10 group-hover:bg-white/20'
            }`}>
              <Globe className={`w-6 h-6 ${
                !isFileMode ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`} />
            </div>
            <span className={`text-xl font-bold ${
              !isFileMode ? 'text-white' : 'text-gray-400 group-hover:text-white'
            }`}>
              Web URL
            </span>
          </div>
          <p className={`text-sm ${
            !isFileMode ? 'text-primary-100' : 'text-gray-500 group-hover:text-gray-300'
          }`}>
            Extract content from any website or blog post
          </p>
          {!isFileMode && (
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
          isFileMode 
            ? 'border-accent-400/50 bg-accent-500/10 shadow-xl' 
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
        onClick={() => setInputMode('file')}
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isFileMode 
                ? 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg' 
                : 'bg-white/10 group-hover:bg-white/20'
            }`}>
              <Upload className={`w-6 h-6 ${
                isFileMode ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`} />
            </div>
            <span className={`text-xl font-bold ${
              isFileMode ? 'text-white' : 'text-gray-400 group-hover:text-white'
            }`}>
              File Upload
            </span>
          </div>
          <p className={`text-sm ${
            isFileMode ? 'text-accent-100' : 'text-gray-500 group-hover:text-gray-300'
          }`}>
            Upload PDFs, text files, and documents
          </p>
          {isFileMode && (
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
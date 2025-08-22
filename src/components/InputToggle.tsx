import { Switch } from '@headlessui/react'
import { Globe, Upload } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function InputToggle() {
  const { inputMode, setInputMode } = useAppStore()
  const isFileMode = inputMode === 'file'
  
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Content Source</h2>
        <Switch
          checked={isFileMode}
          onChange={(checked) => setInputMode(checked ? 'file' : 'url')}
          className={`${
            isFileMode ? 'bg-primary-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              isFileMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
      
      <div className="flex space-x-4">
        <div className={`flex-1 p-4 rounded-xl border-2 transition-all ${
          !isFileMode 
            ? 'border-primary-300 bg-primary-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Globe className={`w-5 h-5 ${
              !isFileMode ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <span className={`font-medium ${
              !isFileMode ? 'text-primary-900' : 'text-gray-600'
            }`}>
              URL
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            !isFileMode ? 'text-primary-700' : 'text-gray-500'
          }`}>
            Paste a web page URL
          </p>
        </div>
        
        <div className={`flex-1 p-4 rounded-xl border-2 transition-all ${
          isFileMode 
            ? 'border-primary-300 bg-primary-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Upload className={`w-5 h-5 ${
              isFileMode ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <span className={`font-medium ${
              isFileMode ? 'text-primary-900' : 'text-gray-600'
            }`}>
              File
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            isFileMode ? 'text-primary-700' : 'text-gray-500'
          }`}>
            Upload a PDF or text file
          </p>
        </div>
      </div>
    </div>
  )
}
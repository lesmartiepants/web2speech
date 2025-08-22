import { useState } from 'react'
import { Link, Loader2, Globe, Zap } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function UrlInput() {
  const { url, setUrl, setExtractedContent, setIsLoading, setError, isLoading } = useAppStore()
  const [inputValue, setInputValue] = useState(url)
  
  const extractContent = async (url: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real app, you'd use a CORS proxy service or backend
      // For now, we'll simulate content extraction
      setUrl(url)
      
      // Simulated content extraction - in reality you'd use:
      // - A CORS proxy service
      // - Readability.js with a backend service
      // - Mercury Parser API
      
      setTimeout(() => {
        setExtractedContent(`
          This is a sample extracted content from the URL: ${url}
          
          In a production app, this would be the actual content extracted from the webpage using services like:
          
          - Mercury Parser for clean content extraction
          - Readability.js for article parsing
          - Custom scraping with Puppeteer or similar
          
          The content would be processed to remove navigation, ads, and other non-essential elements, leaving only the main article text for optimal text-to-speech conversion.
        `)
        setIsLoading(false)
      }, 2000)
      
    } catch {
      setError('Failed to extract content from URL. Please check the URL and try again.')
      setIsLoading(false)
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      extractContent(inputValue.trim())
    }
  }
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Web Content Extraction</h3>
          <p className="text-gray-300 text-sm">Enter any website URL to extract readable content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="url" className="block text-sm font-semibold text-white">
            Website URL
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Link className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
            </div>
            <input
              type="url"
              id="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com/article"
              className="block w-full pl-12 pr-16 py-4 bg-dark-800/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-primary-400/50 focus:border-primary-400 text-white text-lg placeholder-gray-400 transition-all duration-300"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Loader2 className="h-6 w-6 text-primary-400 animate-spin" />
              </div>
            )}
            {!isLoading && inputValue && isValidUrl(inputValue.trim()) && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Zap className="h-5 w-5 text-accent-400" />
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!inputValue.trim() || !isValidUrl(inputValue.trim()) || isLoading}
          className="relative w-full group overflow-hidden"
        >
          <div className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            (!inputValue.trim() || !isValidUrl(inputValue.trim()) || isLoading)
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:from-primary-600 hover:via-primary-700 hover:to-accent-600'
          }`}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Extracting Content...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-3" />
                Extract Content
              </span>
            )}
          </div>
          {!isLoading && inputValue.trim() && isValidUrl(inputValue.trim()) && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-white/10 to-primary-600/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
      </form>
    </div>
  )
}
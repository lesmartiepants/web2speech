import { useState } from 'react'
import { Link, Loader2 } from 'lucide-react'
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
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com/article"
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm placeholder-gray-400"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!inputValue.trim() || !isValidUrl(inputValue.trim()) || isLoading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting Content...
            </span>
          ) : (
            'Extract Content'
          )}
        </button>
      </form>
    </div>
  )
}
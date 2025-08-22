import { useAppStore } from './store/useAppStore'
import Header from './components/Header'
import InputToggle from './components/InputToggle'
import UrlInput from './components/UrlInput'
import FileUpload from './components/FileUpload'
import VoiceSelection from './components/VoiceSelection'
import ProcessModeSelection from './components/ProcessModeSelection'
import ReaderView from './components/ReaderView'
import ErrorDisplay from './components/ErrorDisplay'

function App() {
  const { 
    inputMode, 
    extractedContent, 
    processMode, 
    setShowReaderView
  } = useAppStore()

  const handleStartReading = () => {
    if (processMode === 'stream' && extractedContent.trim()) {
      setShowReaderView(true)
    } else if (processMode === 'generate' && extractedContent.trim()) {
      // In a real app, this would generate and download the audio file
      alert('Audio generation would start here. This would use services like:\n\n- ElevenLabs API for high-quality TTS\n- Azure Cognitive Services\n- Google Cloud Text-to-Speech\n- Local TTS with better models')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform any content into beautiful speech
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste a URL or upload a file to get started. Choose your preferred voice and enjoy a beautiful reading experience with synchronized audio.
          </p>
        </div>

        <ErrorDisplay />
        
        <InputToggle />
        
        {inputMode === 'url' ? <UrlInput /> : <FileUpload />}
        
        {extractedContent && (
          <>
            <VoiceSelection />
            
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {extractedContent.slice(0, 500)}
                  {extractedContent.length > 500 && '...'}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {extractedContent.split(/\s+/).length} words • ~{Math.ceil(extractedContent.split(/\s+/).length / 200)} minutes reading time
              </p>
            </div>
            
            <ProcessModeSelection />
            
            {extractedContent && (
              <div className="text-center">
                <button
                  onClick={handleStartReading}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-105 transition-all shadow-lg"
                >
                  {processMode === 'generate' ? '🎵 Generate Audio File' : '📖 Start Reading Experience'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      <ReaderView />
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with ❤️ for accessibility and beautiful reading experiences
            </p>
            <p className="text-sm">
              Powered by modern web technologies: React, TypeScript, Tailwind CSS, Web Speech API
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

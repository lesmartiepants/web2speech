import { useAppStore } from './store/useAppStore'
import Header from './components/Header'
import InputToggle from './components/InputToggle'
import UrlInput from './components/UrlInput'
import FileUpload from './components/FileUpload'
import TTSEngineSelection from './components/TTSEngineSelection'
import VoiceSelection from './components/VoiceSelection'
import ProcessModeSelection from './components/ProcessModeSelection'
import ReaderView from './components/ReaderView'
import ErrorDisplay from './components/ErrorDisplay'
import HuggingFaceTTSService from './services/huggingface'

function App() {
  const { 
    inputMode, 
    extractedContent, 
    processMode, 
    ttsEngine,
    selectedVoice,
    huggingFaceApiKey,
    setShowReaderView,
    setError
  } = useAppStore()

  const handleStartReading = async () => {
    if (processMode === 'stream' && extractedContent.trim()) {
      setShowReaderView(true)
    } else if (processMode === 'generate' && extractedContent.trim()) {
      try {
        if (ttsEngine === 'huggingface' && huggingFaceApiKey && selectedVoice) {
          const service = new HuggingFaceTTSService({
            apiKey: huggingFaceApiKey
          })
          
          const result = await service.generateAudio({
            text: extractedContent,
            voice: selectedVoice.id
          })
          
          // Create download link
          const link = document.createElement('a')
          link.href = result.audioUrl
          link.download = `web2speech-audio-${Date.now()}.wav`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Cleanup
          setTimeout(() => {
            URL.revokeObjectURL(result.audioUrl)
          }, 1000)
        } else {
          // Fallback message for browser TTS or missing configuration
          alert(`Audio generation is available with Hugging Face Kokoro-82M TTS. 
          
Current setup: ${ttsEngine === 'webspeech' ? 'Browser TTS (streaming only)' : 'Hugging Face TTS'}
${ttsEngine === 'huggingface' && !huggingFaceApiKey ? 'Please configure your API key to use audio generation.' : ''}

For high-quality downloadable audio files, select Hugging Face Kokoro-82M as your TTS engine.`)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Audio generation failed')
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Transform Content Into
            </h2>
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Beautiful Speech
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of text-to-speech. Paste a URL or upload a file to get started. 
            Choose your preferred AI voice and enjoy a synchronized reading experience like never before.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>

        <ErrorDisplay />
        
        <InputToggle />
        
        {inputMode === 'url' ? <UrlInput /> : <FileUpload />}
        
        {extractedContent && (
          <>
            <TTSEngineSelection />
            
            <VoiceSelection />
            
            <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
                <h3 className="text-2xl font-bold text-white">Content Preview</h3>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 max-h-48 overflow-y-auto border border-white/10">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {extractedContent.slice(0, 500)}
                  {extractedContent.length > 500 && '...'}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {extractedContent.split(/\s+/).length} words
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                    <span className="text-sm font-medium">
                      ~{Math.ceil(extractedContent.split(/\s+/).length / 200)} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <ProcessModeSelection />
            
            {extractedContent && (
              <div className="text-center">
                <button
                  onClick={handleStartReading}
                  className="relative btn-primary text-xl px-12 py-5 font-bold group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    {processMode === 'generate' ? (
                      <>
                        <span>🎵</span>
                        <span>
                          {ttsEngine === 'huggingface' ? 'Generate Audio File (Kokoro-82M)' : 'Generate Audio File'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span>Start Reading Experience</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-white/10 to-primary-600/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      <ReaderView />
      
      {/* Enhanced Footer */}
      <footer className="glass-morphism mt-24 border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <p className="text-lg text-white font-medium">
              Built with ❤️ for accessibility and beautiful reading experiences
            </p>
            <p className="text-gray-400">
              Powered by React • TypeScript • Tailwind CSS • Web Speech API • Hugging Face Kokoro-82M
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 mt-6">
              <span>© 2024 Web2Speech</span>
              <span>•</span>
              <span>Made with modern web technologies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

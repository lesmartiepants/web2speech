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
            apiKey: huggingFaceApiKey,
            model: 'hexgrad/Kokoro-82M'
          })
          
          const result = await service.generateAudio({
            text: extractedContent,
            voice: selectedVoice.id.replace('huggingface-', '')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform any content into beautiful speech
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste a URL or upload a file to get started. Choose your preferred TTS engine and voice, then enjoy a beautiful reading experience with synchronized audio.
          </p>
        </div>

        <ErrorDisplay />
        
        <InputToggle />
        
        {inputMode === 'url' ? <UrlInput /> : <FileUpload />}
        
        {extractedContent && (
          <>
            <TTSEngineSelection />
            
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
                  {processMode === 'generate' ? (
                    ttsEngine === 'huggingface' ? '🎵 Generate Audio File (Kokoro-82M)' : '🎵 Generate Audio File'
                  ) : '📖 Start Reading Experience'}
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
              Powered by modern web technologies: React, TypeScript, Tailwind CSS, Web Speech API, Hugging Face Kokoro-82M
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

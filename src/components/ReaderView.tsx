import { useState } from 'react'
import { Play, Pause, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import HuggingFaceTTSService from '../services/huggingface'

export default function ReaderView() {
  const {
    articleTitle,
    articleByline,
    articleHtml,
    extractedContent,
    selectedVoice,
    isPlaying,
    setIsPlaying,
    setCurrentUtterance,
    currentAudio,
    setCurrentAudio,
    showReaderView,
    setShowReaderView,
    ttsEngine,
    huggingFaceApiKey,
    setError
  } = useAppStore()

  const [isGenerating, setIsGenerating] = useState(false)

  if (!showReaderView) return null

  const playWebSpeech = () => {
    if (!selectedVoice?.nativeVoice || !extractedContent.trim()) return
    try {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(extractedContent)
      utterance.voice = selectedVoice.nativeVoice
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 0.9
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => { setIsPlaying(false); setCurrentUtterance(null) }
      utterance.onerror = () => { setIsPlaying(false); setCurrentUtterance(null) }
      setCurrentUtterance(utterance)
      speechSynthesis.speak(utterance)
    } catch (e) {
      setError('Speech synthesis failed')
    }
  }

  const playHuggingFace = async () => {
    if (!selectedVoice || !huggingFaceApiKey || !extractedContent.trim()) return
    try {
      setIsGenerating(true)
      const service = new HuggingFaceTTSService({ apiKey: huggingFaceApiKey, model: 'hexgrad/Kokoro-82M' })
      const result = await service.generateAudio({ text: extractedContent, voice: selectedVoice.id.replace('huggingface-', '') })
      const audio = new Audio(result.audioUrl)
      audio.onended = () => { setIsPlaying(false); setCurrentAudio(null); URL.revokeObjectURL(result.audioUrl) }
      audio.onerror = () => { setIsPlaying(false); setCurrentAudio(null); setError('Audio playback failed') }
      setCurrentAudio(audio)
      setIsPlaying(true)
      await audio.play()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'TTS generation failed')
      setIsPlaying(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlay = () => {
    if (ttsEngine === 'webspeech') {
      playWebSpeech()
    } else {
      void playHuggingFace()
    }
  }

  const handlePause = () => {
    if (ttsEngine === 'webspeech') {
      speechSynthesis.cancel()
    } else if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }
    setIsPlaying(false)
    setCurrentUtterance(null)
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2" style={{ borderColor: '#111827' }}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowReaderView(false)}
            className="p-3 rounded-xl"
            style={{ border: '3px solid #111827' }}
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#111827' }}>{articleTitle || 'Reader View'}</h2>
            {articleByline && (
              <p className="text-sm" style={{ color: '#4b5563' }}>{articleByline}</p>
            )}
          </div>
        </div>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={!extractedContent.trim() || isGenerating}
          className="px-5 py-3 font-bold rounded-xl"
          style={{ background: '#111827', color: '#ffffff', border: '3px solid #111827' }}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: articleHtml || '' }} />
        </div>
      </div>
    </div>
  )
}
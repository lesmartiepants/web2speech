import { useEffect, useState } from 'react'
import { Play, Pause, SkipForward, SkipBack, Settings, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import HuggingFaceTTSService from '../services/huggingface'

export default function ReaderView() {
  const {
    extractedContent,
    selectedVoice,
    isPlaying,
    setIsPlaying,
    setCurrentUtterance,
    currentAudio,
    setCurrentAudio,
    showReaderView,
    setShowReaderView,
    currentWordIndex,
    setCurrentWordIndex,
    ttsEngine,
    huggingFaceApiKey,
    setError
  } = useAppStore()
  
  const [words, setWords] = useState<string[]>([])
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  const [audioChunks, setAudioChunks] = useState<{ audioUrl: string; startIndex: number; endIndex: number }[]>([])
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  
  useEffect(() => {
    if (extractedContent) {
      const wordList = extractedContent
        .replace(/\n+/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0)
      setWords(wordList)
    }
  }, [extractedContent])

  const speakWithWebSpeech = () => {
    if (!selectedVoice?.nativeVoice || words.length === 0) return
    
    // Stop any current speech
    speechSynthesis.cancel()
    
    const textToSpeak = words.slice(currentWordIndex).join(' ')
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    
    utterance.voice = selectedVoice.nativeVoice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 0.8
    
    utterance.onstart = () => {
      setIsPlaying(true)
    }
    
    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentUtterance(null)
      setCurrentWordIndex(0)
    }
    
    utterance.onerror = () => {
      setIsPlaying(false)
      setCurrentUtterance(null)
    }
    
    // Simple word tracking (not perfect but functional)
    let wordTracker = currentWordIndex
    const wordInterval = setInterval(() => {
      if (!isPlaying || wordTracker >= words.length) {
        clearInterval(wordInterval)
        return
      }
      
      wordTracker++
      setCurrentWordIndex(wordTracker)
    }, (60 / (rate * 200)) * 1000) // Approximate word timing
    
    utterance.onend = () => {
      clearInterval(wordInterval)
      setIsPlaying(false)
      setCurrentUtterance(null)
      setCurrentWordIndex(0)
    }
    
    setCurrentUtterance(utterance)
    speechSynthesis.speak(utterance)
  }

  const speakWithHuggingFace = async () => {
    if (!selectedVoice || !huggingFaceApiKey || words.length === 0) return
    
    try {
      setIsPlaying(true)
      const service = new HuggingFaceTTSService({
        apiKey: huggingFaceApiKey,
        model: 'hexgrad/Kokoro-82M'
      })
      
      // For long texts, break into chunks
      const textToSpeak = words.slice(currentWordIndex).join(' ')
      const maxChunkSize = 500 // Adjust based on what works well with Kokoro
      
      if (textToSpeak.length > maxChunkSize) {
        // Generate audio in chunks
        const chunks: string[] = []
        let currentChunk = ''
        let startWordIndex = currentWordIndex
        
        for (let i = currentWordIndex; i < words.length; i++) {
          const word = words[i]
          if ((currentChunk + ' ' + word).length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk.trim())
            currentChunk = word
            continue
          }
          currentChunk += (currentChunk ? ' ' : '') + word
        }
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }
        
        const newAudioChunks: { audioUrl: string; startIndex: number; endIndex: number }[] = []
        
        for (let i = 0; i < chunks.length; i++) {
          const result = await service.generateAudio({
            text: chunks[i],
            voice: selectedVoice.id.replace('huggingface-', '')
          })
          
          const wordsInChunk = chunks[i].split(/\s+/).length
          newAudioChunks.push({
            audioUrl: result.audioUrl,
            startIndex: startWordIndex,
            endIndex: startWordIndex + wordsInChunk - 1
          })
          startWordIndex += wordsInChunk
        }
        
        setAudioChunks(newAudioChunks)
        setCurrentChunkIndex(0)
        playAudioChunk(newAudioChunks[0])
      } else {
        // Single chunk
        const result = await service.generateAudio({
          text: textToSpeak,
          voice: selectedVoice.id.replace('huggingface-', '')
        })
        
        const audio = new Audio(result.audioUrl)
        setCurrentAudio(audio)
        
        // Simple word tracking for single chunk
        const totalWords = words.length - currentWordIndex
        const duration = result.duration * 1000 // Convert to milliseconds
        const wordInterval = duration / totalWords
        
        let wordTracker = currentWordIndex
        const trackingInterval = setInterval(() => {
          if (!isPlaying || wordTracker >= words.length) {
            clearInterval(trackingInterval)
            return
          }
          wordTracker++
          setCurrentWordIndex(wordTracker)
        }, wordInterval)
        
        audio.onended = () => {
          clearInterval(trackingInterval)
          setIsPlaying(false)
          setCurrentAudio(null)
          setCurrentWordIndex(0)
          URL.revokeObjectURL(result.audioUrl)
        }
        
        audio.onerror = () => {
          clearInterval(trackingInterval)
          setIsPlaying(false)
          setCurrentAudio(null)
          setError('Audio playback failed')
        }
        
        await audio.play()
      }
    } catch (error) {
      console.error('Hugging Face TTS failed:', error)
      setError(error instanceof Error ? error.message : 'TTS generation failed')
      setIsPlaying(false)
    }
  }

  const playAudioChunk = async (chunk: typeof audioChunks[0]) => {
    const audio = new Audio(chunk.audioUrl)
    setCurrentAudio(audio)
    
    const wordsInChunk = chunk.endIndex - chunk.startIndex + 1
    const estimatedDuration = (wordsInChunk / 150) * 60 * 1000 // 150 words per minute in ms
    const wordInterval = estimatedDuration / wordsInChunk
    
    let wordTracker = chunk.startIndex
    const trackingInterval = setInterval(() => {
      if (!isPlaying || wordTracker > chunk.endIndex) {
        clearInterval(trackingInterval)
        return
      }
      setCurrentWordIndex(wordTracker)
      wordTracker++
    }, wordInterval)
    
    audio.onended = () => {
      clearInterval(trackingInterval)
      
      // Play next chunk if available
      if (currentChunkIndex + 1 < audioChunks.length) {
        const nextIndex = currentChunkIndex + 1
        setCurrentChunkIndex(nextIndex)
        playAudioChunk(audioChunks[nextIndex])
      } else {
        // All chunks finished
        setIsPlaying(false)
        setCurrentAudio(null)
        setCurrentWordIndex(0)
        setAudioChunks([])
        setCurrentChunkIndex(0)
      }
      
      URL.revokeObjectURL(chunk.audioUrl)
    }
    
    audio.onerror = () => {
      clearInterval(trackingInterval)
      setIsPlaying(false)
      setCurrentAudio(null)
      setError('Audio playback failed')
    }
    
    await audio.play()
  }
  
  const speak = async () => {
    if (!selectedVoice || words.length === 0) return
    
    if (ttsEngine === 'webspeech') {
      speakWithWebSpeech()
    } else if (ttsEngine === 'huggingface') {
      await speakWithHuggingFace()
    }
  }
  
  const pause = () => {
    if (ttsEngine === 'webspeech') {
      speechSynthesis.cancel()
    } else if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }
    
    setIsPlaying(false)
    setCurrentUtterance(null)
    
    // Cleanup audio chunks
    audioChunks.forEach(chunk => URL.revokeObjectURL(chunk.audioUrl))
    setAudioChunks([])
    setCurrentChunkIndex(0)
  }
  
  const skipBack = () => {
    const newIndex = Math.max(0, currentWordIndex - 20)
    setCurrentWordIndex(newIndex)
    if (isPlaying) {
      pause()
      setTimeout(speak, 100)
    }
  }
  
  const skipForward = () => {
    const newIndex = Math.min(words.length - 1, currentWordIndex + 20)
    setCurrentWordIndex(newIndex)
    if (isPlaying) {
      pause()
      setTimeout(speak, 100)
    }
  }
  
  const renderContent = () => {
    if (words.length === 0) return null
    
    return (
      <div className="prose prose-lg max-w-none">
        {words.map((word, index) => {
          const isCurrentWord = index === currentWordIndex && isPlaying
          const isReadWord = index < currentWordIndex
          
          return (
            <span
              key={index}
              className={`transition-all duration-200 ${
                isCurrentWord
                  ? 'bg-primary-200 text-primary-900 font-semibold px-1 rounded'
                  : isReadWord
                  ? 'text-gray-500'
                  : 'text-gray-900'
              }`}
            >
              {word}{' '}
            </span>
          )
        })}
      </div>
    )
  }
  
  if (!showReaderView) return null
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReaderView(false)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Reader View</h2>
          <span className="text-sm text-gray-500">
            {ttsEngine === 'huggingface' ? '🤖 Kokoro-82M' : '🔊 Browser TTS'}
          </span>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {/* Settings Panel */}
      {showSettings && ttsEngine === 'webspeech' && (
        <div className="p-4 bg-gray-50 border-b space-y-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Speed:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{rate}x</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Pitch:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{pitch}</span>
            </div>
          </div>
        </div>
      )}
      
      {showSettings && ttsEngine === 'huggingface' && (
        <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            Kokoro-82M TTS settings are controlled at the voice level. 
            Speech rate and pitch adjustments are built into the AI model.
          </p>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
      
      {/* Audio Controls */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={skipBack}
              className="p-3 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={isPlaying ? pause : speak}
              disabled={words.length === 0}
              className="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
            
            <button
              onClick={skipForward}
              className="p-3 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span>{Math.round((currentWordIndex / words.length) * 100)}% complete</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentWordIndex / words.length) * 100}%` }}
              />
            </div>
            <span>{words.length} words</span>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Play, Pause, SkipForward, SkipBack, Settings, X, Sparkles } from 'lucide-react'
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
              className={`transition-all duration-300 ${
                isCurrentWord
                  ? 'bg-gradient-to-r from-accent-400/30 to-primary-400/30 text-white font-bold px-2 py-1 rounded-lg shadow-lg border border-accent-400/50'
                  : isReadWord
                  ? 'text-gray-500'
                  : 'text-gray-200'
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
    <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20 glass-morphism-strong">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowReaderView(false)}
            className="p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Reader View</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-300">
                {ttsEngine === 'huggingface' ? '🤖 Kokoro-82M AI' : '🔊 Browser TTS'}
              </span>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 hover:scale-110 group"
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
      
      {/* Settings Panel */}
      {showSettings && ttsEngine === 'webspeech' && (
        <div className="p-6 glass-morphism border-b border-white/20 space-y-6">
          <div className="flex items-center justify-center space-x-12">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-white">Speed:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-32 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-accent-300 font-medium min-w-[3rem]">{rate}x</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-white">Pitch:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-32 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-accent-300 font-medium min-w-[3rem]">{pitch}</span>
            </div>
          </div>
        </div>
      )}
      
      {showSettings && ttsEngine === 'huggingface' && (
        <div className="p-6 glass-morphism border-b border-white/20">
          <div className="flex items-center space-x-3 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-accent-200 font-medium">
              Kokoro-82M TTS settings are controlled at the voice level with built-in natural speech optimization.
            </p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-morphism rounded-3xl p-8 shadow-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Audio Controls */}
      <div className="glass-morphism-strong border-t border-white/20 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <button
              onClick={skipBack}
              className="p-4 text-gray-400 hover:text-primary-400 transition-all duration-300 rounded-2xl hover:bg-white/10 hover:scale-110 group"
            >
              <SkipBack className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={isPlaying ? pause : speak}
              disabled={words.length === 0}
              className="relative p-6 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white rounded-3xl hover:from-primary-600 hover:via-primary-700 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-accent-500/25 transform hover:scale-105 group"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-10 h-10 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-white/10 to-primary-600/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button
              onClick={skipForward}
              className="p-4 text-gray-400 hover:text-primary-400 transition-all duration-300 rounded-2xl hover:bg-white/10 hover:scale-110 group"
            >
              <SkipForward className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="text-accent-300 font-semibold">
              {Math.round((currentWordIndex / words.length) * 100)}% complete
            </span>
            <div className="w-48 h-3 bg-dark-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-400 to-accent-500 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(currentWordIndex / words.length) * 100}%` }}
              />
            </div>
            <span className="text-gray-300 font-medium">{words.length} words</span>
          </div>
        </div>
      </div>
    </div>
  )
}
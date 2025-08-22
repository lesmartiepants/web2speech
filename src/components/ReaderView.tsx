import { useEffect, useState } from 'react'
import { Play, Pause, SkipForward, SkipBack, Settings, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ReaderView() {
  const {
    extractedContent,
    selectedVoice,
    isPlaying,
    setIsPlaying,
    setCurrentUtterance,
    showReaderView,
    setShowReaderView,
    currentWordIndex,
    setCurrentWordIndex
  } = useAppStore()
  
  const [words, setWords] = useState<string[]>([])
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  
  useEffect(() => {
    if (extractedContent) {
      const wordList = extractedContent
        .replace(/\n+/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0)
      setWords(wordList)
    }
  }, [extractedContent])
  
  const speak = () => {
    if (!selectedVoice || words.length === 0) return
    
    // Stop any current speech
    speechSynthesis.cancel()
    
    const textToSpeak = words.slice(currentWordIndex).join(' ')
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    
    utterance.voice = selectedVoice
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
  
  const pause = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentUtterance(null)
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
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
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
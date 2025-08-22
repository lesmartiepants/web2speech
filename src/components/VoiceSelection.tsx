import { useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronsUpDown, Check, Volume2, Mic, Sparkles } from 'lucide-react'
import { useAppStore, type VoiceOption } from '../store/useAppStore'
import HuggingFaceTTSService from '../services/huggingface'

export default function VoiceSelection() {
  const {
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    setAvailableVoices,
    ttsEngine,
    huggingFaceApiKey
  } = useAppStore()
  
  useEffect(() => {
    const loadVoices = async () => {
      let voices: VoiceOption[] = []
      
      if (ttsEngine === 'webspeech') {
        // Load Web Speech API voices
        const webSpeechVoices = speechSynthesis.getVoices()
        if (webSpeechVoices.length > 0) {
          voices = webSpeechVoices.map(voice => ({
            id: `webspeech-${voice.name}-${voice.lang}`,
            name: voice.name,
            language: voice.lang,
            engine: 'webspeech' as const,
            nativeVoice: voice
          }))
        }
      } else if (ttsEngine === 'huggingface' && huggingFaceApiKey) {
        // Load Hugging Face voices
        try {
          const service = new HuggingFaceTTSService({
            apiKey: huggingFaceApiKey,
            model: 'hexgrad/Kokoro-82M'
          })
          const hfVoices = service.getAvailableVoices()
          voices = hfVoices.map(voice => ({
            id: voice.id,
            name: voice.name,
            language: voice.language,
            engine: 'huggingface' as const
          }))
        } catch (error) {
          console.error('Failed to load Hugging Face voices:', error)
        }
      }
      
      if (voices.length > 0) {
        setAvailableVoices(voices)
        // Set default voice to the first English voice or first available voice
        if (!selectedVoice || selectedVoice.engine !== ttsEngine) {
          const englishVoice = voices.find(voice => voice.language.startsWith('en'))
          setSelectedVoice(englishVoice || voices[0])
        }
      }
    }
    
    loadVoices()
    
    // For Web Speech API, also listen for voice changes
    if (ttsEngine === 'webspeech' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }
    
    return () => {
      if (speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [ttsEngine, huggingFaceApiKey, selectedVoice, setSelectedVoice, setAvailableVoices])
  
  const testVoice = async () => {
    if (!selectedVoice) return
    
    try {
      if (selectedVoice.engine === 'webspeech' && selectedVoice.nativeVoice) {
        const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound.')
        utterance.voice = selectedVoice.nativeVoice
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 0.8
        speechSynthesis.speak(utterance)
      } else if (selectedVoice.engine === 'huggingface' && huggingFaceApiKey) {
        const service = new HuggingFaceTTSService({
          apiKey: huggingFaceApiKey,
          model: 'hexgrad/Kokoro-82M'
        })
        const result = await service.generateAudio({
          text: 'Hello! This is how I sound with Kokoro TTS.',
          voice: selectedVoice.id
        })
        
        const audio = new Audio(result.audioUrl)
        audio.play()
        
        // Cleanup after playing
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(result.audioUrl)
        })
      }
    } catch (error) {
      console.error('Voice test failed:', error)
    }
  }
  
  const getVoiceDisplayName = (voice: VoiceOption) => {
    const parts = []
    if (voice.name) parts.push(voice.name)
    if (voice.language) parts.push(`(${voice.language})`)
    return parts.join(' ') || 'Unknown Voice'
  }
  
  const getVoiceFlag = (lang: string) => {
    const langCode = lang.toLowerCase().split('-')[0]
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
      'hi': '🇮🇳'
    }
    return flags[langCode] || '🌐'
  }
  
  const getEngineIcon = (engine: 'webspeech' | 'huggingface') => {
    return engine === 'huggingface' ? '🤖' : '🔊'
  }
  
  if (availableVoices.length === 0) {
    return (
      <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Loading Voices...</h3>
            <p className="text-gray-300 text-sm">Discovering available AI voices</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded-xl w-1/4"></div>
          <div className="h-16 bg-white/10 rounded-2xl"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Voice Selection</h3>
            <p className="text-gray-300 text-sm">Choose your perfect AI voice</p>
          </div>
        </div>
        {selectedVoice && (
          <button
            onClick={testVoice}
            className="flex items-center space-x-2 px-4 py-2 glass-morphism rounded-xl hover:bg-white/20 transition-all duration-300 text-white hover:scale-105 group"
          >
            <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Test Voice</span>
          </button>
        )}
      </div>
      
      <Listbox value={selectedVoice} onChange={setSelectedVoice}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-dark-800/50 backdrop-blur-sm py-4 px-4 text-left border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-accent-400/50 focus:border-accent-400 transition-all duration-300 hover:bg-dark-700/50 group">
            <span className="flex items-center">
              {selectedVoice && (
                <>
                  <span className="mr-4 text-2xl">
                    {getVoiceFlag(selectedVoice.language)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="block font-bold text-white text-lg">
                        {getVoiceDisplayName(selectedVoice)}
                      </span>
                      <span className="text-lg">
                        {getEngineIcon(selectedVoice.engine)}
                      </span>
                      {selectedVoice.engine === 'huggingface' && (
                        <span className="text-xs text-accent-200 bg-accent-500/20 px-3 py-1 rounded-full border border-accent-400/30 font-semibold">
                          AI Neural
                        </span>
                      )}
                      {selectedVoice.engine === 'webspeech' && selectedVoice.nativeVoice?.localService && (
                        <span className="text-xs text-green-200 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30 font-semibold">
                          Local
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronsUpDown
                className="h-6 w-6 text-gray-400 group-hover:text-accent-400 transition-colors"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl glass-morphism-strong border border-white/20 shadow-2xl focus:outline-none">
              {availableVoices.map((voice) => (
                <Listbox.Option
                  key={voice.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-4 pl-12 pr-6 transition-all duration-200 ${
                      active ? 'bg-accent-500/20 border-l-4 border-accent-400' : 'hover:bg-white/5'
                    }`
                  }
                  value={voice}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <span className="mr-4 text-xl">
                          {getVoiceFlag(voice.language)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`block font-semibold text-lg ${
                                selected ? 'text-white' : 'text-gray-200'
                              }`}
                            >
                              {getVoiceDisplayName(voice)}
                            </span>
                            <span className="text-lg">
                              {getEngineIcon(voice.engine)}
                            </span>
                            {voice.engine === 'huggingface' && (
                              <span className="text-xs text-accent-200 bg-accent-500/20 px-2 py-1 rounded-full border border-accent-400/30 font-medium">
                                AI Neural
                              </span>
                            )}
                            {voice.engine === 'webspeech' && voice.nativeVoice?.localService && (
                              <span className="text-xs text-green-200 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30 font-medium">
                                Local
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-accent-400">
                          <Check className="h-6 w-6" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
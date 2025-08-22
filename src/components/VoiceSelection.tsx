import { useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronsUpDown, Check, Volume2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function VoiceSelection() {
  const {
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    setAvailableVoices
  } = useAppStore()
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
        // Set default voice to the first English voice or first available voice
        if (!selectedVoice) {
          const englishVoice = voices.find(voice => voice.lang.startsWith('en'))
          setSelectedVoice(englishVoice || voices[0])
        }
      }
    }
    
    loadVoices()
    
    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }
    
    return () => {
      if (speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [selectedVoice, setSelectedVoice, setAvailableVoices])
  
  const testVoice = () => {
    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound.')
      utterance.voice = selectedVoice
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }
  
  const getVoiceDisplayName = (voice: SpeechSynthesisVoice) => {
    const parts = []
    if (voice.name) parts.push(voice.name)
    if (voice.lang) parts.push(`(${voice.lang})`)
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
  
  if (availableVoices.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Voice Selection
        </label>
        {selectedVoice && (
          <button
            onClick={testVoice}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test</span>
          </button>
        )}
      </div>
      
      <Listbox value={selectedVoice} onChange={setSelectedVoice}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <span className="flex items-center">
              {selectedVoice && (
                <>
                  <span className="mr-2 text-lg">
                    {getVoiceFlag(selectedVoice.lang)}
                  </span>
                  <span className="block truncate">
                    {getVoiceDisplayName(selectedVoice)}
                  </span>
                  {selectedVoice.localService && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Local
                    </span>
                  )}
                </>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {availableVoices.map((voice) => (
                <Listbox.Option
                  key={`${voice.name}-${voice.lang}`}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                    }`
                  }
                  value={voice}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">
                          {getVoiceFlag(voice.lang)}
                        </span>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {getVoiceDisplayName(voice)}
                        </span>
                        {voice.localService && (
                          <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Local
                          </span>
                        )}
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
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
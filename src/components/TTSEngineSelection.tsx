import { useState } from 'react'
import { Listbox, Transition, Dialog } from '@headlessui/react'
import { ChevronsUpDown, Check, Settings, ExternalLink, Cpu, Brain } from 'lucide-react'
import { useAppStore, type TTSEngine } from '../store/useAppStore'

const TTS_ENGINES = [
  {
    id: 'huggingface' as TTSEngine,
    name: 'Hugging Face Kokoro-82M',
    description: 'High-quality neural TTS with natural voices',
    quality: 'Premium',
    requiresApiKey: true,
    icon: '🤖'
  },
  {
    id: 'webspeech' as TTSEngine,
    name: 'Browser TTS',
    description: 'Built-in browser text-to-speech',
    quality: 'Standard',
    requiresApiKey: false,
    icon: '🔊'
  }
]

export default function TTSEngineSelection() {
  const {
    ttsEngine,
    setTTSEngine,
    huggingFaceApiKey,
    setHuggingFaceApiKey
  } = useAppStore()
  
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(huggingFaceApiKey)
  
  const selectedEngine = TTS_ENGINES.find(engine => engine.id === ttsEngine) || TTS_ENGINES[0]
  
  const handleEngineChange = (engine: typeof TTS_ENGINES[0]) => {
    if (engine.id === 'huggingface' && !huggingFaceApiKey) {
      setTempApiKey('')
      setShowApiKeyDialog(true)
      return
    }
    setTTSEngine(engine.id)
  }
  
  const saveApiKey = () => {
    setHuggingFaceApiKey(tempApiKey)
    setTTSEngine('huggingface')
    setShowApiKeyDialog(false)
  }
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">TTS Engine</h3>
            <p className="text-gray-300 text-sm">Choose your AI voice engine</p>
          </div>
        </div>
        {ttsEngine === 'huggingface' && (
          <button
            onClick={() => {
              setTempApiKey(huggingFaceApiKey)
              setShowApiKeyDialog(true)
            }}
            className="flex items-center space-x-2 px-4 py-2 glass-morphism rounded-xl hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Config</span>
          </button>
        )}
      </div>
      
      <Listbox value={selectedEngine} onChange={handleEngineChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-dark-800/50 backdrop-blur-sm py-4 px-4 text-left border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-300 hover:bg-dark-700/50 group">
            <div className="flex items-center">
              <div className="mr-4 text-2xl">{selectedEngine.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="block font-bold text-white text-lg">
                    {selectedEngine.name}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    selectedEngine.quality === 'Premium' 
                      ? 'bg-accent-500/20 text-accent-200 border border-accent-400/30' 
                      : 'bg-primary-500/20 text-primary-200 border border-primary-400/30'
                  }`}>
                    {selectedEngine.quality}
                  </span>
                  {selectedEngine.requiresApiKey && (
                    <span className="text-xs text-orange-200 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30 font-medium">
                      API Key Required
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm">
                  {selectedEngine.description}
                </p>
              </div>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronsUpDown
                className="h-6 w-6 text-gray-400 group-hover:text-primary-400 transition-colors"
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
            <Listbox.Options className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl glass-morphism-strong border border-white/20 shadow-2xl focus:outline-none">
              {TTS_ENGINES.map((engine) => (
                <Listbox.Option
                  key={engine.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-4 pl-12 pr-6 transition-all duration-200 ${
                      active ? 'bg-primary-500/20 border-l-4 border-primary-400' : 'hover:bg-white/5'
                    }`
                  }
                  value={engine}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <div className="mr-4 text-xl">{engine.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <span
                              className={`block font-semibold text-lg ${
                                selected ? 'text-white' : 'text-gray-200'
                              }`}
                            >
                              {engine.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              engine.quality === 'Premium' 
                                ? 'bg-accent-500/20 text-accent-200 border border-accent-400/30' 
                                : 'bg-primary-500/20 text-primary-200 border border-primary-400/30'
                            }`}>
                              {engine.quality}
                            </span>
                            {engine.requiresApiKey && (
                              <span className="text-xs text-orange-200 bg-orange-500/20 px-2 py-1 rounded-full border border-orange-400/30">
                                API Key Required
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${selected ? 'text-gray-300' : 'text-gray-400'}`}>
                            {engine.description}
                          </p>
                        </div>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-400">
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
      
      {/* Enhanced API Key Configuration Dialog */}
      <Transition appear show={showApiKeyDialog}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowApiKeyDialog(false)}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl glass-morphism-strong p-8 text-left align-middle shadow-2xl transition-all border border-white/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold text-white"
                      >
                        Kokoro-82M API Setup
                      </Dialog.Title>
                      <p className="text-gray-300">Configure your Hugging Face API</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-accent-500/10 rounded-2xl border border-accent-400/30">
                      <p className="text-accent-200 leading-relaxed">
                        Unlock premium neural TTS with natural-sounding voices powered by Hugging Face's Kokoro-82M model.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-white">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-800/50 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-primary-400/50 focus:border-primary-400 text-white placeholder-gray-400 text-lg transition-all duration-300"
                        placeholder="hf_..."
                      />
                    </div>
                    
                    <div className="p-4 bg-primary-500/10 rounded-2xl border border-primary-400/30">
                      <p className="text-primary-200 mb-3 font-medium">Get your API key:</p>
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-300 hover:text-white transition-colors font-semibold"
                      >
                        Hugging Face Settings
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <button
                      type="button"
                      className="flex-1 btn-primary font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={saveApiKey}
                      disabled={!tempApiKey.trim()}
                    >
                      ✨ Enable Kokoro-82M
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 text-gray-300 bg-dark-700/50 rounded-2xl hover:bg-dark-600/50 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 font-semibold"
                      onClick={() => setShowApiKeyDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
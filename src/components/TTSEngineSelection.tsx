import { useState } from 'react'
import { Listbox, Transition, Dialog } from '@headlessui/react'
import { ChevronsUpDown, Check, Settings, ExternalLink } from 'lucide-react'
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
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          TTS Engine
        </label>
        {ttsEngine === 'huggingface' && (
          <button
            onClick={() => {
              setTempApiKey(huggingFaceApiKey)
              setShowApiKeyDialog(true)
            }}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Config</span>
          </button>
        )}
      </div>
      
      <Listbox value={selectedEngine} onChange={handleEngineChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <div className="flex items-center">
              <span className="mr-3 text-lg">{selectedEngine.icon}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="block font-medium text-gray-900">
                    {selectedEngine.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedEngine.quality === 'Premium' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedEngine.quality}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {selectedEngine.description}
                </p>
              </div>
            </div>
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
              {TTS_ENGINES.map((engine) => (
                <Listbox.Option
                  key={engine.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                      active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                    }`
                  }
                  value={engine}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{engine.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`block font-medium ${
                                selected ? 'font-semibold' : 'font-normal'
                              }`}
                            >
                              {engine.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              engine.quality === 'Premium' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {engine.quality}
                            </span>
                            {engine.requiresApiKey && (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                API Key Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {engine.description}
                          </p>
                        </div>
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
      
      {/* API Key Configuration Dialog */}
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Hugging Face API Configuration
                  </Dialog.Title>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      To use the Hugging Face Kokoro-82M TTS model, you need to provide your API key.
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="hf_..."
                      />
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p className="mb-2">Get your API key from:</p>
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700"
                      >
                        Hugging Face Settings
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                      onClick={saveApiKey}
                      disabled={!tempApiKey.trim()}
                    >
                      Save & Use Kokoro-82M
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
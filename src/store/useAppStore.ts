import { create } from 'zustand'

export type InputMode = 'url' | 'file'
export type ProcessMode = 'generate' | 'stream'
export type TTSEngine = 'webspeech' | 'huggingface'

export interface VoiceOption {
  id: string
  name: string
  language: string
  engine: TTSEngine
  nativeVoice?: SpeechSynthesisVoice
}

export interface AppState {
  // Input state
  inputMode: InputMode
  setInputMode: (mode: InputMode) => void
  
  // URL state
  url: string
  setUrl: (url: string) => void
  
  // File state
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  
  // Content state
  extractedContent: string
  setExtractedContent: (content: string) => void
  
  // Voice state
  selectedVoice: VoiceOption | null
  setSelectedVoice: (voice: VoiceOption | null) => void
  availableVoices: VoiceOption[]
  setAvailableVoices: (voices: VoiceOption[]) => void
  
  // TTS Engine state
  ttsEngine: TTSEngine
  setTTSEngine: (engine: TTSEngine) => void
  
  // Hugging Face configuration
  huggingFaceApiKey: string
  setHuggingFaceApiKey: (apiKey: string) => void
  
  // Process mode
  processMode: ProcessMode
  setProcessMode: (mode: ProcessMode) => void
  
  // Audio state
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  currentUtterance: SpeechSynthesisUtterance | null
  setCurrentUtterance: (utterance: SpeechSynthesisUtterance | null) => void
  currentAudio: HTMLAudioElement | null
  setCurrentAudio: (audio: HTMLAudioElement | null) => void
  
  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  
  // Reader state
  showReaderView: boolean
  setShowReaderView: (show: boolean) => void
  currentWordIndex: number
  setCurrentWordIndex: (index: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Input state
  inputMode: 'url',
  setInputMode: (mode) => set({ inputMode: mode }),
  
  // URL state
  url: '',
  setUrl: (url) => set({ url }),
  
  // File state
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  
  // Content state
  extractedContent: '',
  setExtractedContent: (content) => set({ extractedContent: content }),
  
  // Voice state
  selectedVoice: null,
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  availableVoices: [],
  setAvailableVoices: (voices) => set({ availableVoices: voices }),
  
  // TTS Engine state
  ttsEngine: 'huggingface', // Default to Hugging Face TTS
  setTTSEngine: (engine) => set({ ttsEngine: engine }),
  
  // Hugging Face configuration
  huggingFaceApiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || localStorage.getItem('huggingface_api_key') || '',
  setHuggingFaceApiKey: (apiKey) => {
    localStorage.setItem('huggingface_api_key', apiKey)
    set({ huggingFaceApiKey: apiKey })
  },
  
  // Process mode
  processMode: 'stream',
  setProcessMode: (mode) => set({ processMode: mode }),
  
  // Audio state
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  currentUtterance: null,
  setCurrentUtterance: (utterance) => set({ currentUtterance: utterance }),
  currentAudio: null,
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
  
  // Reader state
  showReaderView: false,
  setShowReaderView: (show) => set({ showReaderView: show }),
  currentWordIndex: 0,
  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),
}))
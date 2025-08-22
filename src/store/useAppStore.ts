import { create } from 'zustand'

export type InputMode = 'url' | 'file'
export type ProcessMode = 'generate' | 'stream'

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
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void
  availableVoices: SpeechSynthesisVoice[]
  setAvailableVoices: (voices: SpeechSynthesisVoice[]) => void
  
  // Process mode
  processMode: ProcessMode
  setProcessMode: (mode: ProcessMode) => void
  
  // Audio state
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  currentUtterance: SpeechSynthesisUtterance | null
  setCurrentUtterance: (utterance: SpeechSynthesisUtterance | null) => void
  
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
  
  // Process mode
  processMode: 'stream',
  setProcessMode: (mode) => set({ processMode: mode }),
  
  // Audio state
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  currentUtterance: null,
  setCurrentUtterance: (utterance) => set({ currentUtterance: utterance }),
  
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
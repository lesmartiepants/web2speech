import { Play, Music } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function ActionBar({ onStart }: { onStart: () => void }) {
  const { extractedContent, processMode, ttsEngine, selectedVoice } = useAppStore()

  if (!extractedContent.trim()) return null

  const wordCount = extractedContent.split(/\s+/).filter(Boolean).length
  const minRead = Math.ceil(wordCount / 200)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 safe-area-bottom">
        <div className="glass-morphism-strong rounded-3xl border border-white/20 p-4 soft-shadow">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center">
                {processMode === 'generate' ? <Music className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">
                  {processMode === 'generate' ? (ttsEngine === 'huggingface' ? 'Generate Audio (Kokoro-82M)' : 'Generate Audio') : 'Start Reading Experience'}
                </p>
                <p className="text-gray-300 text-sm truncate">
                  {wordCount} words • ~{minRead} min • {selectedVoice ? selectedVoice.name : 'Voice not selected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onStart} className="btn-primary px-6 py-4 rounded-2xl font-bold">
                {processMode === 'generate' ? (ttsEngine === 'huggingface' ? 'Generate Audio (Kokoro-82M)' : 'Generate Audio') : 'Start Reading'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
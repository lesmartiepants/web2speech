import { useAppStore } from '../store/useAppStore'

export default function NeoActionBar({ onStart }: { onStart: () => void }) {
  const { extractedContent, selectedFile } = useAppStore()
  const canStart = Boolean(selectedFile || extractedContent.trim())
  const words = extractedContent.trim() ? extractedContent.split(/\s+/).length : 0
  const mins = words ? Math.ceil(words / 200) : 0
  return (
    <div className="sticky bottom-0 pt-6 bg-gradient-to-t from-[#f9fafb] to-transparent">
      <div className="card p-4 flex items-center justify-between">
        <div className="text-ink/80">{canStart ? `~${mins} min • ${words} words` : 'Upload a file or extract content to enable Start'}</div>
        <div className="flex gap-2">
          <button onClick={onStart} disabled={!canStart} className="btn btn-primary">Start</button>
        </div>
      </div>
    </div>
  )
}
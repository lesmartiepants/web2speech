import { useAppStore } from '../store/useAppStore'

export default function NeoPreview() {
  const { extractedContent } = useAppStore()
  const words = extractedContent.trim() ? extractedContent.split(/\s+/).length : 0
  const mins = words ? Math.ceil(words / 200) : 0
  const snippet = extractedContent ? extractedContent.slice(0, 500) : 'Content snippet…'
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Preview</div>
        <div className="text-sm text-ink/70">{mins ? `~${mins} min • ${words} words` : '~0 min • 0 words'}</div>
      </div>
      <div className="field mt-3 h-32 overflow-auto text-ink whitespace-pre-wrap">{snippet}</div>
    </section>
  )
}
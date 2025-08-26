import { useAppStore } from '../store/useAppStore'

export default function NeoModes() {
  const { processMode, setProcessMode } = useAppStore()
  return (
    <section className="grid md:grid-cols-2 gap-6">
      <button
        onClick={() => setProcessMode('generate')}
        className="card p-6 text-left hover:translate-y-[-2px] transition-transform"
      >
        <div className="text-xl font-bold mb-1">Generate & Download</div>
        <div className="text-ink/80">Create audio files for offline listening.</div>
        <div className="mt-2 text-xs">{processMode === 'generate' ? 'Selected' : ''}</div>
      </button>
      <button
        onClick={() => setProcessMode('stream')}
        className="card p-6 text-left hover:translate-y-[-2px] transition-transform"
      >
        <div className="text-xl font-bold mb-1">Read & Listen</div>
        <div className="text-ink/80">Interactive reader with synced playback.</div>
        <div className="mt-2 text-xs">{processMode === 'stream' ? 'Selected' : ''}</div>
      </button>
    </section>
  )
}
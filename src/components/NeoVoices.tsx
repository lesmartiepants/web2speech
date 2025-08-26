import { useAppStore } from '../store/useAppStore'

export default function NeoVoices() {
  const { selectedVoice } = useAppStore()
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-bold">Voice</div>
        <button className="btn">Test</button>
      </div>
      <div className="field text-ink/80">
        {selectedVoice ? `${selectedVoice.name} (${selectedVoice.language})` : 'Choose a voice…'}
      </div>
    </section>
  )
}
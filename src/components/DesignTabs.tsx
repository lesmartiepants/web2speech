import { useState } from 'react'

type TabKey = 'live' | 'option-a' | 'option-b' | 'option-c' | 'option-d'

const TABS: { key: TabKey; label: string; href?: string }[] = [
  { key: 'live', label: 'Live App' },
  { key: 'option-a', label: 'Option A', href: '/design-previews/option-a.html' },
  { key: 'option-b', label: 'Option B', href: '/design-previews/option-b.html' },
  { key: 'option-c', label: 'Option C', href: '/design-previews/option-c.html' },
  { key: 'option-d', label: 'Option D', href: '/design-previews/option-d.html' },
]

export default function DesignTabs() {
  const [active, setActive] = useState<TabKey>('live')
  const activeTab = TABS.find(t => t.key === active)

  return (
    <section className="glass-morphism rounded-3xl p-4 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active === tab.key
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab?.href && (
          <a
            href={activeTab.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-3 py-2 rounded-xl text-sm"
          >
            Open in new tab
          </a>
        )}
      </div>

      {activeTab?.href ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-dark-800/40" style={{height: 720}}>
          <iframe
            title={activeTab.label}
            src={activeTab.href}
            className="w-full h-full"
            style={{ border: '0' }}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-400">Viewing the live app. Select a design option to preview the alternate UI in an embedded frame.</p>
      )}
    </section>
  )
}
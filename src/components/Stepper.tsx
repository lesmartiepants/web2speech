import { Check, Globe, Mic, Eye, Download } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function Stepper() {
  const { extractedContent, selectedVoice, processMode } = useAppStore()

  const hasContent = extractedContent.trim().length > 0
  const hasVoice = Boolean(selectedVoice)
  const hasMode = processMode === 'stream' || processMode === 'generate'

  const steps = [
    { id: 'input', label: 'Input', icon: Globe },
    { id: 'voices', label: 'Voice', icon: Mic },
    { id: 'mode', label: 'Mode', icon: Eye },
    { id: 'preview', label: 'Preview', icon: Download },
  ]

  const completion = [hasContent, hasVoice, hasMode, hasContent]

  return (
    <nav aria-label="Progress" className="glass-morphism rounded-3xl p-4 overflow-x-auto snap-x snap-mandatory">
      <ol className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const done = completion[index]
          return (
            <li key={step.id} className="snap-start min-w-[220px] md:min-w-0">
              <a href={`#${step.id}`} className="group block">
                <div className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                  done ? 'bg-white/10 border border-white/20 soft-shadow' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    done ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' : 'bg-white/10 text-gray-300'
                  }`}>
                    {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${done ? 'text-white' : 'text-gray-300'}`}>{step.label}</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${done ? 'w-full bg-gradient-to-r from-primary-400 to-accent-500' : 'w-[30%] bg-white/20'}`}></div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
import { Star } from 'lucide-react'

interface MobileSplashProps {
  onGetStarted?: () => void
}

export default function MobileSplash({ onGetStarted }: MobileSplashProps) {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-morphism text-white/90 text-sm border border-white/30">
              <span className="w-2 h-2 rounded-full bg-accent-400 mr-2 animate-pulse"></span>
              Looks and feels like a native iPhone app
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Elevate your listening
              <span className="block gradient-text">with a gorgeous mobile UI</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-xl">
              A delightful iOS-inspired splash experience greets users on open. Smooth corners, subtle depth, and friendly micro-interactions set the tone before you start converting content to beautiful speech.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[360px] h-[740px] bg-black/80 rounded-[48px] p-2 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
              <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-b from-[#f9f9fb] to-[#f1f2f6]">
                {/* Notch */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1 w-40 h-7 bg-black rounded-b-[22px]"></div>

                {/* Status bar */}
                <div className="relative flex items-center justify-between px-5 pt-5 text-[13px] text-black/70 font-semibold">
                  <span>19:27</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-black/70"></span>
                    <span className="inline-block w-3 h-1.5 rounded-sm bg-black/70"></span>
                    <span className="inline-block w-5 h-1.5 rounded-sm bg-black/70"></span>
                  </div>
                </div>

                {/* Hero image / header card */}
                <div className="relative px-6 pt-6">
                  <div className="relative h-[280px] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-100 to-rose-100"></div>
                    {/* Optional photo */}
                    <img
                      src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"
                      alt="Hero"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                      loading="eager"
                    />
                  </div>

                  {/* Floating action dots */}
                  <div className="absolute top-7 left-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center">–</div>
                  <div className="absolute top-7 right-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center">+</div>
                </div>

                {/* Content card */}
                <div className="mt-4 px-6">
                  <div className="bg-white rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-black">Beautiful Speech</h3>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                    <p className="text-black/60 mt-2 text-sm">Turn articles and PDFs into a premium audio experience.</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl p-4 bg-green-100">
                        <div className="w-6 h-6 rounded-full bg-white/80 mb-3"></div>
                        <div className="text-[13px] text-black/60">Mode</div>
                        <div className="font-semibold">Paste URL</div>
                      </div>
                      <div className="rounded-2xl p-4 bg-gray-100">
                        <div className="w-6 h-6 rounded-full bg-white/80 mb-3"></div>
                        <div className="text-[13px] text-black/60">Mode</div>
                        <div className="font-semibold">Upload File</div>
                      </div>
                    </div>

                    <button
                      onClick={onGetStarted}
                      className="mt-6 w-full rounded-2xl h-12 text-white font-semibold bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg active:scale-[0.98] transition-transform"
                    >
                      Get Started
                    </button>
                  </div>
                </div>

                {/* Bottom safe-area bump */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
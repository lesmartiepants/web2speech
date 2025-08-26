import { useAppStore } from './store/useAppStore'
import Header from './components/Header'
import ReaderView from './components/ReaderView'
import ErrorDisplay from './components/ErrorDisplay'
import HuggingFaceTTSService from './services/huggingface'
import DesignTabs from './components/DesignTabs'
import NeoInput from './components/NeoInput'
import NeoVoices from './components/NeoVoices'
import NeoModes from './components/NeoModes'
import NeoPreview from './components/NeoPreview'
import NeoActionBar from './components/NeoActionBar'

function App() {
	const { 
		extractedContent, 
		processMode, 
		ttsEngine,
		selectedVoice,
		huggingFaceApiKey,
		setShowReaderView,
		setError
	} = useAppStore()

	const handleStartReading = async () => {
		if (processMode === 'stream' && extractedContent.trim()) {
			setShowReaderView(true)
		} else if (processMode === 'generate' && extractedContent.trim()) {
			try {
				if (ttsEngine === 'huggingface' && huggingFaceApiKey && selectedVoice) {
					const service = new HuggingFaceTTSService({
						apiKey: huggingFaceApiKey
					})
					
					const result = await service.generateAudio({
						text: extractedContent,
						voice: selectedVoice.id
					})
					
					const link = document.createElement('a')
					link.href = result.audioUrl
					link.download = `web2speech-audio-${Date.now()}.wav`
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					
					setTimeout(() => {
						URL.revokeObjectURL(result.audioUrl)
					}, 1000)
				} else {
					alert(`Audio generation is available with Hugging Face Kokoro-82M TTS.\n\nCurrent setup: ${ttsEngine === 'webspeech' ? 'Browser TTS (streaming only)' : 'Hugging Face TTS'}\n${ttsEngine === 'huggingface' && !huggingFaceApiKey ? 'Please configure your API key to use audio generation.' : ''}\n\nFor high-quality downloadable audio files, select Hugging Face Kokoro-82M as your TTS engine.`)
				}
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Audio generation failed')
			}
		}
	}

	return (
		<div id="top" className="min-h-screen theme-option-b">
			<Header />
			
			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-40">
				{/* Hero */}
				<section className="flex items-end justify-between gap-4">
					<div>
						<h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">Convert content to speech</h2>
						<p className="mt-3 text-lg text-gray-500 max-w-2xl">Clean, fast, and focused. Paste a URL or upload a file to start.</p>
					</div>
					<div className="hidden md:block text-right text-sm text-gray-500">PWA • Offline • Fast</div>
				</section>

				<DesignTabs />

				<ErrorDisplay />
				
				<NeoInput />
				
				{extractedContent && (
					<>
						<NeoVoices />
						<NeoModes />
						<NeoPreview />
					</>
				)}
			</main>
			
			<NeoActionBar onStart={handleStartReading} />
			<ReaderView />
			
			<footer className="mt-24">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center space-y-4">
						<p className="text-lg text-white font-medium">Built for clarity and speed</p>
						<p className="text-gray-500">React • TypeScript • Tailwind • Web Speech • Hugging Face</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default App

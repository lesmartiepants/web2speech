import React, { useCallback, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import HeaderOptionB from './components/HeaderOptionB'
import NeoVoices from './components/NeoVoices'
import NeoModes from './components/NeoModes'
import NeoPreview from './components/NeoPreview'
import NeoActionBar from './components/NeoActionBar'
import ReaderView from './components/ReaderView'
import HuggingFaceTTSService from './services/huggingface'

export default function AppOptionB() {
	const {
		inputMode,
		setInputMode,
		url,
		setUrl,
		selectedFile,
		setSelectedFile,
		setExtractedContent,
		setIsLoading,
		setError,
		isLoading,
		extractedContent,
		processMode,
		ttsEngine,
		selectedVoice,
		huggingFaceApiKey,
		setShowReaderView
	} = useAppStore()

	const [localUrl, setLocalUrl] = useState(url)

	const extractFromUrl = useCallback(async () => {
		if (!localUrl.trim()) return
		setIsLoading(true)
		setError(null)
		try {
			setUrl(localUrl.trim())
			setTimeout(() => {
				setExtractedContent(`Sample extracted content from: ${localUrl}`)
				setIsLoading(false)
			}, 1000)
		} catch (e) {
			setError('Failed to extract content from URL.')
			setIsLoading(false)
		}
	}, [localUrl, setUrl, setExtractedContent, setIsLoading, setError])

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0]
		if (!file) return
		setSelectedFile(file)
		setIsLoading(true)
		setError(null)
		if (file.type === 'text/plain') {
			file.text().then(text => {
				setExtractedContent(text)
				setIsLoading(false)
			}).catch(() => {
				setError('Failed to read file content')
				setIsLoading(false)
			})
		} else if (file.type === 'application/pdf') {
			setTimeout(() => {
				setExtractedContent(`Simulated text extracted from PDF: ${file.name}`)
				setIsLoading(false)
			}, 1200)
		} else {
			setIsLoading(false)
			setError('Unsupported file type')
		}
	}

	const handleStartReading = useCallback(async () => {
		if (processMode === 'stream' && extractedContent.trim()) {
			setShowReaderView(true)
		} else if (processMode === 'generate' && extractedContent.trim()) {
			try {
				if (ttsEngine === 'huggingface' && huggingFaceApiKey && selectedVoice) {
					const service = new HuggingFaceTTSService({ apiKey: huggingFaceApiKey })
					const result = await service.generateAudio({ text: extractedContent, voice: selectedVoice.id })
					const link = document.createElement('a')
					link.href = result.audioUrl
					link.download = `web2speech-audio-${Date.now()}.wav`
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					setTimeout(() => { URL.revokeObjectURL(result.audioUrl) }, 1000)
				} else {
					alert(`Audio generation is available with Hugging Face Kokoro-82M TTS.\n\nCurrent setup: ${ttsEngine === 'webspeech' ? 'Browser TTS (streaming only)' : 'Hugging Face TTS'}\n${ttsEngine === 'huggingface' && !huggingFaceApiKey ? 'Please configure your API key to use audio generation.' : ''}\n\nFor high-quality downloadable audio files, select Hugging Face Kokoro-82M as your TTS engine.`)
				}
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Audio generation failed')
			}
		}
	}, [processMode, extractedContent, ttsEngine, huggingFaceApiKey, selectedVoice, setShowReaderView, setError])

	return (
		<div className="min-h-screen theme-option-b">
			<HeaderOptionB />
			<main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
				<section className="flex items-end justify-between gap-4">
					<div>
						<h1 className="text-4xl md:text-6xl font-black leading-none">Turn text into audio</h1>
						<p className="mt-3 text-lg max-w-2xl">A crisp, bold interface with chunky borders and instant affordances.</p>
					</div>
					<div className="hidden md:block text-right text-sm">PWA • Installable • Fast</div>
				</section>

				{/* URL/File segmented toggle */}
				<div className="grid grid-cols-2 gap-2 max-w-md">
					<button onClick={() => setInputMode('url')} className="btn btn-ghost">URL</button>
					<button onClick={() => setInputMode('file')} className="btn btn-ghost">File</button>
				</div>

				<section id="input" className="grid md:grid-cols-2 gap-6">
					<div className="card p-6" style={{ display: inputMode === 'url' ? 'block' : 'none' }}>
						<div className="text-xl font-bold mb-3">URL</div>
						<div className="grid grid-cols-[1fr_auto] gap-3">
							<input
								placeholder="https://example.com/article"
								className="field"
								value={localUrl}
								onChange={(e) => setLocalUrl(e.target.value)}
								disabled={isLoading}
							/>
							<button onClick={extractFromUrl} className="btn btn-primary" disabled={!localUrl.trim() || isLoading}>
								{isLoading ? 'Extracting…' : 'Extract'}
							</button>
						</div>
					</div>
					<div className="card p-6" style={{ display: inputMode === 'file' ? 'block' : 'none' }}>
						<div className="text-xl font-bold mb-3">File</div>
						<label className="field h-28 grid place-items-center cursor-pointer">
							<input type="file" onChange={onFileChange} className="hidden" />
							<span>{selectedFile ? selectedFile.name : 'Drag & drop or browse'}</span>
						</label>
					</div>
				</section>

				<NeoVoices />
				<NeoModes />
				<NeoPreview />
			</main>

			<NeoActionBar onStart={handleStartReading} />
			<ReaderView />
		</div>
	)
}
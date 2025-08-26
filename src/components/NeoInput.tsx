import { useCallback, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function NeoInput() {
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
    isLoading
  } = useAppStore()

  const [localUrl, setLocalUrl] = useState(url)

  const extractFromUrl = useCallback(async () => {
    if (!localUrl.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      // Simulated extraction
      setUrl(localUrl.trim())
      setTimeout(() => {
        setExtractedContent(`Sample extracted content from: ${localUrl}`)
        setIsLoading(false)
      }, 1200)
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

  return (
    <section className="space-y-6">
      {/* Segmented toggle */}
      <div className="pill w-fit">
        <button
          onClick={() => setInputMode('url')}
          className={inputMode === 'url' ? 'active' : ''}
        >URL</button>
        <button
          onClick={() => setInputMode('file')}
          className={inputMode === 'file' ? 'active' : ''}
        >File</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* URL card */}
        <div className="card p-6">
          <div className="text-xl font-bold mb-3">URL</div>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <input
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="field"
              disabled={isLoading}
            />
            <button
              onClick={extractFromUrl}
              disabled={!localUrl.trim() || isLoading}
              className="btn btn-primary"
            >{isLoading ? 'Extracting…' : 'Extract'}</button>
          </div>
        </div>

        {/* File card */}
        <div className="card p-6">
          <div className="text-xl font-bold mb-3">File</div>
          <label className="field h-28 grid place-items-center cursor-pointer bg-white">
            <input type="file" onChange={onFileChange} className="hidden" />
            <span className="text-ink/80">
              {selectedFile ? selectedFile.name : 'Drag & drop or browse'}
            </span>
          </label>
        </div>
      </div>
    </section>
  )
}
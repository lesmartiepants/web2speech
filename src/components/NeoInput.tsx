import { useCallback, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { extractArticleFromUrl } from '../utils/urlExtraction'
import { extractTextFromPdf } from '../utils/pdfExtraction'
import DOMPurify from 'dompurify'

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
    isLoading,
    setArticleTitle,
    setArticleByline,
    setArticleHtml,
  } = useAppStore()

  const [localUrl, setLocalUrl] = useState(url)

  const extractFromUrl = useCallback(async () => {
    if (!localUrl.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const article = await extractArticleFromUrl(localUrl.trim())
      setUrl(localUrl.trim())
      setExtractedContent(article.text)
      setArticleTitle(article.title)
      setArticleByline(article.byline)
      setArticleHtml(article.html)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to extract content from URL.')
    } finally {
      setIsLoading(false)
    }
  }, [localUrl, setUrl, setExtractedContent, setIsLoading, setError, setArticleTitle, setArticleByline, setArticleHtml])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setIsLoading(true)
    setError(null)

    const toArticle = (title: string, text: string) => {
      const html = text
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`) 
        .join('\n')
      setArticleTitle(title)
      setArticleByline(null)
      setArticleHtml(DOMPurify.sanitize(html))
      setExtractedContent(text)
    }

    if (file.type === 'text/plain') {
      file.text().then(text => {
        toArticle(file.name, text)
        setIsLoading(false)
      }).catch(() => {
        setError('Failed to read file content')
        setIsLoading(false)
      })
    } else if (file.type === 'application/pdf') {
      extractTextFromPdf(file)
        .then(text => toArticle(file.name, text))
        .catch(() => setError('Failed to extract text from PDF'))
        .finally(() => setIsLoading(false))
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
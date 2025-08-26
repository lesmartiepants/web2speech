export async function extractTextFromUrl(inputUrl: string): Promise<string> {
  const normalizedUrl = normalizeUrl(inputUrl)

  // 1) Try Jina AI Reader proxy (great CORS-free readability extraction)
  try {
    const jinaUrl = `https://r.jina.ai/http://${normalizedUrl.replace(/^https?:\/\//, '')}`
    const res = await fetch(jinaUrl)
    if (res.ok) {
      const text = await res.text()
      if (text && text.trim().length > 0) return text.trim()
    }
  } catch {}

  // 2) Fallback: direct fetch and Readability (will work only if CORS allows)
  try {
    const res = await fetch(normalizedUrl, { credentials: 'omit' })
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')

    // Use Readability if available globally; otherwise simple text fallback
    // @ts-ignore
    const ReadabilityCtor = (window as any).Readability || undefined
    if (ReadabilityCtor) {
      // @ts-ignore
      const reader = new ReadabilityCtor(doc)
      const article = reader.parse()
      if (article && article.textContent) {
        return article.textContent.trim()
      }
    }

    const bodyText = doc.body?.textContent || ''
    if (bodyText.trim().length > 0) return bodyText.trim()
  } catch {}

  throw new Error('Failed to extract content from URL. The site may block cross-origin access.')
}

function normalizeUrl(input: string): string {
  try {
    const hasProtocol = /^(https?:)?\/\//i.test(input)
    return hasProtocol ? input : `https://${input}`
  } catch {
    return input
  }
}
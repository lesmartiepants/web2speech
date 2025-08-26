import DOMPurify from 'dompurify'

export interface ExtractedArticle {
  title: string
  byline: string | null
  html: string
  text: string
}

export async function extractArticleFromUrl(inputUrl: string): Promise<ExtractedArticle> {
  const normalizedUrl = normalizeUrl(inputUrl)

  // 1) Try Jina AI Reader proxy for CORS-safe extraction
  try {
    const jinaUrl = `https://r.jina.ai/http://${normalizedUrl.replace(/^https?:\/\//, '')}`
    const res = await fetch(jinaUrl)
    if (res.ok) {
      const text = (await res.text()).trim()
      if (text) {
        const { titleGuess, bylineGuess } = guessMetadataFromUrl(normalizedUrl)
        const html = textToHtml(text)
        return {
          title: titleGuess,
          byline: bylineGuess,
          html: DOMPurify.sanitize(html),
          text
        }
      }
    }
  } catch {}

  // 2) Fallback: direct fetch and heuristic parsing (no external API)
  try {
    const res = await fetch(normalizedUrl, { credentials: 'omit' })
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')

    // Try common article containers
    const candidate = doc.querySelector('article, main, [role="main"], .post, .content, #content')
    const contentNode = candidate || doc.body

    // Remove scripts/styles
    contentNode.querySelectorAll('script, style, noscript, iframe').forEach(n => n.remove())

    const title = (doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
      || doc.querySelector('title')?.textContent
      || '').trim()

    const byline = (doc.querySelector('meta[name="author"]')?.getAttribute('content')
      || doc.querySelector('[rel="author"]')?.textContent
      || null)

    const contentHtml = contentNode.innerHTML
    const textContent = contentNode.textContent || ''

    return {
      title: title || guessMetadataFromUrl(normalizedUrl).titleGuess,
      byline,
      html: DOMPurify.sanitize(contentHtml),
      text: textContent.trim()
    }
  } catch {}

  throw new Error('Failed to extract content from URL. The site may block cross-origin access.')
}

export async function extractTextFromUrl(inputUrl: string): Promise<string> {
  const article = await extractArticleFromUrl(inputUrl)
  return article.text
}

function normalizeUrl(input: string): string {
  try {
    const hasProtocol = /^(https?:)?\/\//i.test(input)
    return hasProtocol ? input : `https://${input}`
  } catch {
    return input
  }
}

function guessMetadataFromUrl(url: string): { titleGuess: string; bylineGuess: string | null } {
  try {
    const u = new URL(url)
    const hostname = u.hostname.replace(/^www\./, '')
    return { titleGuess: hostname, bylineGuess: hostname }
  } catch {
    return { titleGuess: 'Article', bylineGuess: null }
  }
}

function textToHtml(text: string): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
  const safeParas = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n')
  return safeParas
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
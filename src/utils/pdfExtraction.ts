import * as pdfjsLib from 'pdfjs-dist'

// Configure worker (Vite-friendly ESM worker URL)
// pdfjs-dist v5 ships ESM workers under build/pdf.worker.min.mjs
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  const pageTexts: string[] = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    const strings = textContent.items
      // @ts-ignore
      .map((item) => (item.str as string) || '')
    const pageText = strings.join(' ').replace(/\s+/g, ' ').trim()
    if (pageText) pageTexts.push(pageText)
  }

  return pageTexts.join('\n\n')
}
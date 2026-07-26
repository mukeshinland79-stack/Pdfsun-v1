import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export async function getPDFPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  try {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    return pdf.numPages
  } catch {
    return 0
  }
}

export async function renderPDFPage(
  arrayBuffer: ArrayBuffer,
  pageNumber: number,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.height = viewport.height
  canvas.width = viewport.width

  await page.render({ canvasContext: context, viewport }).promise
  return canvas
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

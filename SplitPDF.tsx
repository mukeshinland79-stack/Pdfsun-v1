import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { Scissors, Download, CheckCircle2, AlertCircle, FileOutput } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import ProgressBar from '@/components/ProgressBar'
import type { PDFFile } from '@/types'
import { downloadFile, formatFileSize } from '@/utils/pdfWorker'

export default function SplitPDF() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<PDFFile[]>([])
  const [splitMode, setSplitMode] = useState<'range' | 'extract'>('range')
  const [pageRange, setPageRange] = useState('')
  const [extractPages, setExtractPages] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [results, setResults] = useState<{ blob: Blob; name: string }[]>([])
  const [error, setError] = useState('')

  const handleFiles = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles.slice(0, 1))
    setResults([])
    setError('')
  }, [])

  const parseRange = (rangeStr: string, totalPages: number): number[] => {
    const pages: number[] = []
    const parts = rangeStr.split(',').map(s => s.trim())
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        for (let i = start; i <= end && i <= totalPages; i++) pages.push(i - 1)
      } else {
        const page = Number(part)
        if (page > 0 && page <= totalPages) pages.push(page - 1)
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b)
  }

  const split = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file')
      return
    }

    const file = files[0]
    if (!file.pageCount || file.pageCount === 0) {
      setError('Unable to read PDF page count')
      return
    }

    try {
      setError('')
      setResults([])
      setStatus('Loading PDF...')
      setProgress(10)

      const pdf = await PDFDocument.load(file.data)
      const totalPages = pdf.getPageCount()
      const outputFiles: { blob: Blob; name: string }[] = []

      if (splitMode === 'range') {
        if (!pageRange.trim()) {
          setError('Please enter a page range')
          return
        }
        const pages = parseRange(pageRange, totalPages)
        if (pages.length === 0) {
          setError('Invalid page range')
          return
        }

        setStatus('Extracting pages...')
        setProgress(30)
        const newPdf = await PDFDocument.create()
        for (let i = 0; i < pages.length; i++) {
          const [copiedPage] = await newPdf.copyPages(pdf, [pages[i]])
          newPdf.addPage(copiedPage)
          setProgress(30 + ((i + 1) / pages.length) * 60)
        }
        const bytes = await newPdf.save()
        outputFiles.push({
          blob: new Blob([bytes], { type: 'application/pdf' }),
          name: `extracted-${file.name.replace('.pdf', '')}.pdf`,
        })
      } else {
        if (!extractPages.trim()) {
          setError('Please enter pages to extract')
          return
        }
        const pages = parseRange(extractPages, totalPages)
        if (pages.length === 0) {
          setError('Invalid page numbers')
          return
        }

        setStatus('Creating individual PDFs...')
        for (let i = 0; i < pages.length; i++) {
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(pdf, [pages[i]])
          newPdf.addPage(copiedPage)
          const bytes = await newPdf.save()
          outputFiles.push({
            blob: new Blob([bytes], { type: 'application/pdf' }),
            name: `page-${pages[i] + 1}-${file.name.replace('.pdf', '')}.pdf`,
          })
          setProgress(((i + 1) / pages.length) * 90)
        }
      }

      setResults(outputFiles)
      setProgress(100)
      setStatus('Complete!')
    } catch (err: any) {
      setError(err.message || 'Failed to split PDF')
      setProgress(0)
      setStatus('')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('tools.split')}</h1>
            <p className="text-gray-500">Extract pages or split by range</p>
          </div>

          <FileUploader
            files={files}
            onFilesSelected={handleFiles}
            maxFiles={1}
            maxSize={100}
            multiple={false}
          />

          {files.length > 0 && files[0].pageCount && (
            <div className="mt-4 text-sm text-gray-500">
              Total pages: <span className="font-medium text-gray-900 dark:text-white">{files[0].pageCount}</span>
            </div>
          )}

          {/* Split Options */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 card p-6"
              >
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSplitMode('range')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      splitMode === 'range'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Extract Range
                  </button>
                  <button
                    onClick={() => setSplitMode('extract')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      splitMode === 'extract'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Individual Pages
                  </button>
                </div>

                {splitMode === 'range' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Page Range (e.g., 1-5, 8, 10-12)
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={e => setPageRange(e.target.value)}
                      placeholder="1-3, 5, 7-10"
                      className="input-field"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pages to Extract (e.g., 1, 3, 5)
                    </label>
                    <input
                      type="text"
                      value={extractPages}
                      onChange={e => setExtractPages(e.target.value)}
                      placeholder="1, 3, 5"
                      className="input-field"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          {status && progress > 0 && progress < 100 && (
            <div className="mt-6">
              <ProgressBar progress={progress} status={status} />
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {files.length > 0 && results.length === 0 && (
              <button onClick={split} className="btn-primary">
                <Scissors className="w-4 h-4 mr-2" /> Split PDF
              </button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Split complete! {results.length} file(s) ready</span>
                </div>
                <div className="space-y-2">
                  {results.map((result, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
                      <div className="flex items-center gap-3">
                        <FileOutput className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{result.name}</span>
                        <span className="text-xs text-gray-500">{formatFileSize(result.blob.size)}</span>
                      </div>
                      <button
                        onClick={() => downloadFile(result.blob, result.name)}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        <Download className="w-4 h-4 mr-1" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

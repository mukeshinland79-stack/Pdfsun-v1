import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { ArrowUp, ArrowDown, Trash2, Download, CheckCircle2, AlertCircle, Combine } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import ProgressBar from '@/components/ProgressBar'
import type { PDFFile } from '@/types'
import { downloadFile, formatFileSize } from '@/utils/pdfWorker'

export default function MergePDF() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<PDFFile[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState('')

  const handleFiles = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles)
    setResult(null)
    setError('')
  }, [])

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newFiles.length) return
    ;[newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
    setFiles(newFiles)
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const merge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      return
    }

    try {
      setError('')
      setStatus('Merging PDFs...')
      setProgress(10)

      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const pdf = await PDFDocument.load(file.data)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
        setProgress(10 + ((i + 1) / files.length) * 80)
      }

      setProgress(90)
      setStatus('Finalizing...')
      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      setResult(blob)
      setProgress(100)
      setStatus('Complete!')
    } catch (err: any) {
      setError(err.message || 'Failed to merge PDFs')
      setProgress(0)
      setStatus('')
    }
  }

  const downloadResult = () => {
    if (result) {
      downloadFile(result, `merged-${Date.now()}.pdf`)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
              <Combine className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('tools.merge')}</h1>
            <p className="text-gray-500">Combine multiple PDFs into a single document</p>
          </div>

          <FileUploader
            files={files}
            onFilesSelected={handleFiles}
            maxFiles={20}
            maxSize={100}
            multiple
          />

          {/* File Reorder */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Arrange Order</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      layout
                      className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-xs font-medium text-gray-500">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
            {files.length >= 2 && !result && (
              <button onClick={merge} className="btn-primary">
                <Combine className="w-4 h-4 mr-2" /> Merge PDFs
              </button>
            )}
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Merged successfully!</span>
                </div>
                <button onClick={downloadResult} className="btn-primary">
                  <Download className="w-4 h-4 mr-2" /> Download
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

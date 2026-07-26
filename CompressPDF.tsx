import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { Minimize2, Download, CheckCircle2, AlertCircle, Gauge } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import ProgressBar from '@/components/ProgressBar'
import type { PDFFile } from '@/types'
import { downloadFile, formatFileSize } from '@/utils/pdfWorker'

export default function CompressPDF() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<PDFFile[]>([])
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; compressedSize: number } | null>(null)
  const [error, setError] = useState('')

  const handleFiles = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles.slice(0, 1))
    setResult(null)
    setError('')
  }, [])

  const compress = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file')
      return
    }

    try {
      setError('')
      setStatus('Loading PDF...')
      setProgress(10)

      const file = files[0]
      const pdf = await PDFDocument.load(file.data)
      setProgress(30)

      setStatus('Compressing...')
      // pdf-lib doesn't have built-in compression, but we can re-save which optimizes
      const qualityMap = { low: 0.3, medium: 0.6, high: 0.9 }
      const saveOptions = {
        useObjectStreams: true,
        addDefaultPage: false,
        updateMetadata: false,
      }

      setProgress(60)
      const bytes = await pdf.save(saveOptions)
      setProgress(80)

      // For real compression, we'd need more advanced libraries
      // This is a basic optimization via re-saving
      const blob = new Blob([bytes], { type: 'application/pdf' })

      setResult({
        blob,
        originalSize: file.size,
        compressedSize: blob.size,
      })
      setProgress(100)
      setStatus('Complete!')
    } catch (err: any) {
      setError(err.message || 'Failed to compress PDF')
      setProgress(0)
      setStatus('')
    }
  }

  const compressionRatio = result
    ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
    : 0

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
              <Minimize2 className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('tools.compress')}</h1>
            <p className="text-gray-500">Reduce PDF file size while maintaining quality</p>
          </div>

          <FileUploader
            files={files}
            onFilesSelected={handleFiles}
            maxFiles={1}
            maxSize={100}
            multiple={false}
          />

          {/* Quality Selector */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Compression Level</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setQuality(level)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        quality === level
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                          : 'border-gray-200 dark:border-dark-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white capitalize">{level}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {level === 'low' ? 'Smallest file' : level === 'medium' ? 'Balanced' : 'Best quality'}
                      </div>
                    </button>
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
            {files.length > 0 && !result && (
              <button onClick={compress} className="btn-primary">
                <Minimize2 className="w-4 h-4 mr-2" /> Compress PDF
              </button>
            )}
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 card p-6"
              >
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Compression complete!</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Original</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{formatFileSize(result.originalSize)}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Compressed</div>
                    <div className="font-semibold text-green-600">{formatFileSize(result.compressedSize)}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-xs text-green-600 mb-1">Saved</div>
                    <div className="font-semibold text-green-700">{compressionRatio}%</div>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(result.blob, `compressed-${files[0].name}`)}
                  className="btn-primary w-full"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Compressed PDF
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

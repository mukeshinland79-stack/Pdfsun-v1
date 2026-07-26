import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { Upload, X, File, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PDFFile } from '@/types'
import { formatFileSize, generateId, getPDFPageCount } from '@/utils/pdfWorker'

interface FileUploaderProps {
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number // in MB
  onFilesSelected: (files: PDFFile[]) => void
  onFileRemoved?: (id: string) => void
  files: PDFFile[]
  multiple?: boolean
}

export default function FileUploader({
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 10,
  maxSize = 100,
  onFilesSelected,
  onFileRemoved,
  files,
  multiple = true,
}: FileUploaderProps) {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = []

    rejectedFiles.forEach(({ file, errors: fileErrors }) => {
      fileErrors.forEach((err: any) => {
        if (err.code === 'file-too-large') {
          newErrors.push(`${file.name} is too large (max ${maxSize}MB)`)
        } else if (err.code === 'file-invalid-type') {
          newErrors.push(`${file.name} has invalid file type`)
        } else {
          newErrors.push(`${file.name}: ${err.message}`)
        }
      })
    })

    if (files.length + acceptedFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
      setErrors(newErrors)
      return
    }

    const pdfFiles: PDFFile[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const pageCount = file.type === 'application/pdf' ? await getPDFPageCount(arrayBuffer) : 0
        return {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: arrayBuffer,
          url: URL.createObjectURL(file),
          pageCount,
        }
      })
    )

    setErrors(newErrors)
    onFilesSelected(multiple ? [...files, ...pdfFiles] : pdfFiles)
  }, [files, maxFiles, maxSize, multiple, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize: maxSize * 1024 * 1024,
    multiple,
  })

  const removeFile = (id: string) => {
    onFileRemoved?.(id)
    const newFiles = files.filter(f => f.id !== id)
    onFilesSelected(newFiles)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
            : 'border-gray-300 dark:border-dark-600 hover:border-brand-400 dark:hover:border-brand-500 bg-gray-50 dark:bg-dark-800/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-gray-100 dark:bg-dark-700'
          }`}>
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-brand-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop files here' : t('common.dragDrop')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('common.orBrowse')} — {t('common.maxSize')}: {maxSize}MB
            </p>
          </div>
          <p className="text-xs text-gray-400">
            {files.length > 0 ? `${files.length} file(s) selected` : `Up to ${maxFiles} files`}
          </p>
        </div>
      </div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 space-y-2"
          >
            {errors.map((error, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-2"
          >
            {files.map(file => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} {file.pageCount ? `• ${file.pageCount} pages` : ''}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

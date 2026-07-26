import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PDFDocument, StandardEncryption } from 'pdf-lib'
import { Shield, Download, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import ProgressBar from '@/components/ProgressBar'
import type { PDFFile } from '@/types'
import { downloadFile } from '@/utils/pdfWorker'

export default function ProtectPDF() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<PDFFile[]>([])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<Blob | null>(null)
  const [error, setError] = useState('')

  const handleFiles = useCallback((newFiles: PDFFile[]) => {
    setFiles(newFiles.slice(0, 1))
    setResult(null)
    setError('')
  }, [])

  const protect = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file')
      return
    }
    if (!password) {
      setError('Please enter a password')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    try {
      setError('')
      setStatus('Encrypting PDF...')
      setProgress(20)

      const file = files[0]
      const pdf = await PDFDocument.load(file.data)
      setProgress(50)

      const encrypted = await pdf.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      })
      setProgress(80)

      const bytes = await encrypted.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult(blob)
      setProgress(100)
      setStatus('Complete!')
    } catch (err: any) {
      setError(err.message || 'Failed to protect PDF')
      setProgress(0)
      setStatus('')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('tools.protect')}</h1>
            <p className="text-gray-500">Password protect your PDF documents</p>
          </div>

          <FileUploader
            files={files}
            onFilesSelected={handleFiles}
            maxFiles={1}
            maxSize={50}
            multiple={false}
          />

          {/* Password Input */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Set Password</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input-field pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="input-field"
                  />
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
              <button onClick={protect} className="btn-primary">
                <Shield className="w-4 h-4 mr-2" /> Protect PDF
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
                  <span className="font-medium">PDF protected successfully!</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Your PDF is now encrypted with a password. Anyone opening it will need to enter the password.
                </p>
                <button
                  onClick={() => downloadFile(result, `protected-${files[0].name}`)}
                  className="btn-primary w-full"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Protected PDF
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  status: string
  color?: string
}

export default function ProgressBar({ progress, status, color = 'bg-brand-600' }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{status}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

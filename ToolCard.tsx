import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { PDFTool } from '@/types'
import * as Icons from 'lucide-react'
import { useStore } from '@/hooks/useStore'
import { Star } from 'lucide-react'

type IconName = keyof typeof Icons

interface ToolCardProps {
  tool: PDFTool
  index?: number
  showFavorite?: boolean
}

export default function ToolCard({ tool, index = 0, showFavorite = true }: ToolCardProps) {
  const { favorites, toggleFavorite } = useStore()
  const isFav = favorites.includes(tool.id)
  const IconComponent = (Icons[tool.icon as IconName] || Icons.Wrench) as React.ComponentType<{ className?: string }>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={tool.path}
        className="group relative flex flex-col p-5 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200"
      >
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(tool.id)
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} />
          </button>
        )}
        <div className={`w-12 h-12 rounded-xl ${tool.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-4`}>
          <IconComponent className={`w-6 h-6 ${tool.color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
        {tool.supportsBatch && (
          <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 w-fit">
            Batch
          </span>
        )}
      </Link>
    </motion.div>
  )
}

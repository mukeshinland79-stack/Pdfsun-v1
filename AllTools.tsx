import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import ToolCard from '@/components/ToolCard'
import { tools, categories } from '@/utils/toolsData'
import AdBanner from '@/components/AdBanner'

export default function AllTools() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [search, setSearch] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredTools = useMemo(() => {
    let result = tools
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [search, activeCategory])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('tools.all')}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Discover all {tools.length}+ PDF tools to handle every document need
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <SlidersHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tools found matching "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section-padding py-8">
        <AdBanner position="middle" />
      </div>
    </div>
  )
}

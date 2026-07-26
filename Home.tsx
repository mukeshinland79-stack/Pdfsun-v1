import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Upload, Star, Zap, Shield, Globe, ChevronRight,
  FileText, Users, Download, Award, CheckCircle2
} from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import ToolCard from '@/components/ToolCard'
import AdBanner from '@/components/AdBanner'
import { tools, categories } from '@/utils/toolsData'
import type { PDFFile } from '@/types'
import { useStore } from '@/hooks/useStore'

export default function Home() {
  const { t } = useTranslation()
  const { recentFiles, addRecentFile } = useStore()
  const [heroFiles, setHeroFiles] = useState<PDFFile[]>([])
  const toolsRef = useRef<HTMLDivElement>(null)

  const handleHeroUpload = (files: PDFFile[]) => {
    setHeroFiles(files)
    files.forEach(addRecentFile)
  }

  const popularTools = tools.slice(0, 8)
  const studentTools = tools.filter(t => t.category === 'student' || ['merge', 'split', 'compress', 'rotate'].includes(t.id)).slice(0, 4)
  const aiTools = tools.filter(t => t.category === 'ai').slice(0, 4)

  const stats = [
    { icon: FileText, value: '50+', label: 'PDF Tools' },
    { icon: Users, value: '1M+', label: 'Active Users' },
    { icon: Download, value: '10M+', label: 'Files Processed' },
    { icon: Award, value: '99.9%', label: 'Uptime' },
  ]

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Student', text: 'PDFSun made my academic life so much easier. Merging lecture notes is a breeze!', avatar: 'RS' },
    { name: 'Priya Patel', role: 'Designer', text: 'The compression tool is incredible. Reduced my portfolio from 50MB to 2MB without quality loss.', avatar: 'PP' },
    { name: 'Amit Kumar', role: 'Developer', text: 'Clean UI, fast processing, and completely free. Best PDF tool suite on the internet.', avatar: 'AK' },
  ]

  const faqs = [
    { q: 'Is PDFSun completely free?', a: 'Yes! All our core PDF tools are 100% free to use. We also offer a premium plan with advanced features.' },
    { q: 'Are my files secure?', a: 'Absolutely. All file processing happens in your browser. Files are never uploaded to our servers.' },
    { q: 'What file formats are supported?', a: 'We support PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, and more.' },
    { q: 'Is there a file size limit?', a: 'Free users can process files up to 100MB. Premium users get up to 500MB per file.' },
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-orange-50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/30 dark:bg-brand-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-orange-200/30 dark:bg-orange-900/10 rounded-full blur-3xl" />

        <div className="relative section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
                <Star className="w-4 h-4" /> Free Online PDF Tools
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <FileUploader
                files={heroFiles}
                onFilesSelected={handleHeroUpload}
                maxFiles={5}
                maxSize={100}
              />
              {heroFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex justify-center gap-3"
                >
                  <Link to="/tools/merge" className="btn-primary">
                    Merge PDFs <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/tools/compress" className="btn-secondary">
                    Compress <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Supported Formats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500"
            >
              {['PDF', 'Word', 'Excel', 'PPT', 'JPG', 'PNG'].map(fmt => (
                <span key={fmt} className="px-3 py-1 rounded-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700">
                  {fmt}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div className="section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="section-padding py-8">
        <AdBanner position="middle" />
      </div>

      {/* Popular Tools */}
      <section ref={toolsRef} className="py-16">
        <div className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{t('tools.popular')}</h2>
              <p className="text-gray-500 mt-1">Most used PDF tools by our users</p>
            </div>
            <Link to="/tools" className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Tools */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
        <div className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{t('tools.student')}</h2>
              <p className="text-gray-500 mt-1">Perfect for students and educators</p>
            </div>
            <Link to="/student-tools" className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="py-16">
        <div className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{t('tools.ai')}</h2>
              <p className="text-gray-500 mt-1">Powered by artificial intelligence</p>
            </div>
            <Link to="/ai-tools" className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PDFSun?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">The most trusted PDF platform with enterprise-grade security and performance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Process PDFs in seconds with our optimized browser-based engine.' },
              { icon: Shield, title: '100% Secure', desc: 'Your files never leave your browser. No server uploads, ever.' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Compatible with all modern browsers and devices. No installation needed.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto card p-8 lg:p-12 text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Go Premium for More Power</h2>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto">Unlock batch processing, larger files, API access, and priority support.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pricing" className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors">
                View Pricing
              </Link>
              <span className="inline-flex items-center px-6 py-3 text-brand-200 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" /> 14-day free trial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
        <div className="section-padding">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="section-padding max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Files */}
      {recentFiles.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
          <div className="section-padding max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('common.recentFiles')}</h2>
            <div className="space-y-2">
              {recentFiles.slice(0, 5).map(file => (
                <div key={file.id} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span className="flex-1 text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">{file.pageCount} pages</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

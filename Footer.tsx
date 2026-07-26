import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Mail, Globe } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: t('nav.allTools'), to: '/tools' },
    { label: t('nav.pricing'), to: '/pricing' },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.support'), to: '/support' },
  ]

  const popularTools = [
    { label: 'Merge PDF', to: '/tools/merge' },
    { label: 'Split PDF', to: '/tools/split' },
    { label: 'Compress PDF', to: '/tools/compress' },
    { label: 'PDF to Word', to: '/tools/pdf-to-word' },
    { label: 'Protect PDF', to: '/tools/protect' },
  ]

  const resources = [
    { label: t('footer.privacy'), to: '/privacy' },
    { label: t('footer.terms'), to: '/terms' },
    { label: t('footer.cookies'), to: '/cookies' },
    { label: t('footer.refund'), to: '/refund' },
  ]

  return (
    <footer className="bg-dark-900 text-gray-300">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PDF<span className="text-brand-500">Sun</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Free, fast, and secure online PDF tools. Merge, split, compress, convert, and edit PDFs with ease.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:mukeshkalonia241@gmail.com" className="hover:text-brand-400 transition-colors">
                mukeshkalonia241@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
              <Globe className="w-4 h-4" />
              <span>PDFSUN.COM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.popularTools')}</h3>
            <ul className="space-y-2.5">
              {popularTools.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2.5">
              {resources.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-700">
        <div className="section-padding py-6">
          <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2 text-brand-400">
              <Heart className="w-4 h-4 fill-current" />
              <span>{t('footer.madeWith')} 🇮🇳</span>
            </div>
            <p>© {currentYear} PDFSUN.COM</p>
            <p className="text-xs">{t('footer.owner')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Menu, X, Search, Bell, Sun, Moon, ChevronDown,
  Home, Wrench, GraduationCap, Sparkles, CreditCard,
  BookOpen, HelpCircle, LayoutDashboard, Shield, User, LogOut, Settings
} from 'lucide-react'
import { useStore } from '@/hooks/useStore'
import { useTheme } from '@/hooks/useTheme'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { isLoggedIn, user, notifications, logout } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setLangOpen(false)
    setUserOpen(false)
    setNotifOpen(false)
  }, [location.pathname])

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/tools', label: t('nav.allTools'), icon: Wrench },
    { to: '/student-tools', label: t('nav.studentTools'), icon: GraduationCap },
    { to: '/ai-tools', label: t('nav.aiTools'), icon: Sparkles },
    { to: '/pricing', label: t('nav.pricing'), icon: CreditCard },
    { to: '/blog', label: t('nav.blog'), icon: BookOpen },
    { to: '/support', label: t('nav.support'), icon: HelpCircle },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-lg shadow-lg border-b border-gray-100 dark:border-dark-700'
        : 'bg-transparent'
    }`}>
      <div className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              PDF<span className="text-brand-600">Sun</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-brand-600 hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-48 lg:w-56 pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 border-0 text-sm focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            </form>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                title="Change Language"
              >
                <span className="text-lg">{languages.find(l => l.code === i18n.language)?.flag || '🌐'}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden animate-fade-in">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                        i18n.language === lang.code ? 'text-brand-600 font-medium bg-brand-50 dark:bg-brand-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Notifications */}
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700 font-semibold text-sm">
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-dark-700 text-sm ${n.read ? 'opacity-60' : ''}`}>
                          <div className="font-medium">{n.title}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700">
                      <div className="font-medium text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/') }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-700 animate-slide-up">
          <div className="section-padding py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-100 dark:border-dark-700 flex flex-col gap-2">
                <Link to="/login" className="btn-secondary text-center text-sm">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-center text-sm">{t('nav.register')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

import { useEffect } from 'react'
import { useStore } from './useStore'

export function useTheme() {
  const { theme, setTheme } = useStore()

  useEffect(() => {
    const saved = localStorage.getItem('pdfsun-storage')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.state?.theme) {
          document.documentElement.classList.toggle('dark', parsed.state.theme === 'dark')
        }
      } catch {}
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('pdfsun-storage')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    prefersDark.addEventListener('change', handleChange)
    return () => prefersDark.removeEventListener('change', handleChange)
  }, [setTheme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return { theme, toggleTheme }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, PDFFile, Notification } from '@/types'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  language: string
  notifications: Notification[]
  recentFiles: PDFFile[]
  favorites: string[]
  isLoggedIn: boolean

  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: string) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  addRecentFile: (file: PDFFile) => void
  toggleFavorite: (toolId: string) => void
  login: (user: User) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'light',
      language: 'en',
      notifications: [],
      recentFiles: [],
      favorites: [],
      isLoggedIn: false,

      setUser: (user) => set({ user }),
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      setLanguage: (language) => set({ language }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      addRecentFile: (file) =>
        set((state) => ({
          recentFiles: [file, ...state.recentFiles].slice(0, 20),
        })),
      toggleFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        })),
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'pdfsun-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        favorites: state.favorites,
        recentFiles: state.recentFiles,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)

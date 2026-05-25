/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type ThemeMode = 'dark' | 'light'
const STORAGE_KEY = 'chessverse-theme'

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark')

  useEffect(() => {
    const initialTheme = getPreferredTheme()
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="relative inline-flex h-11 w-20 items-center rounded-full border border-sky/20 bg-sky/10 p-1 text-sky shadow-sm transition-all duration-300 hover:border-sky/40 focus:outline-none focus:ring-2 focus:ring-sky/40"
    >
      <span
        className={`absolute left-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
          theme === 'dark' ? 'translate-x-[40px]' : 'translate-x-[-5px]'
        }`}
      />
      <Sun
        className={`absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          theme === 'light' ? 'text-sky' : 'text-slate-400'
        }`}
      />
      <Moon
        className={`absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-sky' : 'text-slate-600'
        }`}
      />
    </button>
  )
}

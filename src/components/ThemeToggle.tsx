import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

type ThemeMode = 'dark' | 'light'
// v2: the old key was written on every visit (including OS-detected light mode),
// so it can't tell a real choice apart; only explicit toggles are stored now
const STORAGE_KEY = 'chessverse-theme-v2'

// The <html> class is the single source of truth (index.html restores a saved choice before
// first paint). Every toggle instance — desktop navbar and mobile menu — reads it, so they can
// never disagree about the current theme.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}
const getTheme = (): ThemeMode => (document.documentElement.classList.contains('light') ? 'light' : 'dark')

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // storage unavailable (private mode etc.) — the theme still applies for this visit
  }
}

export default function ThemeToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark' as ThemeMode)
  const sm = size === 'sm'

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`relative inline-flex shrink-0 items-center rounded-full border border-sky/20 bg-sky/10 p-1 text-sky shadow-sm transition-all duration-300 hover:border-sky/40 focus:outline-none focus:ring-2 focus:ring-sky/40 ${
        sm ? 'h-9 w-16' : 'h-11 w-20'
      }`}
    >
      {/* knob slides over the active icon */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-300 ease-out ${
          sm ? 'h-7 w-7' : 'h-9 w-9'
        } ${theme === 'dark' ? (sm ? 'left-[calc(100%-2rem)]' : 'left-[calc(100%-2.5rem)]') : 'left-1'}`}
      />
      <Sun
        className={`absolute top-1/2 -translate-y-1/2 transition-colors duration-300 ${sm ? 'left-[0.6rem] h-3.5 w-3.5' : 'left-[0.9rem] h-4 w-4'} ${
          theme === 'light' ? 'text-sky' : 'text-slate-400'
        }`}
      />
      <Moon
        className={`absolute top-1/2 -translate-y-1/2 transition-colors duration-300 ${sm ? 'right-[0.6rem] h-3.5 w-3.5' : 'right-[0.9rem] h-4 w-4'} ${
          theme === 'dark' ? 'text-sky' : 'text-slate-600'
        }`}
      />
    </button>
  )
}

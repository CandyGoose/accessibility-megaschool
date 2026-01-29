import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'megaschool_theme'

const THEMES = ['light', 'dark', 'contrast']

function loadTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (THEMES.includes(t)) return t
  } catch {}
  return 'light'
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => loadTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function setTheme(value) {
    const next = THEMES.includes(value) ? value : THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  function toggleTheme() {
    setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length])
  }

  const value = { theme, setTheme, toggleTheme }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme used outside ThemeProvider')
  return ctx
}

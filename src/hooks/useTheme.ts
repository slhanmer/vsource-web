'use client'
import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const THEME_EVENT = 'theme-change'

const subscribe = (onChange: () => void) => {
  // 'storage' fires cross-tab only; the custom event covers same-tab writes.
  window.addEventListener('storage', onChange)
  window.addEventListener(THEME_EVENT, onChange)

  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(THEME_EVENT, onChange)
  }
}

const getSnapshot = (): Theme => (localStorage.getItem('theme') as Theme) || 'light'

// SSR has no localStorage; matches the pre-hydration document default.
const getServerSnapshot = (): Theme => 'light'

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  return { theme, toggle }
}

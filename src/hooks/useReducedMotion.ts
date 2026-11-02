'use client'
import { useSyncExternalStore } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

// One MediaQueryList for the whole app, created on first use in the browser.
let mql: MediaQueryList | null = null
const media = () => (mql ??= window.matchMedia(REDUCED_QUERY))

const subscribe = (onChange: () => void) => {
  const query = media()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const read = () => media().matches
// The server cannot know, so it renders the moving version; the client
// corrects on hydration if the reader has asked for less motion.
const readServer = () => false

/**
 * Whether the reader has asked for reduced motion. Live: it updates if the OS
 * setting changes while the page is open.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, read, readServer)
}

'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import './styles/themeSwitch.scss'

/**
 * Light/dark switch. State lives on `<html data-theme>` (set before paint by the
 * inline script in layout.tsx); this reads it back rather than mirroring it.
 *
 * The transition is a soft-edged pool of light opening from the centre of the
 * viewport, or closing back to it. Three constraints on any change here:
 *
 *   - No opacity animation, and no hard clip. Both read as a flash.
 *   - No repeated luminance reversals. WCAG 2.3.1 (Level A) allows three
 *     flashes a second, and a full-viewport theme is well over threshold.
 *   - The re-entry guard stays. Without it a fast clicker strobes the screen,
 *     which is the same problem from the other end.
 */

type Theme = 'dark' | 'light'

type ViewTransition = { ready: Promise<void>; finished: Promise<void> }
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition
}

const ON_MS = 340
const OFF_MS = 280

const MASK_SHUT = '1px 1px'

/** Must match the first colour stop of the mask gradient in global.scss. */
const MASK_OPAQUE_STOP = 0.7

/**
 * Mask box, in px, that puts the gradient's opaque core exactly on the furthest
 * corner. Percentages cannot do this: `closest-side` measures the SHORTER axis,
 * so the corners finish translucent and snap to full when the snapshot is torn
 * down — a flash at the end of every transition.
 */
const maskOpen = (): string => {
  const reach = Math.hypot(window.innerWidth / 2, window.innerHeight / 2)
  const side = Math.ceil(((2 * reach) / MASK_OPAQUE_STOP) * 1.04)
  return `${side}px ${side}px`
}

const subscribe = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

const readTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'

const readServerTheme = (): Theme => 'dark'

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme)
  const isOn = theme === 'light'
  const running = useRef(false)

  const onToggle = useCallback(() => {
    if (running.current) return

    const next: Theme = readTheme() === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    const apply = () => {
      root.setAttribute('data-theme', next)
      try {
        window.localStorage.setItem('theme', next)
      } catch {
        // Storage disabled: the theme changes, it just is not remembered.
      }
    }

    const doc = document as ViewTransitionDocument
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof doc.startViewTransition !== 'function') {
      apply()
      return
    }

    // Tells global.scss which snapshot to stack on top and mask.
    const direction = next === 'light' ? 'on' : 'off'
    root.dataset.lights = direction
    running.current = true

    const open = maskOpen()
    const transition = doc.startViewTransition(apply)

    transition.ready
      .then(() => {
        // `fill: forwards` is required. Without it the effect reverts to the
        // stylesheet value (fully open) the instant it finishes, which flashes
        // the whole lit page on the way to dark.
        const options = {
          easing: 'cubic-bezier(0.22, 0.7, 0.36, 1)',
          fill: 'forwards' as const,
        }

        if (direction === 'on') {
          root.animate(
            { maskSize: [MASK_SHUT, open] },
            {
              ...options,
              duration: ON_MS,
              pseudoElement: '::view-transition-new(root)',
            }
          )
        } else {
          root.animate(
            { maskSize: [open, MASK_SHUT] },
            {
              ...options,
              duration: OFF_MS,
              pseudoElement: '::view-transition-old(root)',
            }
          )
        }
      })
      .catch(() => {
        // A skipped transition rejects `ready`. The theme is already applied.
      })

    transition.finished
      .catch(() => {})
      .finally(() => {
        delete root.dataset.lights
        running.current = false
      })
  }, [])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label="Light theme"
      className={`theme-switch ${isOn ? 'is-on' : ''}`}
      onClick={onToggle}
    >
      <span className="theme-switch__plate" aria-hidden="true">
        <span className="theme-switch__rocker">
          <FontAwesomeIcon
            icon={isOn ? faSun : faMoon}
            className="theme-switch__glyph"
            fixedWidth
          />
        </span>
      </span>
    </button>
  )
}

'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { SITE_STATUS } from '@constants'

/** Milliseconds per character. */
const CHAR_MS = 16
/** Extra beat between entries, so it reads as four readings rather than one string. */
const ENTRY_PAUSE_MS = 140
/** Beat after paint before the first character lands. */
const START_DELAY_MS = 260

/**
 * Start offsets precomputed at module scope. SITE_STATUS is static, so this is
 * a pure derivation done once — and it keeps the running offset out of the
 * render pass, where mutating a local across a .map() is a compiler error.
 */
const ENTRIES = SITE_STATUS.reduce<Array<(typeof SITE_STATUS)[number] & { start: number }>>(
  (acc, entry) => {
    const previous = acc[acc.length - 1]
    const start = previous ? previous.start + previous.label.length + previous.value.length : 0
    acc.push({ ...entry, start })
    return acc
  },
  []
)

const TOTAL = SITE_STATUS.reduce((sum, e) => sum + e.label.length + e.value.length, 0)

/** Character indices where one entry ends and the next begins. */
const BOUNDARIES = new Set(ENTRIES.map((e) => e.start + e.label.length + e.value.length))

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

let mql: MediaQueryList | null = null
const media = () => (mql ??= window.matchMedia(REDUCED_QUERY))

const subscribeReduced = (onChange: () => void) => {
  const m = media()
  m.addEventListener('change', onChange)
  return () => m.removeEventListener('change', onChange)
}

const readReduced = () => media().matches
const readReducedServer = () => false

/**
 * One string, rendered a character at a time.
 *
 * Every character gets its own span from the first frame; untyped ones are
 * `visibility: hidden`, so they hold their exact width and the line never
 * reflows.
 *
 * Per-character spans rather than a typed/untyped pair of text nodes: splitting
 * a string in two means whitespace at the split point gets collapsed on one
 * side or the other, so the line gained and lost a space width as the caret
 * crossed each gap — which read as the text jittering. The container needs
 * `white-space: pre` so the space characters survive.
 */
function Typed({ text, shown }: { text: string; shown: number }) {
  return (
    <>
      {Array.from(text).map((char, i) => (
        <span key={i} className={i < shown ? undefined : 'site-header__ghost'}>
          {char}
        </span>
      ))}
    </>
  )
}

/**
 * The readings in the header readout strip, typed out on load.
 *
 * This renders the readings only — the strip itself, and the contact links at
 * its other end, are SiteHeader's, so that one element owns the row and can lay
 * both ends out against each other.
 *
 * Runs once per full page load: the header lives in the root layout, so client
 * navigation does not remount it and the strip does not retype on every click.
 *
 * The animated copy is `aria-hidden` and a complete static copy is rendered for
 * screen readers. Reduced motion is read as an external store rather than
 * pushed into state from an effect, so `revealed` can be derived instead of
 * set — no cascading render, and it stays correct if the preference changes
 * mid-visit.
 */
export default function HeaderReadout() {
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, readReducedServer)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduced) return

    let count = 0
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      count += 1
      setTyped(count)
      if (count >= TOTAL) return
      timer = setTimeout(step, BOUNDARIES.has(count) ? ENTRY_PAUSE_MS : CHAR_MS)
    }

    timer = setTimeout(step, START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [reduced])

  const revealed = reduced ? TOTAL : typed
  const complete = revealed >= TOTAL

  return (
    <>
      <dl className="site-header__stats" aria-hidden="true">
        {ENTRIES.map((entry) => {
          const labelShown = Math.min(Math.max(revealed - entry.start, 0), entry.label.length)
          const valueStart = entry.start + entry.label.length
          const valueShown = Math.min(Math.max(revealed - valueStart, 0), entry.value.length)

          const typingLabel = labelShown > 0 && labelShown < entry.label.length
          const typingValue = valueShown > 0 && valueShown < entry.value.length
          const atValueHead = labelShown === entry.label.length && valueShown === 0 && revealed > 0

          return (
            <div key={entry.label} className="site-header__stat">
              <dt className="site-header__stat-label">
                <Typed text={entry.label} shown={labelShown} />
                {typingLabel && <span className="site-header__caret" />}
              </dt>
              <dd className="site-header__stat-value">
                {entry.live && (
                  <span
                    className={`site-header__dot ${valueShown > 0 ? '' : 'is-pending'} ${
                      complete ? 'is-live' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
                <Typed text={entry.value} shown={valueShown} />
                {(typingValue || atValueHead) && <span className="site-header__caret" />}
              </dd>
            </div>
          )
        })}
      </dl>

      {/* Complete copy for assistive tech — never animated. */}
      <dl className="visually-hidden">
        {SITE_STATUS.map((entry) => (
          <div key={entry.label}>
            <dt>{entry.label}</dt>
            <dd>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

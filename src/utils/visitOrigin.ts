/**
 * Referring host and landing path for the current session, stapled to contact
 * enquiries. Must be captured on first load: by the time someone reaches
 * /contact the referrer is usually our own site.
 *
 * sessionStorage, no identifier, nothing sent to a third party.
 */

const REFERRER_KEY = 'vs.referrer'
const LANDING_KEY = 'vs.landing'

export interface VisitOrigin {
  referrer: string
  landing: string
}

/** Only the first call in a session does anything. */
export const recordVisitOrigin = (): void => {
  try {
    if (window.sessionStorage.getItem(LANDING_KEY) !== null) return
    window.sessionStorage.setItem(LANDING_KEY, window.location.pathname + window.location.search)

    const ref = document.referrer
    if (!ref) {
      window.sessionStorage.setItem(REFERRER_KEY, 'direct')
      return
    }
    try {
      // Host only — the full URL can carry someone else's query string.
      window.sessionStorage.setItem(REFERRER_KEY, new URL(ref).host)
    } catch {
      window.sessionStorage.setItem(REFERRER_KEY, 'unknown')
    }
  } catch {
    // Storage blocked. Attribution never interferes with the page.
  }
}

export const readVisitOrigin = (): VisitOrigin => {
  try {
    return {
      referrer: window.sessionStorage.getItem(REFERRER_KEY) ?? 'unknown',
      landing: window.sessionStorage.getItem(LANDING_KEY) ?? 'unknown',
    }
  } catch {
    return { referrer: 'unknown', landing: 'unknown' }
  }
}

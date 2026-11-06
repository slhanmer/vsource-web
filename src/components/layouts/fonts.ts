import { Chakra_Petch, IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from 'next/font/google'

/**
 * Self-hosted at build time. Do not go back to a CSS @import — that cost four
 * serial round trips before text could paint.
 *
 * In their own module because two documents use them: the site's root layout
 * and global-not-found.tsx, which renders with no layout above it at all.
 * next/font has to be called at module scope, once, and both import it here.
 *
 * DEPLOY: the build machine needs internet access to fonts.googleapis.com.
 * Runtime does not.
 *
 * WEIGHTS AND PRELOADS (perf-og, 6 November). Only the faces the site renders
 * are loaded; measured by walking every text node's computed face on every
 * route at 1440 and 390. Every file listed here was a preload on every page:
 * 9 files, ~356KB, all requested before first paint, which is what Lighthouse
 * charged the mobile LCP for. So only the reading face is preloaded, because
 * the LCP element on every page is set in it (or is a photograph). The others
 * load from the CSS as text needs them and swap in (`display: 'swap'`,
 * with next/font's metric-matched fallback, so the swap does not shift
 * layout). If you add a weight, measure that something renders in it.
 */
const display = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

/* 500 and 700 rendered nowhere. */
const ui = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-ui',
  display: 'swap',
  preload: false,
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

/**
 * The reading face. Everything else here is an engineered sans, which is a
 * large part of why the marketing pages read cold — a serif at a comfortable
 * measure is the single cheapest thing that makes them feel written rather
 * than specified. Optical sizing is variable, so this is one file.
 * No italic: nothing on the site sets it in this face (perf-og).
 */
const read = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal'],
  variable: '--font-read',
  display: 'swap',
})

/** The four font variables, for the <html> element. */
export const fontVariables = `${display.variable} ${ui.variable} ${mono.variable} ${read.variable}`

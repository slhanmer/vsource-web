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
 */
const display = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const ui = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

/**
 * The reading face. Everything else here is an engineered sans, which is a
 * large part of why the marketing pages read cold — a serif at a comfortable
 * measure is the single cheapest thing that makes them feel written rather
 * than specified. Optical sizing is variable, so this is one file.
 */
const read = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-read',
  display: 'swap',
})

/** The four font variables, for the <html> element. */
export const fontVariables = `${display.variable} ${ui.variable} ${mono.variable} ${read.variable}`

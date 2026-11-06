import type { Metadata } from 'next'
import SiteDocument, { SITE_URL } from '@components/layouts/SiteDocument'
// Links styled as .basic-button need this on every page, not only where <Button> renders.
import '@components/ui-kit/styles/button.scss'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'V Source — Custom Software Development, Brisbane',
    template: '%s · V Source',
  },
  description:
    'Custom software built and run by the people who wrote it. A small Brisbane team covering design, build, accessibility and hosting on our own Australian hardware.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'V Source Development',
    url: SITE_URL,
    title: 'V Source — Custom Software Development, Brisbane',
    description:
      'Custom software built and run by the people who wrote it. Design, build, accessibility and Australian hosting, from one small Brisbane team.',
    // The image is opengraph-image.tsx, beside this file (perf-og).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'V Source — Custom Software Development, Brisbane',
    description: 'Custom software built and run by the people who wrote it. Brisbane, Australia.',
    // The image is twitter-image.tsx, beside this file (perf-og).
  },
}

/**
 * Root layout for every public page. The app has two root layouts — this one
 * and (payload)'s, for /admin — so the document itself is SiteDocument, which
 * global-not-found.tsx also renders.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>
}

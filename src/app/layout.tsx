import type { Metadata } from 'next'
import { Chakra_Petch, IBM_Plex_Sans, IBM_Plex_Mono, Newsreader } from 'next/font/google'
import { CONTACT } from '@constants'
import { Providers } from './providers'
import SiteHeader from '@components/layouts/SiteHeader'
import SiteFooter from '@components/layouts/SiteFooter'
import CursorSpark from '@components/layouts/CursorSpark'
import '@styles/global.scss'
import './styles/shell.scss'
import '@configs/fontawesome'

/**
 * Self-hosted at build time. Do not go back to a CSS @import — that cost four
 * serial round trips before text could paint.
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

const SITE = 'https://www.vsource.dev'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
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
    url: SITE,
    title: 'V Source — Custom Software Development, Brisbane',
    description:
      'Custom software built and run by the people who wrote it. Design, build, accessibility and Australian hosting, from one small Brisbane team.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'V Source Development, Brisbane' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'V Source — Custom Software Development, Brisbane',
    description: 'Custom software built and run by the people who wrote it. Brisbane, Australia.',
    images: ['/og.png'],
  },
}

/**
 * Structured data. Tells a crawler — and an LLM answering "who builds custom
 * software in Brisbane" — that this is one organisation, in one place, doing
 * these things. Cheapest high-value SEO on the site.
 */
const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#organisation`,
  name: 'V Source Development',
  url: SITE,
  description:
    'Custom software development, design, accessibility and Australian hosting for regulated and technical industries.',
  areaServed: 'AU',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Brisbane',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  email: CONTACT.email,
  telephone: CONTACT.phoneHref.replace('tel:', ''),
  identifier: { '@type': 'PropertyValue', name: 'ABN', value: CONTACT.abn },
  sameAs: [CONTACT.linkedin],
  knowsAbout: [
    'Custom software development',
    'Web accessibility',
    'WCAG 2.2 AA',
    'IEC 62304',
    'Medical device software',
    'Design systems',
  ],
}

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'V Source Development',
  publisher: { '@id': `${SITE}/#organisation` },
  inLanguage: 'en-AU',
}

/**
 * Root layout.
 *
 * `data-theme="dark"` is set server-side so the dark ground is the default and
 * there is no flash of light theme before hydration. The inline script below
 * only overrides it when the visitor has explicitly chosen a theme — it runs
 * before paint, which is why it is inline and not a component.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      data-theme="dark"
      className={`${display.variable} ${ui.variable} ${mono.variable} ${read.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}var c=window.crypto;if(c&&typeof c.randomUUID!=='function'){var g=function(){var b=new Uint8Array(16);if(c.getRandomValues){c.getRandomValues(b);}else{for(var i=0;i<16;i++)b[i]=Math.floor(Math.random()*256);}b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;for(var h=[],j=0;j<16;j++)h.push((b[j]+0x100).toString(16).slice(1));return h[0]+h[1]+h[2]+h[3]+'-'+h[4]+h[5]+'-'+h[6]+h[7]+'-'+h[8]+h[9]+'-'+h[10]+h[11]+h[12]+h[13]+h[14]+h[15];};try{Object.defineProperty(c,'randomUUID',{value:g,writable:true,configurable:true});}catch(e){try{c.randomUUID=g;}catch(e2){}}}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([ORGANISATION, WEBSITE]) }}
        />
        <Providers>
          <div className="site-frame">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteHeader />
            <div className="site-scroll">
              {/*
                The footer is INSIDE the scroller now. It used to be pinned
                below it, which meant a band of chrome on screen at all times
                and out of the fold on every page — and once the contacts moved
                up into the readout strip there was nothing left in it but a
                line of small print, which does not earn being permanently
                visible. It sits at the end of the page and scrolls away.
              */}
              <div id="main" tabIndex={-1} className="page-container top-align site-shell">
                {children}
                <SiteFooter />
              </div>
            </div>
          </div>
          <CursorSpark />
        </Providers>
      </body>
    </html>
  )
}

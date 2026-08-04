import type { Metadata } from 'next'
import { Chakra_Petch, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vsource.dev'),
  title: {
    default: 'V Source — Software & Engineering',
    template: '%s · V Source',
  },
  description:
    'V Source builds software and engineering solutions for regulated and technical industries.',
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
      className={`${display.variable} ${ui.variable} ${mono.variable}`}
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
        <Providers>
          <div className="site-frame">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteHeader />
            <div className="site-scroll">
              <div id="main" tabIndex={-1} className="page-container top-align site-shell">
                {children}
              </div>
            </div>
            <SiteFooter />
          </div>
          <CursorSpark />
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import SiteHeader from '@components/layouts/SiteHeader'
import SiteFooter from '@components/layouts/SiteFooter'
import '@styles/global.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}var c=window.crypto;if(c&&typeof c.randomUUID!=='function'){var g=function(){var b=new Uint8Array(16);if(c.getRandomValues){c.getRandomValues(b);}else{for(var i=0;i<16;i++)b[i]=Math.floor(Math.random()*256);}b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;for(var h=[],j=0;j<16;j++)h.push((b[j]+0x100).toString(16).slice(1));return h[0]+h[1]+h[2]+h[3]+'-'+h[4]+h[5]+'-'+h[6]+h[7]+'-'+h[8]+h[9]+'-'+h[10]+h[11]+h[12]+h[13]+h[14]+h[15];};try{Object.defineProperty(c,'randomUUID',{value:g,writable:true,configurable:true});}catch(e){try{c.randomUUID=g;}catch(e2){}}}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}

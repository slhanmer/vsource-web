import type { Metadata } from 'next'
import '../styles/pages.scss'

export const metadata: Metadata = {
  title: 'Contact',
}

/** PLACEHOLDER — structure only. Copy pending. */
export default function Page() {
  return (
    <main className="page">
      <p className="page__eyebrow">Start a conversation</p>
      <h1 className="page__title">Contact</h1>
      <p className="page__lede">
        Tell us what you are building and we will tell you honestly whether we are the right fit.
      </p>
      <div className="placeholder-copy">
        form goes here — wired to Resend via a Next route handler.
      </div>
    </main>
  )
}

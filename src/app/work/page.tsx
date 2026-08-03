import type { Metadata } from 'next'
import '../styles/pages.scss'

export const metadata: Metadata = {
  title: 'Work',
}

/** PLACEHOLDER — structure only. Copy pending. */
export default function Page() {
  return (
    <main className="page">
      <p className="page__eyebrow">Selected engagements</p>
      <h1 className="page__title">Work</h1>
      <p className="page__lede">A short record of what we have built and who we built it for.</p>
      <div className="placeholder-copy">
        Aptium engagement (in development) is the first entry — needs sign-off on how much detail we
        can name.
      </div>
    </main>
  )
}

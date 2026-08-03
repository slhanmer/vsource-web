import type { Metadata } from 'next'
import '../styles/pages.scss'

export const metadata: Metadata = {
  title: 'Services',
}

/** PLACEHOLDER — structure only. Copy pending. */
export default function Page() {
  return (
    <main className="page">
      <p className="page__eyebrow">What we do</p>
      <h1 className="page__title">Services</h1>
      <p className="page__lede">
        Software and engineering, delivered by a small team that stays with the product after
        launch.
      </p>
      <div className="placeholder-copy">
        needs the engineering offering from Simon, plus the software service breakdown.
      </div>
    </main>
  )
}

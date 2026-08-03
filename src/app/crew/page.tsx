import type { Metadata } from 'next'
import '../styles/pages.scss'

export const metadata: Metadata = {
  title: 'Crew',
}

/** PLACEHOLDER — structure only. Copy pending. */
export default function Page() {
  return (
    <main className="page">
      <p className="page__eyebrow">Who you get</p>
      <h1 className="page__title">Crew</h1>
      <p className="page__lede">
        Three people. You deal with the ones doing the work, not an account manager.
      </p>
      <div className="placeholder-copy">
        needs three names, roles and a line of background each.
      </div>
    </main>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import VSourceMark from '@components/ui-kit/VSourceMark'

import './not-found.scss'

/** App Router 404. Copy is written state-first, like the header readout. */
export default function NotFound() {
  const router = useRouter()

  return (
    <main className="notfound-page">
      <div className="notfound-card">
        <VSourceMark className="notfound-card__mark" />

        <div className="notfound-card__body">
          <p className="notfound-card__code">404</p>
          <p className="notfound-card__signal">
            <span className="notfound-card__signal-key">STATUS</span> No route
          </p>
          <h1 className="notfound-card__heading">Nothing at this address</h1>
          <p className="notfound-card__message">
            That link doesn&rsquo;t resolve to anything on this site. It may have moved, or it may
            never have existed &mdash; either way, nothing is broken at your end.
          </p>
        </div>

        <div className="notfound-card__actions">
          {/* Plain buttons in the kit's classes, not the kit's <Button>
              (perf-og): this boundary ships with every page, and <Button>
              brought the utils and hooks barrels, and with them half the
              ui-kit, into every page's JavaScript. */}
          <button
            type="button"
            className="basic-button secondary-button"
            onClick={() => router.back()}
          >
            <span className="label-span">Go back</span>
          </button>
          <button
            type="button"
            className="basic-button primary-button"
            onClick={() => router.push('/')}
          >
            <span className="label-span">Home page</span>
          </button>
        </div>
      </div>
    </main>
  )
}

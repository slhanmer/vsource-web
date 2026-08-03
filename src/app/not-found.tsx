'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@components'

import './not-found.scss'

/**
 * App-wide 404 (App Router `not-found`). Etched entry-card styling to match the
 * login / welcome shells, with a debossed brand mark and two ways out: step back
 * to the previous page, or return to the app home.
 */
export default function NotFound() {
  const router = useRouter()

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-card__body">
          <p className="notfound-card__code">404</p>
          <h1 className="notfound-card__heading">Lost your bearings?</h1>
          <p className="notfound-card__message">
            This page isn&rsquo;t on the map &mdash; it may have moved or never existed. Let&rsquo;s
            get you back on course.
          </p>
        </div>

        <div className="notfound-card__actions">
          <Button label="Go Back" variant="secondary" handleClick={() => router.back()} />
          <Button label="Take Me Home" handleClick={() => router.push('/')} />
        </div>
      </div>
    </div>
  )
}

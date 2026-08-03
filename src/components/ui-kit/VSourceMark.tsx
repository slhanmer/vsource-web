'use client'

import React, { useId } from 'react'

/**
 * Props for {@link VSourceMark}.
 *
 * @property className - Class applied to the root `<svg>` (size it here).
 * @property title - Accessible label; omit for a decorative mark (`aria-hidden`).
 * @property etched - Apply the token-driven deboss carve. Default `true`.
 */
export interface VSourceMarkProps {
  className?: string
  title?: string
  etched?: boolean
}

/**
 * The V Source mark as a themeable inline SVG.
 *
 * Vectorised from the 512px `v.ico` on the legacy site — the only asset where
 * the V exists without the wordmark's glow overlapping it. The neon outline and
 * halo are lockup properties and deliberately not part of the mark: at favicon
 * size they turn to mush, and a carved mark needs a solid form for the filter
 * to work on.
 *
 * The `etched` deboss is a live SVG filter reading the app's `--carve-*` CSS
 * variables, so it flips with light/dark automatically — the same carve system
 * used by panels, cards and the header band. Lifted from the portal's
 * AptiumMark, which is where the technique comes from.
 *
 * For the carve to read, fill the mark with the surrounding surface colour: set
 * `--logo-surface` (or `color`) on a container so the shape sits flush in the
 * material and only the recess and lip describe it.
 */
export const VSourceMark: React.FC<VSourceMarkProps> = ({ className, title, etched = true }) => {
  // Unique per instance — multiple marks on a page must not share a filter id.
  const fid = `vs-deboss-${useId().replace(/:/g, '')}`

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="var(--logo-surface, currentColor)"
    >
      {title && <title>{title}</title>}
      {etched && (
        <defs>
          <filter
            id={fid}
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feOffset in="SourceAlpha" dx="0" dy="1.6" result="d1" />
            <feGaussianBlur in="d1" stdDeviation="1.1" result="d2" />
            <feComposite in="SourceAlpha" in2="d2" operator="out" result="d3" />
            <feFlood floodColor="var(--carve-dark, rgba(0,0,0,.45))" result="dc" />
            <feComposite in="dc" in2="d3" operator="in" result="darkRecess" />
            <feOffset in="SourceAlpha" dx="0" dy="-1.2" result="l1" />
            <feGaussianBlur in="l1" stdDeviation="0.9" result="l2" />
            <feComposite in="SourceAlpha" in2="l2" operator="out" result="l3" />
            <feFlood floodColor="var(--carve-lip, rgba(255,255,255,.10))" result="lc" />
            <feComposite in="lc" in2="l3" operator="in" result="lightLip" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="darkRecess" />
              <feMergeNode in="lightLip" />
            </feMerge>
          </filter>
        </defs>
      )}
      <path filter={etched ? `url(#${fid})` : undefined} d="M43.89 91.46C38.21 91.14 38.15 91.06 34.61 80.48C31.3 70.56 27.69 60.38 24.82 52.82C24.39 51.69 22.92 47.77 21.56 44.12C20.2 40.46 18.41 35.76 17.58 33.69C14.89 26.92 10.87 15.51 10.51 13.6C10.28 12.34 10.71 11.33 11.75 10.7C12.51 10.24 13.1 10.2 19.76 10.2C27.53 10.2 27.72 10.23 29.06 11.66C30.02 12.69 30.89 14.83 38.11 33.95C42.25 44.92 42.9 46.55 44.68 50.31C46.89 54.98 47.11 55.26 48.54 55.26C49.64 55.26 49.71 55.22 50.6 53.83C51.67 52.15 52.99 49.4 56.62 41.27C57.74 38.75 61.73 28.93 64.44 22.01C66.51 16.74 68.56 12.03 69.32 10.83C70.06 9.67 70.97 8.93 72.22 8.48C73.58 8.0 84.83 8.01 86.26 8.5C88.36 9.22 89.71 11.21 89.72 13.59C89.72 15.19 88.88 17.64 86.2 23.81C79.06 40.22 71.5 58.26 66.89 69.9C65.74 72.79 64.58 75.68 64.31 76.32C64.04 76.95 62.77 79.95 61.49 82.98C60.2 86.01 58.86 88.87 58.51 89.33C56.84 91.51 53.49 92.0 43.89 91.46Z" />
    </svg>
  )
}

export default VSourceMark

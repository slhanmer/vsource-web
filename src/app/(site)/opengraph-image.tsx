import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * The share card (perf-og, 6 November): what a link to the site looks like on
 * LinkedIn, Slack, iMessage and the rest. 1200×630, rendered once at build
 * time (nothing here reads the request), replacing the old text-only
 * `public/og.png` with its retired status bar.
 *
 * The fold, in miniature, on the dark plate: the wordmark top left, the
 * headline with "Software" in its recessed slot, Craig and Simon at the desk
 * in a window cut into the plate on the right, and the name and city in mono
 * along the bottom.
 *
 * HEX VALUES, NOT TOKENS. ImageResponse renders outside the page, so neither
 * the SCSS tokens nor the CSS custom properties reach it. Each colour below is
 * copied from the dark theme (global.scss and home.scss) and named for the
 * token it stands for. If the dark theme changes, change them here too.
 *
 * Fonts are static TTFs in src/assets/og/ (Satori reads TTF, OTF and WOFF, not
 * the WOFF2 or variable files next/font serves): Newsreader Light, the
 * headline's face and weight, and IBM Plex Mono Medium. Both are OFL.
 *
 * The photograph is cropped from the top (`objectPosition`). That is fine
 * here, unlike on the site: this is one fixed frame, not a box that changes
 * shape with the screen.
 */

export const alt =
  'V Source Development, Brisbane: "Software built to fit." Craig and Simon at a desk.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* The dark theme, by token. */
const PLATE_TOP = '#22342c' // --home-plate-top
const PLATE_BOTTOM = '#0d1712' // --home-plate-bottom
const PLATE_LIP = 'rgba(255, 255, 255, 0.22)' // --home-plate-lip
const SLOT = '#0b1310' // --surface-page, what shows through the cut slot
const WELL = '#060b09' // --surface-recessed
const CARVE_DARK = 'rgba(0, 0, 0, 0.45)' // --carve-dark
const CARVE_LIP = 'rgba(255, 255, 255, 0.1)' // --carve-lip
const TEXT = '#e8f0ea' // --text-primary
const TEXT_SECONDARY = '#a3b8ab' // --text-secondary

const PAD = 56
const RADIUS = 8 // $radius-md
const RECESS = `inset 0 3px 8px -3px ${CARVE_DARK}, inset 0 -1px 0 ${CARVE_LIP}`

const root = process.cwd()
const asDataUrl = async (file: string, type: string) =>
  `data:${type};base64,${(await readFile(join(root, file))).toString('base64')}`

export default async function Image() {
  const [read, mono, wordmark, desk] = await Promise.all([
    readFile(join(root, 'src/assets/og/Newsreader-Light.ttf')),
    readFile(join(root, 'src/assets/og/IBMPlexMono-Medium.ttf')),
    asDataUrl('public/logos/vsource-logo-full.png', 'image/png'),
    asDataUrl('src/seed/assets/photos/at-the-desk.jpg', 'image/jpeg'),
  ])

  const photoWidth = Math.round(size.width * 0.4)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: PAD,
        gap: 48,
        background: `linear-gradient(180deg, ${PLATE_TOP}, ${PLATE_BOTTOM})`,
        boxShadow: `inset 0 1px 0 ${PLATE_LIP}`,
        color: TEXT,
      }}
    >
      {/* The message column. */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* The wordmark artwork is 3:1. */}
        <img src={wordmark} width={234} height={78} alt="" style={{ marginLeft: -6 }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            columnGap: 22,
            rowGap: 8,
            fontFamily: 'Newsreader',
            fontWeight: 300,
            fontSize: 84,
            lineHeight: 1.1,
          }}
        >
          {/* The hero's cut slot: the page showing through, the recessed edge. */}
          <span
            style={{
              display: 'flex',
              padding: '4px 22px 14px',
              borderRadius: 4,
              background: SLOT,
              boxShadow: `inset 0 3px 6px -2px ${CARVE_DARK}, inset 0 -1px 0 ${PLATE_LIP}`,
            }}
          >
            Software
          </span>
          <span>built to fit.</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Plex Mono',
            fontWeight: 500,
            fontSize: 21,
            letterSpacing: 3.4,
            color: TEXT_SECONDARY,
          }}
        >
          V SOURCE DEVELOPMENT · BRISBANE
        </div>
      </div>

      {/* The photograph, in a window cut into the plate. The edge is a layer
          above it, as on the site, so the photograph cannot cover it. */}
      <div
        style={{
          width: photoWidth,
          height: size.height - PAD * 2,
          display: 'flex',
          position: 'relative',
          borderRadius: RADIUS,
          overflow: 'hidden',
          background: WELL,
        }}
      >
        <img
          src={desk}
          alt=""
          width={photoWidth}
          height={size.height - PAD * 2}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: RADIUS,
            boxShadow: RECESS,
          }}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Newsreader', data: read, weight: 300, style: 'normal' },
        { name: 'Plex Mono', data: mono, weight: 500, style: 'normal' },
      ],
    }
  )
}

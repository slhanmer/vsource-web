import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { getCssVar } from '@utils'

import './styles/qrCodeDisplay.scss'

/**
 * Props for the QRCodeDisplay component.
 *
 * @property value - The data to encode in the QR code (typically a URL)
 * @property size - Width and height in pixels (default: `250`)
 * @property logo - Image URL to embed in the centre of the code. Ignored in
 *   `scannable` mode. Omit for a plain code.
 * @property dotsColor - Colour of the code's dots. Defaults to `--text-primary`.
 * @property cornersColor - Colour of the three corner squares. Defaults to `--action-primary`.
 * @property background - Background fill. Defaults to `transparent`.
 * @property scannable - Prioritise scanning over brand. Square dots, fixed
 *   dark-on-light in both themes, no logo. Use wherever a failed scan costs the
 *   user something they cannot recover from on their own — TOTP enrolment in
 *   particular, where the alternative to scanning is transcribing the secret by
 *   hand. Overrides `logo`, `dotsColor`, `cornersColor` and `background`.
 * @property className - Additional CSS class for layout positioning
 */
interface QRCodeDisplayProps {
  value: string
  size?: number
  logo?: string
  dotsColor?: string
  cornersColor?: string
  background?: string
  scannable?: boolean
  className?: string
}

/**
 * QR code component using `qr-code-styling`.
 *
 * Colours and logo are supplied by the caller rather than read from a tenant
 * store, so the component carries no app-specific dependencies. When the colour
 * props are omitted they fall back to `--text-primary` and `--action-primary`,
 * read imperatively at draw time.
 *
 * NB on theming: the code redraws when its colour props change. A consumer that
 * switches theme while relying on the CSS-variable defaults must pass the
 * resolved colours explicitly (or re-key the component), otherwise the code
 * keeps whichever palette was live when it first drew.
 *
 * In `scannable` mode it ignores the supplied colours entirely and draws
 * `--qr-ink` on `--qr-paper`, which are deliberately declared once and never
 * overridden in dark. An inverted QR scans on most modern readers but not all,
 * and authenticator apps are among the less forgiving.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 250,
  logo,
  dotsColor,
  cornersColor,
  background,
  scannable = false,
  className = '',
}) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrInstance = useRef<QRCodeStyling | null>(null)

  const showLogo = Boolean(logo) && !scannable
  const resolvedLogo = showLogo ? logo : undefined

  useEffect(() => {
    const dots = scannable ? getCssVar('--qr-ink') : (dotsColor ?? getCssVar('--text-primary'))
    const corners = scannable
      ? getCssVar('--qr-ink')
      : (cornersColor ?? getCssVar('--action-primary'))
    const fill = scannable ? getCssVar('--qr-paper') : (background ?? 'transparent')

    qrInstance.current = new QRCodeStyling({
      width: size,
      height: size,
      data: value,
      image: resolvedLogo,
      qrOptions: {
        // A centred logo punches out modules — without the highest recovery
        // level a branded code is a coin toss on a poor camera.
        errorCorrectionLevel: showLogo ? 'H' : 'M',
      },
      dotsOptions: {
        color: dots,
        type: scannable ? 'square' : 'classy',
      },
      imageOptions: {
        imageSize: 0.4,
        crossOrigin: 'anonymous',
        margin: 5,
      },
      backgroundOptions: {
        color: fill,
      },
      cornersSquareOptions: {
        type: 'square',
        color: corners,
      },
    })

    const container = qrRef.current

    if (container) {
      container.innerHTML = ''
      qrInstance.current.append(container)
    }

    return () => {
      if (container) container.innerHTML = ''
      qrInstance.current = null
    }
  }, [size, resolvedLogo, showLogo, scannable, value, dotsColor, cornersColor, background])

  return (
    <div
      ref={qrRef}
      className={`qr-code-display ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

export default QRCodeDisplay

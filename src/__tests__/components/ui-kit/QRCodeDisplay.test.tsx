import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { QRCodeDisplay } from '../../../components/ui-kit/QRCodeDisplay'
import QRCodeStyling from 'qr-code-styling'

const mockAppend = jest.fn()

jest.mock('qr-code-styling', () =>
  jest.fn().mockImplementation(() => ({
    append: mockAppend,
  }))
)

jest.mock('../../../utils', () => ({
  getCssVar: jest.fn((name: string) => {
    if (name === '--qr-paper') return '#ffffff'
    if (name === '--qr-ink') return '#000000'
    if (name === '--text-primary') return '#393939'
    if (name === '--action-primary') return '#533178'
    return '#000000'
  }),
}))

/** Options the component passed to the most recent QRCodeStyling construction. */
const lastOptions = () => (QRCodeStyling as unknown as jest.Mock).mock.calls.at(-1)?.[0]

const LOGO = 'https://cdn/logo.png'

describe('QRCodeDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<QRCodeDisplay value="https://example.com" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the qr-code-display div', () => {
      const { container } = render(<QRCodeDisplay value="https://example.com" />)
      expect(container.querySelector('.qr-code-display')).toBeInTheDocument()
    })

    it('applies default size of 250px', () => {
      const { container } = render(<QRCodeDisplay value="https://example.com" />)
      const el = container.querySelector('.qr-code-display') as HTMLElement
      expect(el.style.width).toBe('250px')
      expect(el.style.height).toBe('250px')
    })

    it('applies custom size', () => {
      const { container } = render(<QRCodeDisplay value="https://example.com" size={400} />)
      const el = container.querySelector('.qr-code-display') as HTMLElement
      expect(el.style.width).toBe('400px')
      expect(el.style.height).toBe('400px')
    })

    it('applies custom className', () => {
      const { container } = render(
        <QRCodeDisplay value="https://example.com" className="qr-custom" />
      )
      expect(container.querySelector('.qr-custom')).toBeInTheDocument()
    })
  })

  describe('QR instance lifecycle', () => {
    it('creates a QRCodeStyling instance and calls append', () => {
      render(<QRCodeDisplay value="https://example.com" />)
      expect(QRCodeStyling).toHaveBeenCalled()
      expect(mockAppend).toHaveBeenCalled()
    })

    it('rebuilds the code when the value changes', () => {
      const { rerender } = render(<QRCodeDisplay value="https://example.com" />)
      expect(QRCodeStyling).toHaveBeenCalledTimes(1)

      rerender(<QRCodeDisplay value="https://other.com" />)

      // The effect owns `value`, so a change reconstructs rather than calling
      // update() — the separate update effect was redundant and was removed.
      expect(QRCodeStyling).toHaveBeenCalledTimes(2)
      expect(lastOptions()).toMatchObject({ data: 'https://other.com' })
    })

    it('rebuilds the code when a colour prop changes', () => {
      const { rerender } = render(<QRCodeDisplay value="https://example.com" dotsColor="#111111" />)
      expect(QRCodeStyling).toHaveBeenCalledTimes(1)

      rerender(<QRCodeDisplay value="https://example.com" dotsColor="#222222" />)

      expect(QRCodeStyling).toHaveBeenCalledTimes(2)
      expect(lastOptions().dotsOptions.color).toBe('#222222')
    })
  })

  describe('branding', () => {
    it('embeds the supplied logo and raises error correction to cover it', () => {
      render(<QRCodeDisplay value="https://example.com" logo={LOGO} />)

      expect(lastOptions()).toMatchObject({
        image: LOGO,
        qrOptions: { errorCorrectionLevel: 'H' },
      })
    })

    it('omits the logo when none is supplied', () => {
      render(<QRCodeDisplay value="https://example.com" />)

      expect(lastOptions().image).toBeUndefined()
      expect(lastOptions().qrOptions.errorCorrectionLevel).toBe('M')
    })
  })

  describe('colours', () => {
    it('uses the supplied colours over the token defaults', () => {
      render(
        <QRCodeDisplay
          value="https://example.com"
          dotsColor="#123456"
          cornersColor="#abcdef"
          background="#fefefe"
        />
      )

      const opts = lastOptions()

      expect(opts.dotsOptions.color).toBe('#123456')
      expect(opts.cornersSquareOptions.color).toBe('#abcdef')
      expect(opts.backgroundOptions.color).toBe('#fefefe')
    })

    it('falls back to the theme tokens when colours are omitted', () => {
      render(<QRCodeDisplay value="https://example.com" />)

      const opts = lastOptions()

      expect(opts.dotsOptions.color).toBe('#393939')
      expect(opts.cornersSquareOptions.color).toBe('#533178')
      expect(opts.backgroundOptions.color).toBe('transparent')
    })
  })

  describe('scannable mode', () => {
    // A failed scan during TOTP enrolment leaves the user transcribing a secret
    // by hand, so scan reliability beats brand on that surface.
    it('drops the logo, squares the dots, and draws fixed dark-on-light', () => {
      render(<QRCodeDisplay value="otpauth://totp/example:test" logo={LOGO} scannable />)

      const opts = lastOptions()

      expect(opts.image).toBeUndefined()
      expect(opts.dotsOptions.type).toBe('square')
      expect(opts.backgroundOptions.color).toBe('#ffffff')
    })

    it('ignores supplied colours and reads the non-theming qr tokens', () => {
      const { getCssVar } = jest.requireMock('../../../utils')

      render(<QRCodeDisplay value="otpauth://totp/example:test" dotsColor="#123456" scannable />)

      expect(lastOptions().dotsOptions.color).toBe('#000000')
      expect(getCssVar).toHaveBeenCalledWith('--qr-ink')
      expect(getCssVar).toHaveBeenCalledWith('--qr-paper')
      expect(getCssVar).not.toHaveBeenCalledWith('--text-primary')
    })
  })
})

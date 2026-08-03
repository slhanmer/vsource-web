import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import Button from '../../../components/ui-kit/Button'

jest.mock('@icons', () => ({
  FingerprintIcon: jest.fn(() => null),
}))

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
}))

describe('Button', () => {
  describe('accessibility', () => {
    it('has no axe violations for basic variant', async () => {
      const { container } = render(<Button label="Submit" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations for icon-only variant', async () => {
      const { container } = render(
        <Button variant="icon-only" icon={<span>X</span>} tooltip="Close" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('sets aria-label from tooltip for icon-only buttons', () => {
      // Pass a ReactNode label so the component falls back to tooltip for aria-label
      render(
        <Button variant="icon-only" icon={<span>X</span>} tooltip="Delete item" label={<span />} />
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete item')
    })

    it('sets aria-label from label string for text buttons', () => {
      render(<Button label="Save" />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Save')
    })
  })

  describe('label rendering', () => {
    it('renders label as-is by default', () => {
      render(<Button label="click me" />)
      expect(screen.getByRole('button')).toHaveTextContent('click me')
    })
    it('uppercases label when normalCase=false', () => {
      render(<Button label="click me" normalCase={false} />)
      expect(screen.getByRole('button')).toHaveTextContent('CLICK ME')
    })
    it('renders ReactNode label', () => {
      render(<Button label={<em data-testid="em">Bold</em>} />)
      expect(screen.getByTestId('em')).toBeInTheDocument()
    })
  })

  describe('variant rendering', () => {
    const variants = [
      'basic',
      'secondary',
      'cta',
      'danger',
      'cancel',
      'text-only',
      'filter',
      'toggle',
      'success',
    ] as const

    variants.forEach((variant) => {
      it(`renders ${variant} variant without throwing`, () => {
        const { container } = render(<Button variant={variant} label="Label" />)
        expect(container.querySelector(`.${variant}-button`)).toBeInTheDocument()
      })
    })

    it('renders icon-only variant with icon', () => {
      render(<Button variant="icon-only" icon={<span data-testid="ico">★</span>} />)
      expect(screen.getByTestId('ico')).toBeInTheDocument()
    })

    it('renders fingerprint variant with FingerprintIcon', () => {
      const { container } = render(<Button variant="fingerprint" />)
      expect(container.querySelector('.fingerprint-button')).toBeInTheDocument()
    })

    it('renders plus variant with + icon', () => {
      const { container } = render(<Button variant="plus" />)
      expect(container.querySelector('.plus-button')).toBeInTheDocument()
    })

    it('renders minus variant with - icon', () => {
      const { container } = render(<Button variant="minus" />)
      expect(container.querySelector('.minus-button')).toBeInTheDocument()
    })
  })

  describe('icon positioning', () => {
    it('renders icon to the right by default', () => {
      render(<Button variant="icon" label="Save" icon={<span data-testid="ico">★</span>} />)
      expect(screen.getByTestId('ico')).toBeInTheDocument()
    })

    it('renders icon to the left when iconPosition="left"', () => {
      const { container } = render(
        <Button variant="icon" label="Save" icon={<span>★</span>} iconPosition="left" />
      )
      expect(container.querySelector('.icon-left')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls handleClick when clicked', async () => {
      const handleClick = jest.fn()
      render(<Button label="Go" handleClick={handleClick} />)
      await act(async () => {
        fireEvent.click(screen.getByRole('button'))
      })
      await waitFor(() => expect(handleClick).toHaveBeenCalledTimes(1))
    })

    it('does not call handleClick when disabled', async () => {
      const handleClick = jest.fn()
      render(<Button label="Disabled" handleClick={handleClick} disabled />)
      await act(async () => {
        fireEvent.click(screen.getByRole('button'))
      })
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('prevents double-fire while async handler is running', async () => {
      const handleClick = jest.fn(() => new Promise<void>((r) => setTimeout(r, 50)))
      render(<Button label="Async" handleClick={handleClick} />)
      const btn = screen.getByRole('button')
      fireEvent.click(btn)
      fireEvent.click(btn) // second click during lock
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('disabled state', () => {
    it('is disabled via HTML attribute', () => {
      render(<Button label="Off" disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies disabled class to button', () => {
      render(<Button label="Off" disabled />)
      expect(screen.getByRole('button')).toHaveClass('disabled')
    })
  })

  describe('tooltip', () => {
    it('shows tooltip text on mouse enter', () => {
      render(<Button label="Hover me" tooltip="Helpful hint" />)
      fireEvent.mouseEnter(screen.getByRole('button'))
      expect(screen.getByText('Helpful hint')).toBeInTheDocument()
    })

    it('hides tooltip on mouse leave', () => {
      render(<Button label="Hover me" tooltip="Hint" />)
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      expect(screen.queryByText('Hint')).not.toBeInTheDocument()
    })
  })

  describe('required state', () => {
    it('applies required class when required=true', () => {
      render(<Button label="Sign" required />)
      expect(screen.getByRole('button')).toHaveClass('required')
    })
  })

  describe('edge cases', () => {
    it('renders with empty label', () => {
      const { container } = render(<Button label="" />)
      expect(container.querySelector('.basic-button')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Button label="X" className="extra" />)
      expect(screen.getByRole('button')).toHaveClass('extra')
    })

    it('applies custom width style', () => {
      render(<Button label="X" width="200px" />)
      expect(screen.getByRole('button')).toHaveStyle({ width: '200px' })
    })

    it('renders suffix element', () => {
      render(<Button label="X" suffix={<span data-testid="sfx">!</span>} />)
      expect(screen.getByTestId('sfx')).toBeInTheDocument()
    })
  })
})

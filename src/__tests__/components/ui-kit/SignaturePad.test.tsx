import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SignaturePad } from '../../../components/ui-kit/SignaturePad'

jest.mock('@icons', () => ({
  FingerprintIcon: jest.fn(() => null),
}))

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
}))

jest.mock('../../../hooks', () => ({
  usePreventScroll: jest.fn(),
  useViewport: jest.fn(() => false),
  useHoverAndTouch: jest.fn(() => ({
    isHovered: false,
    isTouched: false,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    handleTouchStart: jest.fn(),
    handleTouchEnd: jest.fn(),
  })),
}))

// Canvas toDataURL mock
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillText: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
  bezierCurveTo: jest.fn(),
  closePath: jest.fn(),
})) as any

HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mock')

describe('SignaturePad', () => {
  describe('accessibility', () => {
    it('has no axe violations in initial state', async () => {
      const { container } = render(<SignaturePad onSave={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('initial rendering', () => {
    it('renders the "Click To Sign" button', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      expect(screen.getByRole('button', { name: /click to sign/i })).toBeInTheDocument()
    })

    it('does not show canvas or modal initially', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('opening modal', () => {
    it('opens modal when "Click To Sign" is clicked', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /click to sign/i }).closest('div')!)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('shows "Please sign below" title in modal', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /click to sign/i }).closest('div')!)
      expect(screen.getByText('Please sign below')).toBeInTheDocument()
    })

    it('renders canvas in the modal', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /click to sign/i }).closest('div')!)
      expect(document.querySelector('.signature-canvas')).toBeInTheDocument()
    })
  })

  describe('modal buttons', () => {
    it('renders Clear and Save buttons in the modal', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /click to sign/i }).closest('div')!)
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('Save button is disabled before drawing', () => {
      render(<SignaturePad onSave={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /click to sign/i }).closest('div')!)
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
    })
  })

  describe('disabled state', () => {
    it('does not open modal when disabled', () => {
      render(<SignaturePad onSave={jest.fn()} disabled />)
      const trigger = screen.getByRole('button', { name: /click to sign/i }).closest('div')!
      fireEvent.click(trigger)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('initialValue', () => {
    it('shows signature preview image when initialValue is provided', () => {
      render(<SignaturePad onSave={jest.fn()} initialValue="data:image/png;base64,existing" />)
      expect(screen.getByRole('img', { name: "User's signature" })).toBeInTheDocument()
    })

    it('shows "Update" text when initialValue is provided', () => {
      render(<SignaturePad onSave={jest.fn()} initialValue="data:image/png;base64,existing" />)
      expect(screen.getByText('Update')).toBeInTheDocument()
    })
  })

  describe('required prop', () => {
    it('marks button as required when required=true', () => {
      const { container } = render(<SignaturePad onSave={jest.fn()} required />)
      expect(container.querySelector('.required')).toBeInTheDocument()
    })
  })

  describe('controlled mode', () => {
    it('opens modal when showCanvas=true', () => {
      render(<SignaturePad onSave={jest.fn()} showCanvas />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes modal when showCanvas=false', () => {
      render(<SignaturePad onSave={jest.fn()} showCanvas={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})

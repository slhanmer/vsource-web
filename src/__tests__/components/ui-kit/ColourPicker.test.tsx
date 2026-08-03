import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ColourPicker } from '../../../components/ui-kit/ColourPicker'

jest.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
    <input
      data-testid="hex-picker"
      type="color"
      aria-label="Color picker"
      value={color}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

describe('ColourPicker', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<ColourPicker value="#ff0000" onChange={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the color picker wrapper', () => {
      const { container } = render(<ColourPicker value="#ff0000" onChange={jest.fn()} />)
      expect(container.querySelector('.color-picker')).toBeInTheDocument()
    })

    it('passes value to the picker', () => {
      render(<ColourPicker value="#123456" onChange={jest.fn()} />)
      expect(screen.getByTestId('hex-picker')).toHaveValue('#123456')
    })

    it('applies custom className', () => {
      const { container } = render(
        <ColourPicker value="#ffffff" onChange={jest.fn()} className="my-picker" />
      )
      expect(container.querySelector('.my-picker')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange when a new color is selected', () => {
      const onChange = jest.fn()
      render(<ColourPicker value="#000000" onChange={onChange} />)
      fireEvent.change(screen.getByTestId('hex-picker'), { target: { value: '#aabbcc' } })
      expect(onChange).toHaveBeenCalledWith('#aabbcc')
    })
  })

  describe('edge cases', () => {
    it('renders with white value', () => {
      render(<ColourPicker value="#ffffff" onChange={jest.fn()} />)
      expect(screen.getByTestId('hex-picker')).toHaveValue('#ffffff')
    })

    it('renders with black value', () => {
      render(<ColourPicker value="#000000" onChange={jest.fn()} />)
      expect(screen.getByTestId('hex-picker')).toHaveValue('#000000')
    })
  })
})

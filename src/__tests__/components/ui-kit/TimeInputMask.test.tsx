import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TimeInputMask } from '../../../components/ui-kit/TimeInputMask'

jest.mock('react-imask', () => ({
  IMaskInput: ({
    value,
    placeholder,
    disabled,
    className,
    onAccept,
  }: {
    value?: string
    placeholder?: string
    disabled?: boolean
    className?: string
    onAccept?: (v: string) => void
  }) => (
    <input
      data-testid="imask-time"
      value={value || ''}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      onChange={(e) => onAccept?.(e.target.value)}
    />
  ),
  IMask: { MaskedRange: class {} },
}))

describe('TimeInputMask', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<TimeInputMask value="" onChange={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the masked input', () => {
      render(<TimeInputMask value="" onChange={jest.fn()} />)
      expect(screen.getByTestId('imask-time')).toBeInTheDocument()
    })

    it('shows the default placeholder', () => {
      render(<TimeInputMask value="" onChange={jest.fn()} />)
      expect(screen.getByPlaceholderText('HH:mm')).toBeInTheDocument()
    })

    it('shows a custom placeholder', () => {
      render(<TimeInputMask value="" onChange={jest.fn()} placeholder="hh:mm" />)
      expect(screen.getByPlaceholderText('hh:mm')).toBeInTheDocument()
    })

    it('displays an existing value', () => {
      render(<TimeInputMask value="14:30" onChange={jest.fn()} />)
      expect(screen.getByTestId('imask-time')).toHaveValue('14:30')
    })
  })

  describe('interactions', () => {
    it('calls onChange when input value changes', () => {
      const onChange = jest.fn()
      render(<TimeInputMask value="" onChange={onChange} />)
      fireEvent.change(screen.getByTestId('imask-time'), { target: { value: '10:00' } })
      expect(onChange).toHaveBeenCalledWith('10:00')
    })
  })

  describe('disabled state', () => {
    it('disables the input when disabled=true', () => {
      render(<TimeInputMask value="" onChange={jest.fn()} disabled />)
      expect(screen.getByTestId('imask-time')).toBeDisabled()
    })

    it('does not disable by default', () => {
      render(<TimeInputMask value="" onChange={jest.fn()} />)
      expect(screen.getByTestId('imask-time')).not.toBeDisabled()
    })
  })
})

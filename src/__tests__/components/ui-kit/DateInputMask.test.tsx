import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DateInputMask } from '../../../components/ui-kit/DateInputMask'

jest.mock('react-imask', () => ({
  IMaskInput: ({
    value,
    placeholder,
    disabled,
    className,
    onAccept,
    readOnly,
  }: {
    value?: string
    placeholder?: string
    disabled?: boolean
    className?: string
    onAccept?: (v: string) => void
    readOnly?: boolean
  }) => (
    <input
      data-testid="imask-date"
      value={value || ''}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      readOnly={readOnly}
      onChange={(e) => onAccept?.(e.target.value)}
    />
  ),
  IMask: {
    MaskedRange: class {},
  },
}))

jest.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (d: Date) => void }) => (
    <div data-testid="datepicker">
      <button onClick={() => onChange(new Date('2025-03-15'))}>Pick date</button>
    </div>
  ),
}))

describe('DateInputMask', () => {
  describe('accessibility', () => {
    it('has no axe violations in default format', async () => {
      const { container } = render(<DateInputMask value="" onChange={jest.fn()} disabled={false} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the masked input', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} />)
      expect(screen.getByTestId('imask-date')).toBeInTheDocument()
    })

    it('shows default DD-MM-YYYY placeholder', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} />)
      expect(screen.getByPlaceholderText('DD-MM-YYYY')).toBeInTheDocument()
    })

    it('shows MM-YYYY placeholder for mmyyyy format', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} format="mmyyyy" />)
      expect(screen.getByPlaceholderText('MM-YYYY')).toBeInTheDocument()
    })

    it('shows YYYY placeholder for yyyy format', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} format="yyyy" />)
      expect(screen.getByPlaceholderText('YYYY')).toBeInTheDocument()
    })

    it('shows custom placeholder when provided', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} placeholder="Date…" />)
      expect(screen.getByPlaceholderText('Date…')).toBeInTheDocument()
    })

    it('shows format hint text', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} />)
      expect(screen.getByText('Format: DD-MM-YYYY')).toBeInTheDocument()
    })

    it('shows calendar icon for ddmmyyyy format (not disabled)', () => {
      const { container } = render(
        <DateInputMask value="" onChange={jest.fn()} disabled={false} format="ddmmyyyy" />
      )
      expect(container.querySelector('.date-picker-icon')).toBeInTheDocument()
    })

    it('hides calendar icon for mmyyyy format', () => {
      const { container } = render(
        <DateInputMask value="" onChange={jest.fn()} disabled={false} format="mmyyyy" />
      )
      expect(container.querySelector('.date-picker-icon')).not.toBeInTheDocument()
    })

    it('hides calendar icon when disabled', () => {
      const { container } = render(
        <DateInputMask value="" onChange={jest.fn()} disabled={true} format="ddmmyyyy" />
      )
      expect(container.querySelector('.date-picker-icon')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange when value is accepted', () => {
      const onChange = jest.fn()
      render(<DateInputMask value="" onChange={onChange} disabled={false} />)
      fireEvent.change(screen.getByTestId('imask-date'), { target: { value: '15-03-2025' } })
      expect(onChange).toHaveBeenCalledWith('15-03-2025')
    })

    it('shows date picker popup when calendar icon is clicked', () => {
      const { container } = render(<DateInputMask value="" onChange={jest.fn()} disabled={false} />)
      fireEvent.click(container.querySelector('.date-picker-icon')!)
      expect(screen.getByTestId('datepicker')).toBeInTheDocument()
    })

    it('calls onChange when date is picked from popup', () => {
      const onChange = jest.fn()
      const { container } = render(<DateInputMask value="" onChange={onChange} disabled={false} />)
      fireEvent.click(container.querySelector('.date-picker-icon')!)
      fireEvent.click(screen.getByRole('button', { name: 'Pick date' }))
      expect(onChange).toHaveBeenCalledWith('15-03-2025')
    })
  })

  describe('disabled and readOnly states', () => {
    it('disables the input when disabled=true', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={true} />)
      expect(screen.getByTestId('imask-date')).toBeDisabled()
    })

    it('makes the input readOnly when readOnly=true', () => {
      render(<DateInputMask value="" onChange={jest.fn()} disabled={false} readOnly />)
      expect(screen.getByTestId('imask-date')).toHaveAttribute('readonly')
    })
  })
})

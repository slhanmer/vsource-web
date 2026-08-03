import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DatePicker } from '../../../components/ui-kit/DatePicker'

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
}))

describe('DatePicker', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<DatePicker onChange={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the date picker container', () => {
      const { container } = render(<DatePicker onChange={jest.fn()} />)
      expect(container.querySelector('.date-picker-container')).toBeInTheDocument()
    })

    it('shows "No dates selected" initially', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByText('No dates selected.')).toBeInTheDocument()
    })

    it('renders mode buttons: Individual, Range, Recurring', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Individual' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Range' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Recurring' })).toBeInTheDocument()
    })

    it('renders the Clear Selection button', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: /clear selection/i })).toBeInTheDocument()
    })

    it('shows start and finish date labels', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByText(/start date/i)).toBeInTheDocument()
      expect(screen.getByText(/finish date/i)).toBeInTheDocument()
    })

    it('disables the Recurring button', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Recurring' })).toBeDisabled()
    })
  })

  describe('mode switching', () => {
    it('switches to Individual mode', () => {
      render(<DatePicker onChange={jest.fn()} />)
      const individualBtn = screen.getByRole('button', { name: 'Individual' })
      fireEvent.click(individualBtn)
      expect(individualBtn).toHaveClass('active')
    })

    it('starts in Range mode by default', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Range' })).toHaveClass('active')
    })

    it('clears selected days when mode changes', () => {
      const onChange = jest.fn()
      render(<DatePicker onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Individual' }))
      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('navigation', () => {
    it('renders previous and next month buttons', () => {
      render(<DatePicker onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
    })
  })

  describe('clear selection', () => {
    it('calls onChange with empty array on clear', () => {
      const onChange = jest.fn()
      render(<DatePicker onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /clear selection/i }))
      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('controlled value', () => {
    it('renders with pre-selected dates', () => {
      const selectedDate = new Date('2025-06-15')
      render(<DatePicker value={[selectedDate]} onChange={jest.fn()} />)
      // Should show a formatted date
      expect(screen.queryByText('No dates selected.')).not.toBeInTheDocument()
    })
  })
})

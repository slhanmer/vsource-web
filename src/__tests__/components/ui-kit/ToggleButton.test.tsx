import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ToggleButton } from '../../../components/ui-kit/ToggleButton'

const OPTIONS = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c', disabled: true },
]

describe('ToggleButton', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders a button for each option', () => {
      render(<ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Option A' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Option C' })).toBeInTheDocument()
    })

    it('applies active class to the matching value', () => {
      render(<ToggleButton options={OPTIONS} value="b" onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Option B' })).toHaveClass('active')
      expect(screen.getByRole('button', { name: 'Option A' })).not.toHaveClass('active')
    })

    it('applies disabled class to options with disabled=true', () => {
      render(<ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Option C' })).toHaveClass('disabled')
    })

    it('applies custom className to container', () => {
      const { container } = render(
        <ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} className="my-toggle" />
      )
      expect(container.querySelector('.my-toggle')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange with the selected value', () => {
      const onChange = jest.fn()
      render(<ToggleButton options={OPTIONS} value="a" onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Option B' }))
      expect(onChange).toHaveBeenCalledWith('b')
    })

    it('does not call onChange for a disabled option', () => {
      const onChange = jest.fn()
      render(<ToggleButton options={OPTIONS} value="a" onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: 'Option C' }))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('global disabled state', () => {
    it('disables all buttons when disabled=true', () => {
      render(<ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} disabled />)
      screen.getAllByRole('button').forEach((btn) => expect(btn).toBeDisabled())
    })

    it('does not call onChange when globally disabled', () => {
      const onChange = jest.fn()
      render(<ToggleButton options={OPTIONS} value="a" onChange={onChange} disabled />)
      fireEvent.click(screen.getByRole('button', { name: 'Option A' }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('applies disabled class to container when globally disabled', () => {
      const { container } = render(
        <ToggleButton options={OPTIONS} value="a" onChange={jest.fn()} disabled />
      )
      expect(container.querySelector('.toggle-button')).toHaveClass('disabled')
    })
  })
})

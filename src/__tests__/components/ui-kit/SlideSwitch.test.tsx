import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { SlideSwitch } from '../../../components/ui-kit/SlideSwitch'

describe('SlideSwitch', () => {
  describe('accessibility', () => {
    it('has no axe violations when unchecked', async () => {
      const { container } = render(
        <SlideSwitch checked={false} onChange={jest.fn()} label="Toggle feature" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations when checked', async () => {
      const { container } = render(
        <SlideSwitch checked onChange={jest.fn()} label="Toggle feature" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations when named via aria-label only (no visible label)', async () => {
      const { container } = render(
        <SlideSwitch
          checked={false}
          onChange={jest.fn()}
          aria-label="Dark mode"
          knobOff={<span>sun</span>}
          knobOn={<span>moon</span>}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('exposes the label as an accessible name via aria-label', () => {
      render(<SlideSwitch checked={false} onChange={jest.fn()} label="Toggle feature" />)
      expect(screen.getByRole('switch', { name: 'Toggle feature' })).toBeInTheDocument()
    })

    it('prefers an explicit aria-label over label', () => {
      render(
        <SlideSwitch
          checked={false}
          onChange={jest.fn()}
          label="Visible"
          aria-label="Screen reader"
        />
      )
      expect(screen.getByRole('switch', { name: 'Screen reader' })).toBeInTheDocument()
    })
  })

  describe('rendering', () => {
    it('renders a switch input', () => {
      render(<SlideSwitch checked={false} onChange={jest.fn()} aria-label="Toggle" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('reflects checked=true on the input', () => {
      render(<SlideSwitch checked onChange={jest.fn()} aria-label="Toggle" />)
      expect(screen.getByRole('switch')).toBeChecked()
    })

    it('reflects checked=false on the input', () => {
      render(<SlideSwitch checked={false} onChange={jest.fn()} aria-label="Toggle" />)
      expect(screen.getByRole('switch')).not.toBeChecked()
    })

    it('renders the label text inside the track', () => {
      render(<SlideSwitch checked={false} onChange={jest.fn()} label="Notifications" />)
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })

    it('renders knobOff content when unchecked', () => {
      render(
        <SlideSwitch
          checked={false}
          onChange={jest.fn()}
          aria-label="Theme"
          knobOff={<span>sun</span>}
          knobOn={<span>moon</span>}
        />
      )
      expect(screen.getByText('sun')).toBeInTheDocument()
      expect(screen.queryByText('moon')).not.toBeInTheDocument()
    })

    it('renders knobOn content when checked', () => {
      render(
        <SlideSwitch
          checked
          onChange={jest.fn()}
          aria-label="Theme"
          knobOff={<span>sun</span>}
          knobOn={<span>moon</span>}
        />
      )
      expect(screen.getByText('moon')).toBeInTheDocument()
      expect(screen.queryByText('sun')).not.toBeInTheDocument()
    })

    it('applies the width custom property when width is provided', () => {
      const { container } = render(
        <SlideSwitch checked={false} onChange={jest.fn()} aria-label="Toggle" width="84px" />
      )
      const track = container.querySelector('.slide-switch__track') as HTMLElement
      expect(track.style.getPropertyValue('--switch-width')).toBe('84px')
    })

    it('applies custom className to the root label', () => {
      const { container } = render(
        <SlideSwitch
          checked={false}
          onChange={jest.fn()}
          aria-label="Toggle"
          className="custom-switch"
        />
      )
      expect(container.querySelector('.custom-switch')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange with true when toggled from unchecked', () => {
      const onChange = jest.fn()
      render(<SlideSwitch checked={false} onChange={onChange} aria-label="Toggle" />)
      fireEvent.click(screen.getByRole('switch'))
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('calls onChange with false when toggled from checked', () => {
      const onChange = jest.fn()
      render(<SlideSwitch checked onChange={onChange} aria-label="Toggle" />)
      fireEvent.click(screen.getByRole('switch'))
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('disabled state', () => {
    it('disables the input when disabled=true', () => {
      render(<SlideSwitch checked={false} onChange={jest.fn()} aria-label="Toggle" disabled />)
      expect(screen.getByRole('switch')).toBeDisabled()
    })

    it('applies is-disabled class when disabled', () => {
      const { container } = render(
        <SlideSwitch checked={false} onChange={jest.fn()} aria-label="Toggle" disabled />
      )
      expect(container.querySelector('.slide-switch')).toHaveClass('is-disabled')
    })

    it('does not fire onChange when disabled', async () => {
      const onChange = jest.fn()
      render(<SlideSwitch checked={false} onChange={onChange} aria-label="Toggle" disabled />)
      await userEvent.click(screen.getByRole('switch'))
      expect(onChange).not.toHaveBeenCalled()
    })
  })
})

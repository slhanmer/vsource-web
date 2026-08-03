import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ProgressBar } from '../../../components/ui-kit/ProgressBar'

describe('ProgressBar', () => {
  describe('accessibility', () => {
    it('has no axe violations at 50%', async () => {
      const { container } = render(<ProgressBar progress={50} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('label display', () => {
    it('shows "0%" label at zero', () => {
      render(<ProgressBar progress={0} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('shows percentage label at partial progress', () => {
      render(<ProgressBar progress={42} />)
      expect(screen.getByText('42%')).toBeInTheDocument()
    })

    it('shows "COMPLETED" label at 100', () => {
      render(<ProgressBar progress={100} />)
      expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    })
  })

  describe('CSS classes', () => {
    it('uses progress-zero class at 0', () => {
      const { container } = render(<ProgressBar progress={0} />)
      expect(container.querySelector('.progress-zero')).toBeInTheDocument()
      expect(container.querySelector('.progress-bar')).not.toBeInTheDocument()
    })

    it('uses progress-bar class above 0', () => {
      const { container } = render(<ProgressBar progress={50} />)
      expect(container.querySelector('.progress-bar')).toBeInTheDocument()
      expect(container.querySelector('.progress-zero')).not.toBeInTheDocument()
    })
  })

  describe('width style', () => {
    it('sets width to match clamped progress', () => {
      const { container } = render(<ProgressBar progress={75} />)
      const bar = container.querySelector('.progress-bar') as HTMLElement
      expect(bar.style.width).toBe('75%')
    })
  })

  describe('edge cases', () => {
    it('clamps progress above 100 to 100', () => {
      render(<ProgressBar progress={150} />)
      expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    })

    it('clamps negative progress to 0', () => {
      render(<ProgressBar progress={-20} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('coerces NaN to 0', () => {
      render(<ProgressBar progress={NaN} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('renders the container div', () => {
      const { container } = render(<ProgressBar progress={50} />)
      expect(container.querySelector('.progress-bar-container')).toBeInTheDocument()
    })
  })
})

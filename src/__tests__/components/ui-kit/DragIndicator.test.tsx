import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DragIndicator } from '../../../components/ui-kit/DragIndicator'

describe('DragIndicator', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<DragIndicator />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders two chevron icons', () => {
      const { container } = render(<DragIndicator />)
      expect(container.querySelectorAll('svg')).toHaveLength(2)
    })

    it('renders container span', () => {
      const { container } = render(<DragIndicator />)
      expect(container.querySelector('.drag-indicator-container')).toBeInTheDocument()
    })
  })

  describe('prop variants', () => {
    it('adds disabled class to up chevron when first=true', () => {
      const { container } = render(<DragIndicator first />)
      const chevrons = container.querySelectorAll('.chevron')
      expect(chevrons[0]).toHaveClass('disabled')
      expect(chevrons[1]).not.toHaveClass('disabled')
    })

    it('adds disabled class to down chevron when last=true', () => {
      const { container } = render(<DragIndicator last />)
      const chevrons = container.querySelectorAll('.chevron')
      expect(chevrons[0]).not.toHaveClass('disabled')
      expect(chevrons[1]).toHaveClass('disabled')
    })

    it('disables both chevrons when first=true and last=true', () => {
      const { container } = render(<DragIndicator first last />)
      const chevrons = container.querySelectorAll('.chevron')
      expect(chevrons[0]).toHaveClass('disabled')
      expect(chevrons[1]).toHaveClass('disabled')
    })

    it('disables neither chevron by default', () => {
      const { container } = render(<DragIndicator />)
      const chevrons = container.querySelectorAll('.chevron')
      expect(chevrons[0]).not.toHaveClass('disabled')
      expect(chevrons[1]).not.toHaveClass('disabled')
    })
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import SpacerDiv from '../../../components/ui-kit/Spacer'

describe('Spacer', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<SpacerDiv size={1} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders a div with spacer-div class', () => {
      const { container } = render(<SpacerDiv size={2} />)
      expect(container.querySelector('.spacer-div')).toBeInTheDocument()
    })

    it('applies vertical height in rem based on size', () => {
      const { container } = render(<SpacerDiv size={3} />)
      const el = container.querySelector('.spacer-div') as HTMLElement
      expect(el.style.height).toBe('3rem')
      expect(el.style.width).toBe('100%')
    })

    it('applies horizontal width in rem when horizontal=true', () => {
      const { container } = render(<SpacerDiv size={2} horizontal />)
      const el = container.querySelector('.spacer-div') as HTMLElement
      expect(el.style.width).toBe('2rem')
      expect(el.style.height).toBe('100%')
    })

    it('sets flexShrink to 0', () => {
      const { container } = render(<SpacerDiv size={1} />)
      const el = container.querySelector('.spacer-div') as HTMLElement
      expect(el.style.flexShrink).toBe('0')
    })
  })

  describe('edge cases', () => {
    it('accepts size=0 without throwing', () => {
      const { container } = render(<SpacerDiv size={0} />)
      const el = container.querySelector('.spacer-div') as HTMLElement
      expect(el.style.height).toBe('0rem')
    })

    it('defaults horizontal to false', () => {
      const { container } = render(<SpacerDiv size={1} horizontal={false} />)
      const el = container.querySelector('.spacer-div') as HTMLElement
      expect(el.style.height).toBe('1rem')
    })
  })
})

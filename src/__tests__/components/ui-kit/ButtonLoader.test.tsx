import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ButtonLoader } from '../../../components/ui-kit/ButtonLoader'

describe('ButtonLoader', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<ButtonLoader />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('is hidden from assistive technology', () => {
      const { container } = render(<ButtonLoader />)
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('rendering', () => {
    it('renders five animated dot spans', () => {
      const { container } = render(<ButtonLoader />)
      const inner = container.querySelector('.button-loader')
      expect(inner?.querySelectorAll('span')).toHaveLength(5)
    })

    it('renders with default size', () => {
      const { container } = render(<ButtonLoader />)
      expect(container.querySelector('.button-loader')).toBeInTheDocument()
    })

    it('accepts a custom size without throwing', () => {
      const { container } = render(<ButtonLoader size={24} />)
      expect(container.querySelector('.button-loader')).toBeInTheDocument()
    })
  })
})

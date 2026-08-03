import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PageLoader } from '../../../components/ui-kit/PageLoader'

describe('PageLoader', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<PageLoader />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('SVG is hidden from assistive technology', () => {
      const { container } = render(<PageLoader />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('rendering', () => {
    it('renders default loading text', () => {
      render(<PageLoader />)
      expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    it('renders custom loading text', () => {
      render(<PageLoader loadingText="Please wait…" />)
      expect(screen.getByText('Please wait…')).toBeInTheDocument()
    })

    it('renders the scan SVG', () => {
      const { container } = render(<PageLoader />)
      expect(container.querySelector('.page-loader-scan')).toBeInTheDocument()
    })

    it('renders the outer container', () => {
      const { container } = render(<PageLoader />)
      expect(container.querySelector('.page-loader-container')).toBeInTheDocument()
    })

    it('renders text in an h2', () => {
      render(<PageLoader loadingText="Processing" />)
      expect(screen.getByRole('heading', { level: 2, name: 'Processing' })).toBeInTheDocument()
    })
  })
})

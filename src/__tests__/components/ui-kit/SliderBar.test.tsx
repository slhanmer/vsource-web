import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SliderBar } from '../../../components/ui-kit/SliderBar'

describe('SliderBar', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<SliderBar value={100} onChange={jest.fn()} label="Width" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the slider container', () => {
      const { container } = render(<SliderBar value={100} onChange={jest.fn()} />)
      expect(container.querySelector('.slider-container')).toBeInTheDocument()
    })

    it('renders the track, fill, and thumb elements', () => {
      const { container } = render(<SliderBar value={100} onChange={jest.fn()} />)
      expect(container.querySelector('.slider-track')).toBeInTheDocument()
      expect(container.querySelector('.slider-fill')).toBeInTheDocument()
      expect(container.querySelector('.slider-thumb')).toBeInTheDocument()
    })

    it('renders the label when provided', () => {
      render(<SliderBar value={100} onChange={jest.fn()} label="Font Size" />)
      expect(screen.getByText('Font Size')).toBeInTheDocument()
    })

    it('does not render label when not provided', () => {
      const { container } = render(<SliderBar value={100} onChange={jest.fn()} />)
      expect(container.querySelector('.slider-label')).not.toBeInTheDocument()
    })

    it('renders the current value with unit', () => {
      render(<SliderBar value={150} onChange={jest.fn()} unit="px" />)
      expect(screen.getByText('150px')).toBeInTheDocument()
    })

    it('renders with a custom unit', () => {
      render(<SliderBar value={50} onChange={jest.fn()} unit="%" />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('applies width style', () => {
      const { container } = render(<SliderBar value={100} onChange={jest.fn()} width="300px" />)
      const container_ = container.querySelector('.slider-container') as HTMLElement
      expect(container_.style.width).toBe('300px')
    })
  })

  describe('fill percentage', () => {
    it('sets fill width to the thumb-centre position within min–max range', () => {
      const { container } = render(<SliderBar value={250} onChange={jest.fn()} min={0} max={500} />)
      const fill = container.querySelector('.slider-fill') as HTMLElement
      expect(fill.style.width).toBe('calc(50% + 0px)')
    })

    it('sets fill near 0% at min value (inset by half thumb)', () => {
      const { container } = render(<SliderBar value={50} onChange={jest.fn()} min={50} max={500} />)
      const fill = container.querySelector('.slider-fill') as HTMLElement
      expect(fill.style.width).toBe('calc(0% + 7px)')
    })

    it('sets fill near 100% at max value (inset by half thumb)', () => {
      const { container } = render(
        <SliderBar value={500} onChange={jest.fn()} min={50} max={500} />
      )
      const fill = container.querySelector('.slider-fill') as HTMLElement
      expect(fill.style.width).toBe('calc(100% - 7px)')
    })
  })
})

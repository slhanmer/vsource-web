import React, { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import Collapse, { CollapseRef } from '../../../components/ui-kit/Collapse'

describe('Collapse', () => {
  describe('accessibility', () => {
    it('has no axe violations when closed', async () => {
      const { container } = render(<Collapse title="Section">Content</Collapse>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations when open', async () => {
      const { container } = render(
        <Collapse title="Section" startOpen>
          Content
        </Collapse>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the title', () => {
      render(<Collapse title="My Section">Content</Collapse>)
      expect(screen.getByText('My Section')).toBeInTheDocument()
    })

    it('renders a ReactNode title', () => {
      render(<Collapse title={<strong data-testid="ttl">Title</strong>}>Content</Collapse>)
      expect(screen.getByTestId('ttl')).toBeInTheDocument()
    })

    it('renders children', () => {
      render(
        <Collapse title="T">
          <p>Child content</p>
        </Collapse>
      )
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('renders the toggle button', () => {
      render(<Collapse title="Section">Content</Collapse>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('applies the collapse CSS class', () => {
      const { container } = render(<Collapse title="T">C</Collapse>)
      expect(container.querySelector('.collapse')).toBeInTheDocument()
    })
  })

  describe('uncontrolled mode', () => {
    it('starts closed by default', () => {
      const { container } = render(<Collapse title="T">C</Collapse>)
      expect(container.querySelector('.collapse')).not.toHaveClass('open')
    })

    it('starts open when startOpen=true', () => {
      const { container } = render(
        <Collapse title="T" startOpen>
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).toHaveClass('open')
    })

    it('opens on toggle button click', () => {
      const { container } = render(<Collapse title="T">C</Collapse>)
      fireEvent.click(screen.getByRole('button'))
      expect(container.querySelector('.collapse')).toHaveClass('open')
    })

    it('closes after being opened', () => {
      const { container } = render(
        <Collapse title="T" startOpen>
          C
        </Collapse>
      )
      fireEvent.click(screen.getByRole('button'))
      expect(container.querySelector('.collapse')).not.toHaveClass('open')
    })
  })

  describe('controlled mode', () => {
    it('respects externally controlled isOpen=true', () => {
      const { container } = render(
        <Collapse title="T" isOpen onToggle={jest.fn()}>
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).toHaveClass('open')
    })

    it('respects externally controlled isOpen=false', () => {
      const { container } = render(
        <Collapse title="T" isOpen={false} onToggle={jest.fn()}>
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).not.toHaveClass('open')
    })

    it('calls onToggle when toggle button is clicked in controlled mode', () => {
      const onToggle = jest.fn()
      render(
        <Collapse title="T" isOpen={false} onToggle={onToggle}>
          C
        </Collapse>
      )
      fireEvent.click(screen.getByRole('button'))
      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('disabled state', () => {
    it('disables the toggle button when disabled=true', () => {
      render(
        <Collapse title="T" disabled>
          C
        </Collapse>
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies disabled class when disabled=true', () => {
      const { container } = render(
        <Collapse title="T" disabled>
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).toHaveClass('disabled')
    })

    it('does not open when disabled and clicked', () => {
      const { container } = render(
        <Collapse title="T" disabled>
          C
        </Collapse>
      )
      fireEvent.click(screen.getByRole('button'))
      expect(container.querySelector('.collapse')).not.toHaveClass('open')
    })
  })

  describe('error state', () => {
    it('applies error class when error=true', () => {
      const { container } = render(
        <Collapse title="T" error>
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).toHaveClass('error')
    })
  })

  describe('size variants', () => {
    it('applies full class by default', () => {
      const { container } = render(<Collapse title="T">C</Collapse>)
      expect(container.querySelector('.collapse')).toHaveClass('full')
    })

    it('applies small class when size="small"', () => {
      const { container } = render(
        <Collapse title="T" size="small">
          C
        </Collapse>
      )
      expect(container.querySelector('.collapse')).toHaveClass('small')
    })
  })

  describe('imperative handle', () => {
    it('exposes recalcHeight via ref without throwing', () => {
      const ref = createRef<CollapseRef>()
      render(
        <Collapse title="T" startOpen ref={ref}>
          C
        </Collapse>
      )
      expect(() => ref.current?.recalcHeight()).not.toThrow()
    })
  })
})

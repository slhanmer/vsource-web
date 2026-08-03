import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { createRef } from 'react'
import { Popover } from '../../../components/ui-kit/Popover'

describe('Popover', () => {
  describe('accessibility', () => {
    it('has no axe violations when open', async () => {
      render(
        <Popover x={100} y={200} isOpen onClose={jest.fn()} aria-label="Actions">
          <button>Action</button>
        </Popover>
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders nothing when isOpen=false', () => {
      render(
        <Popover x={0} y={0} isOpen={false} onClose={jest.fn()}>
          <span>Hidden</span>
        </Popover>
      )
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    })

    it('renders children when isOpen=true', () => {
      render(
        <Popover x={50} y={80} isOpen onClose={jest.fn()}>
          <span>Visible</span>
        </Popover>
      )
      expect(screen.getByText('Visible')).toBeInTheDocument()
    })

    it('positions at the provided point when it fits in the viewport', () => {
      render(
        <Popover x={120} y={240} isOpen onClose={jest.fn()}>
          <span>Menu</span>
        </Popover>
      )
      const panel = document.querySelector('.popover') as HTMLElement
      expect(panel.style.top).toBe('240px')
      expect(panel.style.left).toBe('120px')
    })

    it('clamps a point that would overflow the viewport', () => {
      const panel = () => document.querySelector('.popover') as HTMLElement
      render(
        <Popover
          x={window.innerWidth + 500}
          y={window.innerHeight + 500}
          isOpen
          onClose={jest.fn()}
        >
          <span>Menu</span>
        </Popover>
      )
      // jsdom reports zero size for the panel, so the clamp lands it on the
      // far edge minus the viewport padding rather than off-screen.
      expect(parseInt(panel().style.left, 10)).toBeLessThanOrEqual(window.innerWidth)
      expect(parseInt(panel().style.top, 10)).toBeLessThanOrEqual(window.innerHeight)
    })

    it('positions against an anchor element when anchorRef is given', () => {
      const anchorRef = createRef<HTMLButtonElement>()
      render(
        <>
          <button ref={anchorRef}>Filters</button>
          <Popover anchorRef={anchorRef} isOpen onClose={jest.fn()}>
            <span>Panel</span>
          </Popover>
        </>
      )
      const panel = document.querySelector('.popover') as HTMLElement
      // Anchored placement resolves to a concrete position rather than staying
      // unmeasured — jsdom's zero-size rects make the exact value uninteresting.
      expect(panel.style.visibility).toBe('visible')
      expect(panel.style.top).toMatch(/px$/)
    })
  })

  describe('interactions', () => {
    it('calls onClose when the backdrop is clicked', () => {
      const onClose = jest.fn()
      render(
        <Popover x={0} y={0} isOpen onClose={onClose}>
          <span>Menu</span>
        </Popover>
      )
      fireEvent.click(document.querySelector('.popover-backdrop')!)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when panel content is clicked', () => {
      const onClose = jest.fn()
      render(
        <Popover x={0} y={0} isOpen onClose={onClose}>
          <button>Do Something</button>
        </Popover>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Do Something' }))
      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose on Escape', () => {
      const onClose = jest.fn()
      render(
        <Popover x={0} y={0} isOpen onClose={onClose}>
          <span>Menu</span>
        </Popover>
      )
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not listen for Escape while closed', () => {
      const onClose = jest.fn()
      render(
        <Popover x={0} y={0} isOpen={false} onClose={onClose}>
          <span>Menu</span>
        </Popover>
      )
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })
})

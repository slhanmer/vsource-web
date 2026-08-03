import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Tooltip } from '../../../components/ui-kit/Tooltip'

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
}))

jest.mock('../../../hooks', () => ({
  useViewport: jest.fn(() => false),
  useHoverAndTouch: jest.fn(() => ({
    isHovered: false,
    isTouched: false,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    handleTouchStart: jest.fn(),
    handleTouchEnd: jest.fn(),
  })),
}))

describe('Tooltip', () => {
  describe('accessibility', () => {
    it('has no axe violations with children', async () => {
      const { container } = render(
        <Tooltip text="Helpful hint">
          <button>Hover me</button>
        </Tooltip>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Tooltip text="Hint">
          <button>Target</button>
        </Tooltip>
      )
      expect(screen.getByRole('button', { name: 'Target' })).toBeInTheDocument()
    })

    it('does not show tooltip text initially', () => {
      render(
        <Tooltip text="Hint text">
          <span>Trigger</span>
        </Tooltip>
      )
      expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
    })

    it('wraps children in tooltip-container div', () => {
      const { container } = render(
        <Tooltip text="Hint">
          <span>X</span>
        </Tooltip>
      )
      expect(container.querySelector('.tooltip-container')).toBeInTheDocument()
    })
  })

  describe('hover interactions', () => {
    it('shows tooltip text on mouse enter', () => {
      jest.useFakeTimers()
      render(
        <Tooltip text="My tooltip">
          <button>Hover</button>
        </Tooltip>
      )
      fireEvent.mouseEnter(document.querySelector('.tooltip-container')!)
      act(() => {
        jest.advanceTimersByTime(701)
      })
      expect(screen.getByText('My tooltip')).toBeInTheDocument()
      jest.useRealTimers()
    })

    it('hides tooltip on mouse leave', () => {
      jest.useFakeTimers()
      render(
        <Tooltip text="Disappear">
          <button>Hover</button>
        </Tooltip>
      )
      const container = document.querySelector('.tooltip-container')!
      fireEvent.mouseEnter(container)
      act(() => {
        jest.advanceTimersByTime(701)
      })
      fireEvent.mouseLeave(container)
      expect(screen.queryByText('Disappear')).not.toBeInTheDocument()
      jest.useRealTimers()
    })

    // Touch no longer opens tooltips — they're a hover affordance, and the
    // mobile trigger button was removed. Nothing to assert beyond the absence
    // of a touch handler.
  })

  describe('position variants', () => {
    // jsdom reports zero dimensions for every element, so the placement logic
    // sees no room on any side and flips to the opposite. Both the requested
    // side and its opposite are therefore correct here.
    const opposite: Record<string, string> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    }

    ;(['top', 'bottom', 'left', 'right'] as const).forEach((pos) => {
      it(`renders tooltip with a resolved side class for position="${pos}"`, () => {
        jest.useFakeTimers()
        render(
          <Tooltip text="Positioned" position={pos}>
            <span>T</span>
          </Tooltip>
        )
        fireEvent.mouseEnter(document.querySelector('.tooltip-container')!)
        act(() => {
          jest.advanceTimersByTime(701)
        })
        const bubble = document.querySelector('.tooltip-bubble')
        expect(bubble?.className).toMatch(new RegExp(`\\b(${pos}|${opposite[pos]})\\b`))
        jest.useRealTimers()
      })
    })
  })

  describe('delay prop', () => {
    it('shows tooltip after the specified delay', () => {
      jest.useFakeTimers()
      render(
        <Tooltip text="Delayed" delay={300}>
          <button>X</button>
        </Tooltip>
      )
      fireEvent.mouseEnter(document.querySelector('.tooltip-container')!)
      expect(screen.queryByText('Delayed')).not.toBeInTheDocument()
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.getByText('Delayed')).toBeInTheDocument()
      jest.useRealTimers()
    })
  })
})

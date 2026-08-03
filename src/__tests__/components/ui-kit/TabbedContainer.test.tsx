import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import TabbedContainer from '../../../components/ui-kit/TabbedContainer'
import { useViewport } from '@hooks'

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

const mockedUseViewport = useViewport as jest.Mock

const TABS = [
  { label: 'Details', icon: <span>📋</span> },
  { label: 'Settings', icon: <span>⚙️</span> },
  { label: 'History', icon: <span>📜</span> },
]

const CONTENT = [
  <p key="0">Details content</p>,
  <p key="1">Settings content</p>,
  <p key="2">History content</p>,
]

describe('TabbedContainer', () => {
  // Default to desktop layout; mobile tests override per-block.
  beforeEach(() => {
    mockedUseViewport.mockReturnValue(false)
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('renders tab elements with role="tab"', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('renders tabpanel with role="tabpanel"', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      // Only the active panel is exposed; the others are hidden.
      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('associates the active panel with its tab via aria-labelledby', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'tab-0')
    })
  })

  describe('rendering', () => {
    it('renders all tab labels', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getByText('Details')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('History')).toBeInTheDocument()
    })

    it('shows first tab content by default', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getByText('Details content')).toBeInTheDocument()
    })
  })

  describe('uncontrolled tab switching', () => {
    it('switches to the clicked tab', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.click(screen.getAllByRole('tab')[1])
      expect(screen.getByText('Settings content')).toBeInTheDocument()
      expect(screen.queryByText('Details content')).not.toBeInTheDocument()
    })

    it('marks clicked tab as active via aria-selected', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.click(screen.getAllByRole('tab')[2])
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('controlled mode', () => {
    it('respects activeTab prop', () => {
      render(
        <TabbedContainer tabs={TABS} content={CONTENT} activeTab={1} onTabChange={jest.fn()} />
      )
      expect(screen.getByText('Settings content')).toBeInTheDocument()
    })

    it('calls onTabChange with index when tab is clicked', () => {
      const onTabChange = jest.fn()
      render(
        <TabbedContainer tabs={TABS} content={CONTENT} activeTab={0} onTabChange={onTabChange} />
      )
      fireEvent.click(screen.getAllByRole('tab')[2])
      expect(onTabChange).toHaveBeenCalledWith(2)
    })
  })

  describe('keyboard navigation', () => {
    it('sets roving tabindex (active=0, others=-1)', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('tabindex', '0')
      expect(tabs[1]).toHaveAttribute('tabindex', '-1')
      expect(tabs[2]).toHaveAttribute('tabindex', '-1')
    })

    it('moves roving tabindex to the newly selected tab', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowRight' })
      const tabs = screen.getAllByRole('tab')
      expect(tabs[1]).toHaveAttribute('tabindex', '0')
      expect(tabs[0]).toHaveAttribute('tabindex', '-1')
    })

    it('ArrowRight moves selection to the next tab', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowRight' })
      expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('ArrowLeft wraps from the first tab to the last', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowLeft' })
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('ArrowRight wraps from the last tab to the first', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      const tabs = screen.getAllByRole('tab')
      fireEvent.keyDown(tabs[0], { key: 'End' }) // move to last
      fireEvent.keyDown(screen.getAllByRole('tab')[2], { key: 'ArrowRight' })
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('Home selects the first tab and End selects the last', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.keyDown(screen.getAllByRole('tab')[1], { key: 'End' })
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
      fireEvent.keyDown(screen.getAllByRole('tab')[2], { key: 'Home' })
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('arrow navigation skips disabled tabs', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[0, 3, 0]} />)
      // From tab 0, ArrowRight should skip disabled tab 1 and land on tab 2.
      fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowRight' })
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('Enter activates the focused tab (controlled mode)', () => {
      const onTabChange = jest.fn()
      render(
        <TabbedContainer tabs={TABS} content={CONTENT} activeTab={0} onTabChange={onTabChange} />
      )
      fireEvent.keyDown(screen.getAllByRole('tab')[2], { key: 'Enter' })
      expect(onTabChange).toHaveBeenCalledWith(2)
    })

    it('Space activates the focused tab (controlled mode)', () => {
      const onTabChange = jest.fn()
      render(
        <TabbedContainer tabs={TABS} content={CONTENT} activeTab={0} onTabChange={onTabChange} />
      )
      fireEvent.keyDown(screen.getAllByRole('tab')[1], { key: ' ' })
      expect(onTabChange).toHaveBeenCalledWith(1)
    })
  })

  describe('statuses', () => {
    it('applies complete class to tab with status=1', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[1, 0, 0]} />)
      expect(screen.getAllByRole('tab')[0]).toHaveClass('complete')
    })

    it('applies incomplete class to tab with status=2', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[0, 2, 0]} />)
      expect(screen.getAllByRole('tab')[1]).toHaveClass('incomplete')
    })

    it('applies disabled class to tab with status=3', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[0, 0, 3]} />)
      expect(screen.getAllByRole('tab')[2]).toHaveClass('disabled')
    })

    it('marks a disabled tab with aria-disabled', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[0, 0, 3]} />)
      expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not switch to a disabled tab on click', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} statuses={[0, 0, 3]} />)
      fireEvent.click(screen.getAllByRole('tab')[2])
      expect(screen.getByText('Details content')).toBeInTheDocument()
    })
  })

  describe('save button', () => {
    it('does not render save button by default', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders save button when showSaveButton=true', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} showSaveButton />)
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('renders custom save button name', () => {
      render(
        <TabbedContainer
          tabs={TABS}
          content={CONTENT}
          showSaveButton
          saveButtonName="Apply changes"
        />
      )
      expect(screen.getByRole('button', { name: /apply changes/i })).toBeInTheDocument()
    })

    it('disables save button when saveDisabled=true', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} showSaveButton saveDisabled />)
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
    })
  })

  describe('mobile layout', () => {
    beforeEach(() => {
      mockedUseViewport.mockReturnValue(true)
    })

    it('has no axe violations', async () => {
      const { container } = render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('renders mobile tabs with role="tab"', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('gives icon-only mobile tabs an accessible name from label', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
    })

    it('switches tabs via keyboard on mobile', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowRight' })
      expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('exposes the active panel with a labelledby association', () => {
      render(<TabbedContainer tabs={TABS} content={CONTENT} />)
      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'tab-0')
    })
  })
})

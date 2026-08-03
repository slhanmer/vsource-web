import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DragReorder } from '../../../components/ui-kit/DragReorder'

jest.mock('../../../utils', () => ({
  restrictToParentBounds: jest.fn(() => (args: any) => args),
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
  getCssVar: jest.fn(() => '#000000'),
}))

const ITEMS = [
  { id: '1', content: 'First item' },
  { id: '2', content: 'Second item' },
  { id: '3', content: 'Third item' },
]

describe('DragReorder', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders all items', () => {
      render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      expect(screen.getByText('First item')).toBeInTheDocument()
      expect(screen.getByText('Second item')).toBeInTheDocument()
      expect(screen.getByText('Third item')).toBeInTheDocument()
    })

    it('renders a list', () => {
      const { container } = render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      expect(container.querySelector('.drag-reorder-list')).toBeInTheDocument()
    })

    it('renders DragIndicator for each item', () => {
      const { container } = render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      expect(container.querySelectorAll('.drag-indicator-container')).toHaveLength(3)
    })
  })

  describe('first/last indicators', () => {
    it('first item has disabled up-chevron', () => {
      const { container } = render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      const firstItem = container.querySelector('.reorder-item:first-child')
      const chevrons = firstItem?.querySelectorAll('.chevron')
      expect(chevrons?.[0]).toHaveClass('disabled')
      expect(chevrons?.[1]).not.toHaveClass('disabled')
    })

    it('last item has disabled down-chevron', () => {
      const { container } = render(<DragReorder items={ITEMS} onChange={jest.fn()} />)
      const lastItem = container.querySelector('.reorder-item:last-child')
      const chevrons = lastItem?.querySelectorAll('.chevron')
      expect(chevrons?.[0]).not.toHaveClass('disabled')
      expect(chevrons?.[1]).toHaveClass('disabled')
    })
  })

  describe('editingTarget', () => {
    it('renders textarea for the editing target item', () => {
      render(
        <DragReorder
          items={ITEMS}
          onChange={jest.fn()}
          editingTarget="2"
          onItemChange={jest.fn()}
        />
      )
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue('Second item')
    })

    it('does not render textarea for non-editing items', () => {
      render(
        <DragReorder
          items={ITEMS}
          onChange={jest.fn()}
          editingTarget="1"
          onItemChange={jest.fn()}
        />
      )
      expect(screen.queryByDisplayValue('Second item')).not.toBeInTheDocument()
    })
  })

  describe('readOnly prop', () => {
    it('renders without throwing when readOnly=true', () => {
      expect(() =>
        render(<DragReorder items={ITEMS} onChange={jest.fn()} readOnly />)
      ).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('renders correctly with a single item', () => {
      render(<DragReorder items={[{ id: '1', content: 'Only' }]} onChange={jest.fn()} />)
      expect(screen.getByText('Only')).toBeInTheDocument()
    })

    it('renders correctly with empty items array', () => {
      const { container } = render(<DragReorder items={[]} onChange={jest.fn()} />)
      expect(container.querySelector('.drag-reorder-list')).toBeInTheDocument()
    })
  })
})

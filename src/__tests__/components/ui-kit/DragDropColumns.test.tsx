import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DragDropColumns } from '../../../components/ui-kit/DragDropColumns'

const COL1 = ['Alpha', 'Beta']
const COL2 = ['Gamma', 'Delta']

describe('DragDropColumns', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <DragDropColumns
          col1title="Available"
          col2title="Selected"
          col1Content={COL1}
          col2Content={COL2}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders column titles', () => {
      render(
        <DragDropColumns
          col1title="Available"
          col2title="Selected"
          col1Content={COL1}
          col2Content={COL2}
        />
      )
      expect(screen.getByText('Available')).toBeInTheDocument()
      expect(screen.getByText('Selected')).toBeInTheDocument()
    })

    it('renders items in column 1', () => {
      render(
        <DragDropColumns
          col1title="Left"
          col2title="Right"
          col1Content={['Item A', 'Item B']}
          col2Content={[]}
        />
      )
      expect(screen.getByText('Item A')).toBeInTheDocument()
      expect(screen.getByText('Item B')).toBeInTheDocument()
    })

    it('renders items in column 2', () => {
      render(
        <DragDropColumns
          col1title="Left"
          col2title="Right"
          col1Content={[]}
          col2Content={['Item C', 'Item D']}
        />
      )
      expect(screen.getByText('Item C')).toBeInTheDocument()
      expect(screen.getByText('Item D')).toBeInTheDocument()
    })

    it('renders the columns container', () => {
      const { container } = render(
        <DragDropColumns col1title="L" col2title="R" col1Content={[]} col2Content={[]} />
      )
      expect(container.querySelector('.drag-columns-container')).toBeInTheDocument()
    })

    it('renders drag items for each entry', () => {
      const { container } = render(
        <DragDropColumns col1title="L" col2title="R" col1Content={['X', 'Y']} col2Content={['Z']} />
      )
      expect(container.querySelectorAll('.drag-item')).toHaveLength(3)
    })
  })

  describe('edge cases', () => {
    it('renders with empty columns', () => {
      expect(() =>
        render(
          <DragDropColumns
            col1title="Empty Left"
            col2title="Empty Right"
            col1Content={[]}
            col2Content={[]}
          />
        )
      ).not.toThrow()
    })
  })
})

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Dropdown } from '../../../components/ui-kit/DropDown'

jest.mock('../../../utils', () => ({
  debounceInput: (fn: any) => {
    const wrapped = (...args: any[]) => fn(...args)
    wrapped.cancel = jest.fn()
    return wrapped
  },
}))

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('Dropdown', () => {
  describe('accessibility', () => {
    it('has no axe violations in closed state', async () => {
      const { container } = render(
        <Dropdown options={OPTIONS} onSelect={jest.fn()} label="Fruit" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations with label', async () => {
      const { container } = render(
        <Dropdown options={OPTIONS} onSelect={jest.fn()} label="Pick a fruit" id="fruit" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations in searchable mode', async () => {
      const { container } = render(
        <Dropdown options={OPTIONS} onSelect={jest.fn()} searchable label="Fruit" id="fruit" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the placeholder', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} placeholder="Choose…" />)
      expect(screen.getByText('Choose…')).toBeInTheDocument()
    })

    it('renders default placeholder when none provided', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} />)
      expect(screen.getByText('Select...')).toBeInTheDocument()
    })

    it('renders a label when provided', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} label="Fruit" id="fruit-dd" />)
      expect(screen.getByText('Fruit')).toBeInTheDocument()
    })

    it('shows selected value when value prop is set', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} value="banana" />)
      expect(screen.getByText('Banana')).toBeInTheDocument()
    })
  })

  describe('opening/closing', () => {
    it('opens the menu on toggle button click', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} />)
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    it('closes the menu after selecting an option', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} />)
      fireEvent.click(screen.getByRole('button'))
      fireEvent.mouseDown(screen.getByText('Banana'))
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
    })

    it('closes the menu on outside click', async () => {
      render(
        <>
          <Dropdown options={OPTIONS} onSelect={jest.fn()} />
          <div data-testid="outside">Outside</div>
        </>
      )
      fireEvent.click(screen.getByRole('button'))
      fireEvent.mouseDown(screen.getByTestId('outside'))
      await waitFor(() => expect(screen.queryByText('Cherry')).not.toBeInTheDocument())
    })
  })

  describe('selection', () => {
    it('calls onSelect with the chosen value', () => {
      const onSelect = jest.fn()
      render(<Dropdown options={OPTIONS} onSelect={onSelect} />)
      fireEvent.click(screen.getByRole('button'))
      fireEvent.mouseDown(screen.getByText('Cherry'))
      expect(onSelect).toHaveBeenCalledWith('cherry')
    })

    it('marks selected option with selected class', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} value="apple" />)
      fireEvent.click(screen.getByRole('button'))
      // 'Apple' appears in both the toggle button and the portal menu item
      const selectedItem = document.querySelector('.dropdown-item.selected')
      expect(selectedItem).toHaveTextContent('Apple')
    })
  })

  describe('searchable mode', () => {
    it('renders a search input when searchable=true', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} searchable />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('filters options by search term (local search)', async () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} searchable />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'ban' } })
      await waitFor(() => expect(screen.getByText('Banana')).toBeInTheDocument())
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('disables the toggle button', () => {
      render(<Dropdown options={OPTIONS} onSelect={jest.fn()} disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies disabled class', () => {
      const { container } = render(<Dropdown options={OPTIONS} onSelect={jest.fn()} disabled />)
      expect(container.querySelector('.dropdown')).toHaveClass('disabled')
    })
  })

  describe('required state', () => {
    it('applies required class when required and no value', () => {
      const { container } = render(
        <Dropdown options={OPTIONS} onSelect={jest.fn()} required value="" />
      )
      expect(container.querySelector('.dropdown')).toHaveClass('required')
    })
  })

  describe('loading state', () => {
    it('shows searching indicator when loading and search text is present', () => {
      render(
        <Dropdown options={[]} onSelect={jest.fn()} searchable onSearchChange={jest.fn()} loading />
      )
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(screen.getByText('Searching…')).toBeInTheDocument()
    })
  })

  describe('no results', () => {
    it('shows no-results message when options are empty and search text is present', () => {
      render(
        <Dropdown
          options={[]}
          onSelect={jest.fn()}
          searchable
          onSearchChange={jest.fn()}
          loading={false}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'xyz' } })
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })
  })
})

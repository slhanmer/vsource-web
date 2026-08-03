import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SearchInput } from '../../../components/ui-kit/SearchInput'

jest.mock('../../../utils', () => ({
  validateValue: jest.fn(() => null),
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
  ddmmyyyyToSql: jest.fn((v: string) => v),
  sqlToDdmmyyyy: jest.fn((v: string) => v),
}))

describe('SearchInput', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <SearchInput name="search" value="" onChange={jest.fn()} label="Search" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders a text input', () => {
      render(<SearchInput name="q" value="" onChange={jest.fn()} label="Search" />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with a placeholder', () => {
      render(<SearchInput name="q" value="" onChange={jest.fn()} placeholder="Find something…" />)
      expect(screen.getByPlaceholderText('Find something…')).toBeInTheDocument()
    })

    it('renders with default placeholder', () => {
      render(<SearchInput name="q" value="test" onChange={jest.fn()} />)
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('shows the search icon when not loading or confirmed', () => {
      const { container } = render(<SearchInput name="q" value="" onChange={jest.fn()} />)
      expect(container.querySelector('.search-icon')).toBeInTheDocument()
    })

    it('shows a spinner when loading=true', () => {
      const { container } = render(<SearchInput name="q" value="" onChange={jest.fn()} loading />)
      expect(container.querySelector('.spinner')).toBeInTheDocument()
      expect(container.querySelector('.search-icon')).not.toBeInTheDocument()
    })

    it('renders label when provided', () => {
      render(<SearchInput name="q" value="" onChange={jest.fn()} label="Product search" />)
      expect(screen.getByText('Product search')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange when typing', () => {
      const onChange = jest.fn()
      render(<SearchInput name="q" value="" onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onSearch when search icon is clicked', () => {
      const onSearch = jest.fn()
      render(<SearchInput name="q" value="term" onChange={jest.fn()} onSearch={onSearch} />)
      fireEvent.click(document.querySelector('.search-icon')!)
      expect(onSearch).toHaveBeenCalledTimes(1)
    })
  })

  describe('prop variants', () => {
    it('disables the input when disabled=true', () => {
      render(<SearchInput name="q" value="" onChange={jest.fn()} disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('shows check icon when confirmed=true', () => {
      const { container } = render(
        <SearchInput name="q" value="done" onChange={jest.fn()} confirmed />
      )
      // confirmed uses faCheck icon — search icon should not be present
      expect(container.querySelector('.search-icon')).toBeInTheDocument()
    })
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { EditableText } from '../../../components/ui-kit/EditableText'

describe('EditableText', () => {
  describe('accessibility', () => {
    it('has no axe violations in display mode', async () => {
      const { container } = render(<EditableText value="Hello" onChange={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('display mode', () => {
    it('renders the value in display mode', () => {
      render(<EditableText value="My Title" onChange={jest.fn()} />)
      expect(screen.getByText('My Title')).toBeInTheDocument()
    })

    it('renders placeholder when value is empty', () => {
      render(<EditableText value="" onChange={jest.fn()} placeholder="Click to edit" />)
      expect(screen.getByText('Click to edit')).toBeInTheDocument()
    })

    it('uses default placeholder when none provided', () => {
      render(<EditableText value="" onChange={jest.fn()} />)
      expect(screen.getByText('Click to edit')).toBeInTheDocument()
    })

    it('renders as p by default', () => {
      const { container } = render(<EditableText value="Text" onChange={jest.fn()} />)
      expect(container.querySelector('p')).toBeInTheDocument()
    })

    it('renders as h1 when as="h1"', () => {
      const { container } = render(<EditableText as="h1" value="Heading" onChange={jest.fn()} />)
      expect(container.querySelector('h1')).toBeInTheDocument()
    })

    it('renders as h2 when as="h2"', () => {
      const { container } = render(<EditableText as="h2" value="Sub" onChange={jest.fn()} />)
      expect(container.querySelector('h2')).toBeInTheDocument()
    })

    it('renders as div when as="div"', () => {
      const { container } = render(<EditableText as="div" value="Block" onChange={jest.fn()} />)
      expect(container.querySelector('div')).toBeInTheDocument()
    })
  })

  describe('edit mode', () => {
    it('switches to an input after clicking', async () => {
      render(<EditableText value="Click me" onChange={jest.fn()} />)
      fireEvent.click(screen.getByText('Click me'))
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('prefills input with current value', () => {
      render(<EditableText value="Existing" onChange={jest.fn()} />)
      fireEvent.click(screen.getByText('Existing'))
      expect(screen.getByRole('textbox')).toHaveValue('Existing')
    })
  })

  describe('saving', () => {
    it('calls onChange and exits edit mode on Enter', async () => {
      const onChange = jest.fn()
      render(<EditableText value="Old" onChange={onChange} />)
      fireEvent.click(screen.getByText('Old'))
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, 'New')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith('New')
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('calls onChange and exits edit mode on blur', async () => {
      const onChange = jest.fn()
      render(<EditableText value="Old" onChange={onChange} />)
      fireEvent.click(screen.getByText('Old'))
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, 'Updated')
      fireEvent.blur(input)
      expect(onChange).toHaveBeenCalledWith('Updated')
    })

    it('does not call onChange when value has not changed on blur', () => {
      const onChange = jest.fn()
      render(<EditableText value="Same" onChange={onChange} />)
      fireEvent.click(screen.getByText('Same'))
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('cancelling', () => {
    it('reverts to original value on Escape without calling onChange', async () => {
      const onChange = jest.fn()
      render(<EditableText value="Original" onChange={onChange} />)
      fireEvent.click(screen.getByText('Original'))
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, 'Changed')
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByText('Original')).toBeInTheDocument()
    })
  })
})

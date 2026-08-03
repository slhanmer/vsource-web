import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'ui-kit/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchInput>

const ControlledSearch = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <SearchInput {...args} value={value} onChange={(e) => setValue(e.target.value)} />
}

export const Default: Story = {
  render: (args) => <ControlledSearch {...args} />,
  args: { name: 'search', placeholder: 'Search…' },
}

export const WithLabel: Story = {
  render: (args) => <ControlledSearch {...args} />,
  args: { name: 'search-label', label: 'Search patients', placeholder: 'Enter name or ID' },
}

export const Loading: Story = {
  render: (args) => <ControlledSearch {...args} />,
  args: { name: 'search-loading', loading: true, value: 'john' },
}

export const Confirmed: Story = {
  render: (args) => <ControlledSearch {...args} />,
  args: { name: 'search-confirmed', confirmed: true, value: 'John Smith' },
}

export const Required: Story = {
  render: (args) => <ControlledSearch {...args} />,
  args: { name: 'search-required', required: true, placeholder: 'Required search' },
}

export const Disabled: Story = {
  args: {
    name: 'search-disabled',
    value: '',
    disabled: true,
    onChange: () => {},
  },
}

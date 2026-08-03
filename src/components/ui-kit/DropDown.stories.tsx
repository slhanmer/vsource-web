import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Dropdown } from './DropDown'

const meta: Meta<typeof Dropdown> = {
  title: 'ui-kit/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dropdown>

const FRUIT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
]

const ControlledDropdown = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <Dropdown {...args} value={value} onSelect={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: {
    options: FRUIT_OPTIONS,
    placeholder: 'Select a fruit',
    label: 'Fruit',
  },
}

export const WithValue: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: {
    options: FRUIT_OPTIONS,
    value: 'cherry',
    label: 'Fruit',
  },
}

export const Searchable: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: {
    options: FRUIT_OPTIONS,
    label: 'Search fruit',
    searchable: true,
    placeholder: 'Type to search…',
  },
}

export const Required: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: {
    options: FRUIT_OPTIONS,
    label: 'Required field',
    required: true,
    placeholder: 'Must select one',
  },
}

export const Disabled: Story = {
  args: {
    options: FRUIT_OPTIONS,
    label: 'Disabled',
    disabled: true,
    value: 'apple',
    onSelect: () => {},
  },
}

export const FullWidth: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: {
    options: FRUIT_OPTIONS,
    label: 'Full-width dropdown',
    fullWidth: true,
    placeholder: 'Select…',
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ToggleButton } from './ToggleButton'

const meta: Meta<typeof ToggleButton> = {
  title: 'ui-kit/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToggleButton>

const ControlledToggle = (args: any) => {
  const [value, setValue] = useState(args.value ?? args.options?.[0]?.value ?? '')
  return <ToggleButton {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledToggle {...args} />,
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    value: 'day',
  },
}

export const TwoOptions: Story = {
  render: (args) => <ControlledToggle {...args} />,
  args: {
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    value: 'yes',
  },
}

export const WithDisabledOption: Story = {
  render: (args) => <ControlledToggle {...args} />,
  args: {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Archived', value: 'archived', disabled: true },
    ],
    value: 'active',
  },
}

export const GroupDisabled: Story = {
  render: (args) => <ControlledToggle {...args} />,
  args: {
    options: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ],
    value: 'a',
    disabled: true,
  },
}

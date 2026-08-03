import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import Choice from './Choice'

const meta: Meta<typeof Choice> = {
  title: 'ui-kit/Choice',
  component: Choice,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Choice>

const ControlledChoice = (args: any) => {
  const [checked, setChecked] = useState(args.checked ?? false)
  return <Choice {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
}

export const Default: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'default', label: 'Accept terms and conditions' },
}

export const Checked: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'checked', label: 'Already checked', checked: true },
}

export const Radio: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'radio', label: 'Select this option', type: 'radio' },
}

export const Required: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'required', label: 'Required field', required: true },
}

export const Disabled: Story = {
  args: { name: 'disabled', label: 'Disabled option', disabled: true },
}

export const WithError: Story = {
  args: {
    name: 'error',
    label: 'Must be checked',
    error: 'This field is required',
  },
}

export const Large: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'large', label: 'Large checkbox', size: 'large' },
}

export const SuccessMark: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'success', label: 'Verified', checked: true, markType: 'success' },
}

export const ErrorMark: Story = {
  render: (args) => <ControlledChoice {...args} />,
  args: { name: 'err', label: 'Flagged', checked: true, markType: 'error' },
}

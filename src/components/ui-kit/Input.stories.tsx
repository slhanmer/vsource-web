import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'ui-kit/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

const ControlledInput = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
}

export const Text: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'text',
    label: 'Full name',
    hideLabel: false,
    type: 'text',
    placeholder: 'Enter your name',
  },
}

export const Email: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'email',
    label: 'Email address',
    hideLabel: false,
    type: 'email',
    placeholder: 'you@example.com',
  },
}

export const Password: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'password',
    label: 'Password',
    hideLabel: false,
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const Currency: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'amount',
    label: 'Amount',
    hideLabel: false,
    type: 'currency',
    placeholder: '0.00',
  },
}

export const Textarea: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'notes',
    label: 'Notes',
    hideLabel: false,
    type: 'text',
    maxLength: 500,
    placeholder: 'Enter notes…',
  },
}

export const Required: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'required-field',
    label: 'Required',
    hideLabel: false,
    type: 'text',
    required: true,
    placeholder: 'Cannot be empty',
  },
}

export const WithError: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'error-field',
    label: 'Email',
    hideLabel: false,
    type: 'email',
    value: 'not-an-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    name: 'disabled-field',
    label: 'Read-only',
    hideLabel: false,
    type: 'text',
    value: 'Cannot be changed',
    disabled: true,
    onChange: () => {},
  },
}

export const Date: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'dob',
    label: 'Date of Birth',
    hideLabel: false,
    type: 'date',
  },
}

export const Colour: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'brand-colour',
    label: 'Brand Colour',
    hideLabel: false,
    type: 'colour',
    value: '#3b82f6',
  },
}

export const FullWidth: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    name: 'fullwidth',
    label: 'Full-width input',
    hideLabel: false,
    type: 'text',
    fullWidth: true,
    placeholder: 'Stretches to container width',
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { TimeInputMask } from './TimeInputMask'

const meta: Meta<typeof TimeInputMask> = {
  title: 'ui-kit/TimeInputMask',
  component: TimeInputMask,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TimeInputMask>

const ControlledMask = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <TimeInputMask {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: {},
}

export const WithValue: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { value: '09:30 AM' },
}

export const Afternoon: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { value: '02:45 PM' },
}

export const Disabled: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { value: '08:00 AM', disabled: true },
}

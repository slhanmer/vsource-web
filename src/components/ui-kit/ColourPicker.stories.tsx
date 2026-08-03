import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ColourPicker } from './ColourPicker'

const meta: Meta<typeof ColourPicker> = {
  title: 'ui-kit/ColourPicker',
  component: ColourPicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColourPicker>

const ControlledPicker = (args: any) => {
  const [value, setValue] = useState(args.value ?? '#3b82f6')
  return (
    <div>
      <ColourPicker {...args} value={value} onChange={setValue} />
      <p style={{ marginTop: '8px', fontFamily: 'monospace' }}>Selected: {value}</p>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ControlledPicker {...args} />,
  args: { value: '#3b82f6' },
}

export const Red: Story = {
  render: (args) => <ControlledPicker {...args} />,
  args: { value: '#ef4444' },
}

export const Green: Story = {
  render: (args) => <ControlledPicker {...args} />,
  args: { value: '#22c55e' },
}

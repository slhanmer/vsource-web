import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { DatePicker } from './DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'ui-kit/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

const ControlledPicker = (args: any) => {
  const [value, setValue] = useState<Date[]>(args.value ?? [])
  return (
    <div style={{ padding: '16px' }}>
      <DatePicker {...args} value={value} onChange={setValue} />
      <p style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
        Selected:{' '}
        {value.length > 0 ? value.map((d) => d.toLocaleDateString('en-AU')).join(', ') : 'None'}
      </p>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ControlledPicker {...args} />,
  args: {},
}

export const WithPreselectedRange: Story = {
  render: (args) => <ControlledPicker {...args} />,
  args: {
    value: [
      new Date(2026, 4, 20),
      new Date(2026, 4, 21),
      new Date(2026, 4, 22),
      new Date(2026, 4, 23),
      new Date(2026, 4, 24),
    ],
  },
}

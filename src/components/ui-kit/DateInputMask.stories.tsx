import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { DateInputMask } from './DateInputMask'

const meta: Meta<typeof DateInputMask> = {
  title: 'ui-kit/DateInputMask',
  component: DateInputMask,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DateInputMask>

const ControlledMask = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <DateInputMask {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { disabled: false, format: 'ddmmyyyy' },
}

export const WithValue: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { value: '27-05-2026', disabled: false, format: 'ddmmyyyy' },
}

export const MonthYear: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { disabled: false, format: 'mmyyyy' },
}

export const YearOnly: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { disabled: false, format: 'yyyy' },
}

export const Disabled: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { disabled: true, value: '01-01-2024', format: 'ddmmyyyy' },
}

export const ReadOnly: Story = {
  render: (args) => <ControlledMask {...args} />,
  args: { disabled: false, readOnly: true, value: '15-06-2025', format: 'ddmmyyyy' },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SliderBar } from './SliderBar'

const meta: Meta<typeof SliderBar> = {
  title: 'ui-kit/SliderBar',
  component: SliderBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SliderBar>

// Controlled wrapper since SliderBar requires value + onChange
const ControlledSlider = (args: any) => {
  const [value, setValue] = useState(args.value ?? 100)
  return <SliderBar {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledSlider {...args} />,
  args: {
    value: 100,
    min: 50,
    max: 500,
    step: 10,
    unit: 'px',
    label: 'Size',
  },
}

export const WithLabel: Story = {
  render: (args) => <ControlledSlider {...args} />,
  args: {
    value: 200,
    min: 50,
    max: 500,
    step: 10,
    label: 'Width',
    unit: 'px',
  },
}

export const SmallRange: Story = {
  render: (args) => <ControlledSlider {...args} />,
  args: {
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    label: 'Opacity',
    unit: '%',
  },
}

export const LogarithmicScale: Story = {
  render: (args) => <ControlledSlider {...args} />,
  args: {
    value: 100,
    label: 'Zoom (log scale)',
    unit: '%',
    scale: {
      toSlider: (value: number) => Math.log(value / 50) / Math.log(500 / 50),
      fromSlider: (pos: number) => Math.round(50 * Math.pow(500 / 50, pos)),
    },
  },
}

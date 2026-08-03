import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SlideSwitch } from './SlideSwitch'

const meta: Meta<typeof SlideSwitch> = {
  title: 'ui-kit/SlideSwitch',
  component: SlideSwitch,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SlideSwitch>

const ControlledSwitch = (args: any) => {
  const [checked, setChecked] = useState(args.checked ?? false)
  return <SlideSwitch {...args} checked={checked} onChange={setChecked} />
}

export const Off: Story = {
  render: (args) => <ControlledSwitch {...args} />,
  args: { checked: false },
}

export const On: Story = {
  render: (args) => <ControlledSwitch {...args} />,
  args: { checked: true },
}

export const WithLabel: Story = {
  render: (args) => <ControlledSwitch {...args} />,
  args: { checked: false, label: 'Enable notifications' },
}

export const WithLabelOn: Story = {
  render: (args) => <ControlledSwitch {...args} />,
  args: { checked: true, label: 'Notifications on' },
}

export const Disabled: Story = {
  args: { checked: false, disabled: true, onChange: () => {} },
}

export const DisabledOn: Story = {
  args: { checked: true, disabled: true, onChange: () => {} },
}

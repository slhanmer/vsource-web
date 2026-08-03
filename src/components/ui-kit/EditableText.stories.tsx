import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { EditableText } from './EditableText'

const meta: Meta<typeof EditableText> = {
  title: 'ui-kit/EditableText',
  component: EditableText,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EditableText>

const ControlledEditable = (args: any) => {
  const [value, setValue] = useState(args.value ?? '')
  return <EditableText {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <ControlledEditable {...args} />,
  args: { value: 'Click me to edit', as: 'p' },
}

export const Empty: Story = {
  render: (args) => <ControlledEditable {...args} />,
  args: { value: '', placeholder: 'Click to add a title', as: 'p' },
}

export const AsHeading: Story = {
  render: (args) => <ControlledEditable {...args} />,
  args: { value: 'Section Heading', as: 'h2' },
}

export const AsH3: Story = {
  render: (args) => <ControlledEditable {...args} />,
  args: { value: 'Sub-section title', as: 'h3' },
}

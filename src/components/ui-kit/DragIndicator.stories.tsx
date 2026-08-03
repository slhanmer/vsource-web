import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DragIndicator } from './DragIndicator'

const meta: Meta<typeof DragIndicator> = {
  title: 'ui-kit/DragIndicator',
  component: DragIndicator,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DragIndicator>

export const Default: Story = {}

export const First: Story = {
  args: { first: true },
}

export const Last: Story = {
  args: { last: true },
}

export const OnlyItem: Story = {
  args: { first: true, last: true },
}

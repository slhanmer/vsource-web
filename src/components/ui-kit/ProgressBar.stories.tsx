import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ui-kit/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Zero: Story = {
  args: { progress: 0 },
}

export const Quarter: Story = {
  args: { progress: 25 },
}

export const Half: Story = {
  args: { progress: 50 },
}

export const ThreeQuarters: Story = {
  args: { progress: 75 },
}

export const Complete: Story = {
  args: { progress: 100 },
}

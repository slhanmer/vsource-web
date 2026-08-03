import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ButtonLoader } from './ButtonLoader'

const meta: Meta<typeof ButtonLoader> = {
  title: 'ui-kit/ButtonLoader',
  component: ButtonLoader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ButtonLoader>

export const Default: Story = {}

export const CustomSize: Story = {
  args: { size: 24 },
}

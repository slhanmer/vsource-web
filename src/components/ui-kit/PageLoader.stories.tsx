import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageLoader } from './PageLoader'

const meta: Meta<typeof PageLoader> = {
  title: 'ui-kit/PageLoader',
  component: PageLoader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageLoader>

export const Default: Story = {}

export const CustomText: Story = {
  args: { loadingText: 'Please wait…' },
}

export const Saving: Story = {
  args: { loadingText: 'Saving' },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'ui-kit/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Top: Story = {
  args: {
    text: 'This is a tooltip on top',
    position: 'top',
    children: <button>Hover me (top)</button>,
  },
}

export const Bottom: Story = {
  args: {
    text: 'Tooltip below the element',
    position: 'bottom',
    children: <button>Hover me (bottom)</button>,
  },
}

export const Left: Story = {
  args: {
    text: 'Tooltip to the left',
    position: 'left',
    children: <button>Hover me (left)</button>,
  },
}

export const Right: Story = {
  args: {
    text: 'Tooltip to the right',
    position: 'right',
    children: <button>Hover me (right)</button>,
  },
}

export const WithDelay: Story = {
  args: {
    text: 'Appears after 500ms delay',
    delay: 500,
    position: 'top',
    children: <button>Hover for delayed tooltip</button>,
  },
}

export const PreviewMode: Story = {
  args: {
    text: 'This is a wider preview-mode tooltip used in form builder contexts.',
    previewMode: true,
    position: 'top',
    children: <button>Hover for preview tooltip</button>,
  },
}

export const CustomWidth: Story = {
  args: {
    text: 'This tooltip has a fixed custom width applied.',
    width: '200px',
    position: 'bottom',
    children: <button>Custom width tooltip</button>,
  },
}

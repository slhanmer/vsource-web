import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Camera } from './Camera'

const meta: Meta<typeof Camera> = {
  title: 'ui-kit/Camera',
  component: Camera,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Webcam capture component. Clicking the camera icon requests device camera access. ' +
          'Browser permissions must be granted; in Storybook the live stream will open on click.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Camera>

export const Default: Story = {
  args: {
    onCapture: (src: string) => console.log('Captured:', src.slice(0, 40)),
    size: 'large',
  },
}

export const Small: Story = {
  args: {
    onCapture: (src: string) => console.log('Captured:', src.slice(0, 40)),
    size: 'small',
  },
}

export const Required: Story = {
  args: {
    onCapture: (src: string) => console.log('Captured:', src.slice(0, 40)),
  },
}

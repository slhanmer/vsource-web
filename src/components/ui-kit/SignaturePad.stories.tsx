import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SignaturePad } from './SignaturePad'

const meta: Meta<typeof SignaturePad> = {
  title: 'ui-kit/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Click the "Click To Sign" button to open the full-screen signature canvas modal. ' +
          'Draw a signature with mouse or touch, then click Save.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SignaturePad>

export const Default: Story = {
  args: {
    onSave: (url: string) => console.log('Signature saved, length:', url.length),
  },
}

export const Required: Story = {
  args: {
    required: true,
    onSave: () => console.log('Signature saved'),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onSave: () => {},
  },
}

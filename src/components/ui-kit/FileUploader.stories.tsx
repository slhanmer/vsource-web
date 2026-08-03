import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import FileUploader from './FileUploader'

const meta: Meta<typeof FileUploader> = {
  title: 'ui-kit/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileUploader>

export const Default: Story = {
  args: {
    label: 'Upload file',
  },
}

export const Multiple: Story = {
  args: {
    label: 'Upload files',
    multiple: true,
    showUploads: true,
  },
}

export const ImagesOnly: Story = {
  args: {
    label: 'Upload image',
    accept: 'image/*',
    showUploads: true,
  },
}

export const Required: Story = {
  args: {
    label: 'Upload required document',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Upload file',
    disabled: true,
  },
}

export const WithFindButton: Story = {
  args: {
    label: 'Drop here or find file',
    withFindButton: true,
  },
}

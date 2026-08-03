import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

const meta: Meta<typeof Modal> = {
  title: 'ui-kit/Modal',
  component: Modal,
  tags: [], // remove autodocs
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

const ModalDemo = (args: any) => {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <Button label="Open Modal" variant="basic" handleClick={() => setOpen(true)} />
      <Modal {...args} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Modal Title',
    children: <p>This is the modal body content.</p>,
  },
}

export const WithLongContent: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Detailed Information',
    children: (
      <div>
        <p>Paragraph one with some information about this topic.</p>
        <p>Paragraph two with additional details.</p>
        <p>Paragraph three wrapping up the key points.</p>
      </div>
    ),
  },
}

export const Centered: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Confirmation',
    textAlignment: 'center',
    children: <p>Are you sure you want to proceed with this action?</p>,
  },
}

export const NoCloseButton: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Required Action',
    showCloseButton: false,
    closeOnOverlay: false,
    children: <p>You must complete this step before continuing.</p>,
  },
}

export const Wide: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Wide Modal',
    width: '900px',
    children: <p>This modal has a wider max-width.</p>,
  },
}

export const TwoFA: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Security Verification',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <p style={{ textAlign: 'center' }}>Please select a method to secure your sign in</p>
        <Button label="Email Code" variant="cta" />
        <p style={{ textAlign: 'center' }}>OR</p>
        <Button label="SMS Code" variant="cta" />
      </div>
    ),
  },
}

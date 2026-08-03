import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ToastProvider, useToast } from './Toast'
import Button from './Button'

const meta: Meta = {
  title: 'ui-kit/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

const ToastTrigger = ({ type, message }: { type: string; message: string }) => {
  const { showToast } = useToast()
  return (
    <Button
      label={`Show ${type} toast`}
      handleClick={() => showToast(message, type as any)}
      width="auto"
    />
  )
}

export const Success: Story = {
  render: () => <ToastTrigger type="success" message="Record saved successfully." />,
}

export const Error: Story = {
  render: () => <ToastTrigger type="error" message="Something went wrong. Please try again." />,
}

export const Warning: Story = {
  render: () => <ToastTrigger type="warning" message="Your session will expire in 5 minutes." />,
}

export const Info: Story = {
  render: () => <ToastTrigger type="info" message="New data is available." />,
}

export const AllTypes: Story = {
  render: () => {
    const Inner = () => {
      const { showToast } = useToast()
      return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button label="Success" handleClick={() => showToast('Saved!', 'success')} />
          <Button label="Error" handleClick={() => showToast('Error occurred', 'error')} />
          <Button label="Warning" handleClick={() => showToast('Error occurred', 'error')} />
          <Button label="Info" handleClick={() => showToast('FYI', 'info')} />
        </div>
      )
    }
    return (
      <ToastProvider>
        <Inner />
      </ToastProvider>
    )
  },
}

export const WithCode: Story = {
  render: () => {
    const Inner = () => {
      const { showToast } = useToast()
      return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button label="Code 0 (info)" handleClick={() => showToast('Operation started', 0)} />
          <Button label="Code 1 (success)" handleClick={() => showToast('Saved successfully', 1)} />
          <Button label="Code 3 (warning)" handleClick={() => showToast('Client error', 3)} />
          <Button label="Code 4 (error)" handleClick={() => showToast('Server error', 4)} />
        </div>
      )
    }
    return (
      <ToastProvider>
        <Inner />
      </ToastProvider>
    )
  },
}

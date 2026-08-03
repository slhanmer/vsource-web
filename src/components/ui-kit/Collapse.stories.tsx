import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import Collapse from './Collapse'

const meta: Meta<typeof Collapse> = {
  title: 'ui-kit/Collapse',
  component: Collapse,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapse>

export const Default: Story = {
  args: {
    title: 'Section Title',
    children: <p>This is the collapsible content. It can contain any React node.</p>,
  },
}

export const StartOpen: Story = {
  args: {
    title: 'Expanded by Default',
    startOpen: true,
    children: <p>This panel starts in the open state.</p>,
  },
}

export const Small: Story = {
  args: {
    title: 'Small Panel',
    size: 'small',
    children: <p>A narrower collapse panel.</p>,
  },
}

export const WithError: Story = {
  args: {
    title: 'Contains errors',
    error: true,
    startOpen: true,
    children: <p>This section has validation errors highlighted in the header.</p>,
  },
}

export const Disabled: Story = {
  args: {
    title: 'Disabled (cannot toggle)',
    disabled: true,
    children: <p>This content cannot be expanded or collapsed.</p>,
  },
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <button onClick={() => setOpen((v) => !v)} style={{ marginBottom: '8px' }}>
          Toggle externally
        </button>
        <Collapse title="Controlled Panel" isOpen={open} onToggle={() => setOpen((v) => !v)}>
          <p>This panel is controlled from outside via isOpen + onToggle.</p>
        </Collapse>
      </div>
    )
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Spacer from './Spacer'

const meta: Meta<typeof Spacer> = {
  title: 'ui-kit/Spacer',
  component: Spacer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Spacer>

export const Vertical: Story = {
  render: (args) => (
    <div>
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Block above</div>
      <Spacer {...args} />
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Block below</div>
    </div>
  ),
  args: { size: 2 },
}

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Left</div>
      <Spacer {...args} horizontal />
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Right</div>
    </div>
  ),
  args: { size: 2 },
}

export const Large: Story = {
  render: (args) => (
    <div>
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Above</div>
      <Spacer {...args} />
      <div style={{ background: '#e2e8f0', padding: '8px' }}>Below</div>
    </div>
  ),
  args: { size: 4 },
}

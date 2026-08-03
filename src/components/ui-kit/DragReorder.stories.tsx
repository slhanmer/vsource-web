import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { DragReorder, type DragItem } from './DragReorder'

const meta: Meta<typeof DragReorder> = {
  title: 'ui-kit/DragReorder',
  component: DragReorder,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DragReorder>

const INITIAL_ITEMS: DragItem[] = [
  { id: '1', content: 'Step 1: Patient intake' },
  { id: '2', content: 'Step 2: Initial assessment' },
  { id: '3', content: 'Step 3: Imaging review' },
  { id: '4', content: 'Step 4: Treatment planning' },
]

const ControlledReorder = (args: any) => {
  const [items, setItems] = useState<DragItem[]>(args.items ?? INITIAL_ITEMS)
  return <DragReorder {...args} items={items} onChange={setItems} />
}

export const Default: Story = {
  render: (args) => <ControlledReorder {...args} />,
  args: { items: INITIAL_ITEMS },
}

export const WithAnimation: Story = {
  render: (args) => <ControlledReorder {...args} />,
  args: { items: INITIAL_ITEMS, animation: true },
}

export const ReadOnly: Story = {
  render: (args) => <ControlledReorder {...args} />,
  args: { items: INITIAL_ITEMS, readOnly: true },
}

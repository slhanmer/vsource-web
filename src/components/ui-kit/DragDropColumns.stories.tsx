import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DragDropColumns } from './DragDropColumns'

const meta: Meta<typeof DragDropColumns> = {
  title: 'ui-kit/DragDropColumns',
  component: DragDropColumns,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DragDropColumns>

export const Default: Story = {
  args: {
    col1title: 'Available',
    col2title: 'Selected',
    col1Content: ['Administrator', 'Editor', 'Viewer', 'Reporter'],
    col2Content: ['Manager'],
  },
}

export const Empty: Story = {
  args: {
    col1title: 'Source',
    col2title: 'Destination',
    col1Content: ['Item A', 'Item B', 'Item C'],
    col2Content: [],
  },
}

export const EvenSplit: Story = {
  args: {
    col1title: 'Unassigned',
    col2title: 'Assigned',
    col1Content: ['Task 1', 'Task 2'],
    col2Content: ['Task 3', 'Task 4'],
  },
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import TabbedContainer from './TabbedContainer'

const meta: Meta<typeof TabbedContainer> = {
  title: 'ui-kit/TabbedContainer',
  component: TabbedContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TabbedContainer>

const TABS = [{ label: 'Personal Details' }, { label: 'Contact Info' }, { label: 'Preferences' }]

const CONTENT = [
  <div key="a">
    <p>Personal details content goes here.</p>
  </div>,
  <div key="b">
    <p>Contact information content goes here.</p>
  </div>,
  <div key="c">
    <p>User preferences content goes here.</p>
  </div>,
]

export const Default: Story = {
  args: { tabs: TABS, content: CONTENT },
}

export const WithStatuses: Story = {
  args: {
    tabs: TABS,
    content: CONTENT,
    statuses: [1, 2, 0],
  },
}

export const WithDisabledTab: Story = {
  args: {
    tabs: TABS,
    content: CONTENT,
    statuses: [1, 0, 3],
  },
}

export const WithSaveButton: Story = {
  args: {
    tabs: TABS,
    content: CONTENT,
    showSaveButton: true,
    saveButtonName: 'Save & Continue',
  },
}

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState(0)
    return (
      <div>
        <TabbedContainer tabs={TABS} content={CONTENT} activeTab={active} onTabChange={setActive} />
      </div>
    )
  },
}

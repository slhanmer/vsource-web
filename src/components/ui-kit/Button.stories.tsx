import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'ui-kit/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    icon: <FontAwesomeIcon icon={faSearch} />,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Basic: Story = {
  args: { label: 'Save', variant: 'basic' },
}

export const Secondary: Story = {
  args: { label: 'Cancel', variant: 'secondary' },
}

export const CTA: Story = {
  args: { label: 'Get Started', variant: 'cta' },
}

export const Danger: Story = {
  args: { label: 'Delete', variant: 'danger' },
}

export const Cancel: Story = {
  args: { label: 'Cancel', variant: 'cancel' },
}

export const TextOnly: Story = {
  args: { label: 'Learn more', variant: 'text-only' },
}

export const WithIcon: Story = {
  args: {
    label: 'Upload',
    variant: 'icon',
    icon: <FontAwesomeIcon icon={faUpload} />,
    iconPosition: 'right',
  },
}

export const IconLeft: Story = {
  args: {
    label: 'Search',
    variant: 'icon',
    icon: <FontAwesomeIcon icon={faSearch} />,
    iconPosition: 'left',
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'icon-only',
    icon: <FontAwesomeIcon icon={faSearch} />,
    tooltip: 'Search',
  },
}

export const Plus: Story = {
  args: { variant: 'plus' },
}

export const Minus: Story = {
  args: { variant: 'minus' },
}

export const Filter: Story = {
  args: { label: 'Active', variant: 'filter' },
}

export const Toggle: Story = {
  args: { label: 'Toggle', variant: 'toggle' },
}

export const Success: Story = {
  args: { label: 'Confirmed', variant: 'success' },
}

export const WithTooltip: Story = {
  args: {
    label: 'Hover me',
    variant: 'basic',
    tooltip: 'This is a tooltip',
  },
}

export const Disabled: Story = {
  args: { label: 'Unavailable', variant: 'basic', disabled: true },
}

export const NormalCase: Story = {
  args: { label: 'Not Uppercased', variant: 'basic', normalCase: true },
}

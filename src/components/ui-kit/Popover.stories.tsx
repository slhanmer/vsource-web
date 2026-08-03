import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useRef, useState } from 'react'
import { Popover } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'ui-kit/Popover',
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

const itemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  textAlign: 'left',
}

/** Point-anchored, pre-opened at fixed coordinates so the panel is visible in docs. */
export const Open: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ height: '200px', position: 'relative' }}>
        <p>Point-anchored popover, pre-opened at a fixed position for the demo.</p>
        <Popover x={100} y={80} isOpen={open} onClose={() => setOpen(false)} aria-label="Actions">
          <button style={itemStyle}>Edit</button>
          <button style={itemStyle}>Duplicate</button>
          <button style={{ ...itemStyle, color: 'var(--error-text)' }}>Delete</button>
        </Popover>
      </div>
    )
  },
}

/** Point-anchored via right-click — the context-menu case. */
export const ContextMenu: Story = {
  render: () => {
    const [menuState, setMenuState] = useState({ open: false, x: 0, y: 0 })

    return (
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          setMenuState({ open: true, x: e.clientX, y: e.clientY })
        }}
        style={{
          width: '300px',
          height: '150px',
          border: '2px dashed var(--chrome-edge)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <span>Right-click inside this box</span>
        <Popover
          x={menuState.x}
          y={menuState.y}
          isOpen={menuState.open}
          onClose={() => setMenuState((s) => ({ ...s, open: false }))}
          aria-label="Scan actions"
        >
          <button style={itemStyle}>View</button>
          <button style={itemStyle}>Copy link</button>
        </Popover>
      </div>
    )
  },
}

/** Element-anchored — the filter-panel case. Tracks the trigger and flips to stay in view. */
export const Anchored: Story = {
  render: () => {
    const anchorRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)

    return (
      <div style={{ height: '300px', padding: '24px' }}>
        <button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
          Filters
        </button>
        <Popover
          anchorRef={anchorRef}
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="bottom-start"
          aria-label="Filter scans"
        >
          <div style={{ padding: '12px', minWidth: '220px' }}>
            <p style={{ margin: '0 0 8px' }}>Date range</p>
            <button style={itemStyle}>Today</button>
            <button style={itemStyle}>Last 7 days</button>
            <button style={itemStyle}>This month</button>
          </div>
        </Popover>
      </div>
    )
  },
}

/** Bottom-right anchor, showing the flip when the preferred side would overflow. */
export const FlipsWhenConstrained: Story = {
  render: () => {
    const anchorRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)

    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '16px',
        }}
      >
        <button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
          Open near the edge
        </button>
        <Popover
          anchorRef={anchorRef}
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="bottom-end"
          aria-label="Constrained popover"
        >
          <div style={{ padding: '12px', minWidth: '200px' }}>
            <button style={itemStyle}>Opens above instead</button>
            <button style={itemStyle}>Right-aligned to the trigger</button>
          </div>
        </Popover>
      </div>
    )
  },
}

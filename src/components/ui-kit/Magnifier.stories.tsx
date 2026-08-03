import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useRef, useState } from 'react'
import { Magnifier } from './Magnifier'

const meta: Meta<typeof Magnifier> = {
  title: 'ui-kit/Magnifier',
  component: Magnifier,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A circular loupe overlay that magnifies a region of a canvas. ' +
          'Move the mouse over the canvas below to see the magnifier in action.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Magnifier>

const MagnifierDemo = ({ zoom = 2, size = 120 }: { zoom?: number; size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#f0f9ff'
    ctx.fillRect(0, 0, el.width, el.height)

    ctx.font = 'bold 14px sans-serif'
    ctx.fillStyle = '#1e40af'
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillText(`Sample text ${i + 1}-${j + 1}`, 20 + i * 100, 40 + j * 60)
      }
    }

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(250, 100, 40, 0, Math.PI * 2)
    ctx.stroke()

    setCanvas(el)
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={180}
        style={{ border: '1px solid #e2e8f0', cursor: 'crosshair' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMouse({
            x: (e.clientX - rect.left) * (e.currentTarget.width / rect.width),
            y: (e.clientY - rect.top) * (e.currentTarget.height / rect.height),
          })
          setActive(true)
        }}
        onMouseLeave={() => setActive(false)}
      />
      {active && canvas && (
        <Magnifier x={mouse.x} y={mouse.y} canvas={canvas} zoom={zoom} size={size} />
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <MagnifierDemo />,
}

export const HighZoom: Story = {
  render: () => <MagnifierDemo zoom={4} />,
}

export const LargeLoupe: Story = {
  render: () => <MagnifierDemo zoom={2} size={200} />,
}

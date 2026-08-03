import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Magnifier } from '../../../components/ui-kit/Magnifier'

function makeCanvas(width = 800, height = 600) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  jest.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,mock')
  return canvas
}

describe('Magnifier', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={100} y={100} canvas={canvas} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders a div with circular styling', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={100} y={100} canvas={canvas} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.borderRadius).toBe('50%')
    })

    it('positions based on x and y minus half the size', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={200} y={300} canvas={canvas} size={120} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.left).toBe('140px') // 200 - 60
      expect(el.style.top).toBe('240px') // 300 - 60
    })

    it('applies default size of 120', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={60} y={60} canvas={canvas} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.width).toBe('120px')
      expect(el.style.height).toBe('120px')
    })

    it('applies custom size', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={150} y={150} canvas={canvas} size={200} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.width).toBe('200px')
      expect(el.style.height).toBe('200px')
    })

    it('uses pointer-events none so it does not block interaction', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={0} y={0} canvas={canvas} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.pointerEvents).toBe('none')
    })

    it('applies backgroundImage from canvas toDataURL', () => {
      const canvas = makeCanvas()
      const { container } = render(<Magnifier x={0} y={0} canvas={canvas} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.backgroundImage).toContain('data:image/png')
    })
  })
})

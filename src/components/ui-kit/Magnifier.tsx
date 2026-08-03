import { useMemo } from 'react'

/**
 * Props for the Magnifier loupe overlay.
 * Renders an absolutely-positioned circular lens that magnifies a region of a canvas.
 * Intended for use alongside the PDF viewer — attach to `onMouseMove` and pass the active canvas.
 *
 * @property x - X position of the cursor within the canvas (canvas pixel coordinates)
 * @property y - Y position of the cursor within the canvas (canvas pixel coordinates)
 * @property canvas - The source `HTMLCanvasElement` to magnify
 * @property zoom - Magnification factor (default: `2`)
 * @property size - Diameter of the circular lens in pixels (default: `120`)
 */
type MagnifierProps = {
  x: number
  y: number
  canvas: HTMLCanvasElement
  zoom?: number
  size?: number
}

export const Magnifier = ({ x, y, canvas, zoom = 2, size = 120 }: MagnifierProps) => {
  // Data-URL is a pure function of the canvas. Memoised because toDataURL is
  // expensive and this re-renders on every mouse move.
  const bg = useMemo(() => canvas.toDataURL(), [canvas])

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid #ccc',
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',

        backgroundSize: `${canvas.width * zoom}px ${canvas.height * zoom}px`,
        imageRendering: 'auto',
        backgroundPosition: `-${x * zoom - size / 2}px -${y * zoom - size / 2}px`,

        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      }}
    />
  )
}

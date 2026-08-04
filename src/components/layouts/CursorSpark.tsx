'use client'

import { useEffect, useRef, useState } from 'react'
import VSourceMark from '@components/ui-kit/VSourceMark'

import './styles/cursorSpark.scss'

/**
 * Cursor easter egg.
 *
 * Shake the pointer side to side and the cursor becomes a lit V with a short
 * tail. Settles back on click, Escape, blur, tab change, or after idling.
 *
 * Fine pointers only, nothing under prefers-reduced-motion, and the overlay
 * never takes pointer events. Positions are written to the DOM from rAF rather
 * than held in state.
 */

const TRAIL = 6
const SHAKE_WINDOW_MS = 420
const MIN_LEG_PX = 9
const FLIPS_TO_TRIGGER = 5
const IDLE_TIMEOUT_MS = 5000
const CHASE = 0.34

export default function CursorSpark() {
  const [active, setActive] = useState(false)

  const layerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const target = useRef({ x: -100, y: -100 })
  const points = useRef(Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 })))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let live = false
    let frame = 0
    let idle: number | undefined

    // --- shake detection --------------------------------------------------
    let lastX: number | null = null
    let lastDir = 0
    let flips: number[] = []

    const stop = () => {
      if (!live) return
      live = false
      flips = []
      lastDir = 0
      window.clearTimeout(idle)
      cancelAnimationFrame(frame)
      document.body.classList.remove('has-cursor-spark')
      setActive(false)
    }

    const nudgeIdle = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(stop, IDLE_TIMEOUT_MS)
    }

    const tick = () => {
      const list = points.current
      for (let i = 0; i < list.length; i += 1) {
        const lead = i === 0 ? target.current : list[i - 1]
        list[i].x += (lead.x - list[i].x) * CHASE
        list[i].y += (lead.y - list[i].y) * CHASE

        const node = nodeRefs.current[i]
        if (node) {
          const scale = 1 - i * 0.13
          node.style.transform = `translate3d(${list[i].x}px, ${list[i].y}px, 0) scale(${scale})`
        }
      }
      frame = requestAnimationFrame(tick)
    }

    const start = (x: number, y: number) => {
      if (live) return
      live = true
      // Collapse the tail onto the pointer so it springs out rather than
      // flying in from where it was left.
      points.current.forEach((p) => {
        p.x = x
        p.y = y
      })
      document.body.classList.add('has-cursor-spark')
      setActive(true)
      frame = requestAnimationFrame(tick)
      nudgeIdle()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      target.current.x = event.clientX
      target.current.y = event.clientY

      if (live) {
        nudgeIdle()
        return
      }

      if (lastX === null) {
        lastX = event.clientX
        return
      }

      const dx = event.clientX - lastX
      if (Math.abs(dx) < MIN_LEG_PX) return

      const dir = Math.sign(dx)
      const now = performance.now()
      if (lastDir !== 0 && dir !== lastDir) flips.push(now)
      lastDir = dir
      lastX = event.clientX

      flips = flips.filter((t) => now - t < SHAKE_WINDOW_MS)
      if (flips.length >= FLIPS_TO_TRIGGER) {
        flips = []
        start(event.clientX, event.clientY)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stop()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', stop, { passive: true })
    window.addEventListener('blur', stop)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', stop)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('blur', stop)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('visibilitychange', stop)
      window.clearTimeout(idle)
      cancelAnimationFrame(frame)
      document.body.classList.remove('has-cursor-spark')
    }
  }, [])

  return (
    <div ref={layerRef} className={`cursor-spark ${active ? 'is-live' : ''}`} aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, i) => (
        <span
          key={i}
          ref={(node) => {
            nodeRefs.current[i] = node
          }}
          className={`cursor-spark__node ${i === 0 ? 'is-leader' : ''}`}
          style={{ opacity: active ? 1 - i * 0.16 : 0 }}
        >
          <VSourceMark className="cursor-spark__mark" etched={false} />
        </span>
      ))}
    </div>
  )
}

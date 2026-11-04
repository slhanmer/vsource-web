'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useReducedMotion } from '@hooks'

/**
 * The fold plate's mill lines, bending gently around the pointer — a magnet
 * under brushed steel.
 *
 * The plate draws its lines in CSS (a repeating gradient: 1px of `--home-mill`
 * every 4px, the 4th pixel of each period). This canvas draws the SAME lines
 * at the same positions in the same colour, so the moment it takes over
 * nothing changes. Only then does it switch the CSS line layer off
 * (`.has-mill-canvas`), so the lines are never drawn twice. Until then —
 * before hydration, without JavaScript, on touch, under reduced motion — the
 * CSS lines are all there is, and this renders nothing at all.
 *
 * THE BEND. Each line moves vertically by a dipole-shaped Gaussian around the
 * pointer: lines above it are pushed up, lines below pushed down, so they part
 * around the cursor and are straight elsewhere.
 *
 *     d = PEAK · √e · (dy / SIGMA) · exp(−(dx² + dy²) / (2·SIGMA²))
 *
 * peaks at PEAK where |dy| = SIGMA, and is negligible past ~2·SIGMA (≈ 160px).
 * Its slope never exceeds ~12% of the line spacing, so lines never cross.
 *
 * COST. requestAnimationFrame runs only while the pointer is moving or the
 * lines are still settling. Idle means no frames at all. Lines far from the
 * pointer are a single fillRect each; only the few dozen within 3·SIGMA are
 * drawn as polylines, and only across 6·SIGMA of width. Device pixel ratio is
 * capped at 2. A hidden tab cancels the loop.
 *
 * It springs back without bouncing: position and strength each ease toward
 * their target per frame (LERP), and the strength's target drops to zero when
 * the pointer leaves the plate or stops moving.
 */

/** Peak vertical displacement, CSS px. */
const PEAK = 6
/** Gaussian sigma, CSS px. The visible reach is about twice this. */
const SIGMA = 80
/** Per-frame easing of the bend's centre toward the pointer. */
const FOLLOW = 0.22
/** Per-frame easing of the bend's strength toward its target. */
const EASE = 0.12
/** The pointer counts as stopped after this long without a move, ms. */
const STOPPED_MS = 140
/** Polyline sampling step, CSS px. */
const STEP = 6
/** The CSS gradient's rhythm: a 1px line at offset 3 of every 4px. */
const PERIOD = 4
const OFFSET = 3

const FINE_QUERY = '(pointer: fine) and (hover: hover)'
let fineMql: MediaQueryList | null = null
const fineMedia = () => (fineMql ??= window.matchMedia(FINE_QUERY))
const subscribeFine = (onChange: () => void) => {
  const q = fineMedia()
  q.addEventListener('change', onChange)
  return () => q.removeEventListener('change', onChange)
}

export default function MillLines() {
  const reduced = useReducedMotion()
  // The server renders no canvas; the client decides.
  const fine = useSyncExternalStore(
    subscribeFine,
    () => fineMedia().matches,
    () => false
  )
  const on = fine && !reduced
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const plate = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!on || !canvas || !plate || !ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let colour = ''
    let frame = 0
    const pointer = { x: 0, y: 0, inside: false, lastMove: 0 }
    const bend = { x: 0, y: 0, strength: 0 }
    const K = PEAK * Math.sqrt(Math.E)
    const reach = 3 * SIGMA

    const readColour = () => {
      colour = getComputedStyle(plate).getPropertyValue('--home-mill').trim()
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = colour
      ctx.strokeStyle = colour
      ctx.lineWidth = 1
      const s = bend.strength
      const x0 = Math.max(0, bend.x - reach)
      const x1 = Math.min(width, bend.x + reach)

      for (let y = OFFSET; y < height; y += PERIOD) {
        const dy = y + 0.5 - bend.y
        if (s < 0.004 || Math.abs(dy) > reach) {
          ctx.fillRect(0, y, width, 1)
          continue
        }
        if (x0 > 0) ctx.fillRect(0, y, x0, 1)
        if (x1 < width) ctx.fillRect(x1, y, width - x1, 1)
        const fy = K * s * (dy / SIGMA) * Math.exp((-dy * dy) / (2 * SIGMA * SIGMA))
        ctx.beginPath()
        for (let x = x0; x <= x1; x += STEP) {
          const dx = x - bend.x
          const d = fy * Math.exp((-dx * dx) / (2 * SIGMA * SIGMA))
          if (x === x0) ctx.moveTo(x, y + 0.5 + d)
          else ctx.lineTo(x, y + 0.5 + d)
        }
        ctx.lineTo(x1, y + 0.5)
        ctx.stroke()
      }
    }

    const tick = () => {
      frame = 0
      const now = performance.now()
      const moving = pointer.inside && now - pointer.lastMove < STOPPED_MS
      const target = moving ? 1 : 0
      bend.x += (pointer.x - bend.x) * FOLLOW
      bend.y += (pointer.y - bend.y) * FOLLOW
      bend.strength += (target - bend.strength) * EASE
      if (!moving && bend.strength < 0.004) {
        // Settled: straight again, and no more frames until the next move.
        bend.strength = 0
        draw()
        return
      }
      draw()
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      const rect = plate.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      if (!pointer.inside || bend.strength === 0) {
        // Start the bend where the pointer is, not sliding in from the corner.
        bend.x = pointer.x
        bend.y = pointer.y
      }
      pointer.inside = true
      pointer.lastMove = performance.now()
      kick()
    }

    const onLeave = () => {
      pointer.inside = false
      kick()
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (bend.strength > 0) {
        kick()
      }
    }

    const resize = () => {
      const rect = plate.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      draw()
    }

    readColour()
    resize()
    // Lines are on the canvas now; take them off the CSS background.
    plate.classList.add('has-mill-canvas')

    const sizes = new ResizeObserver(resize)
    sizes.observe(plate)
    // The colour is a theme token: redraw when the theme changes.
    const theme = new MutationObserver(() => {
      readColour()
      draw()
    })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    plate.addEventListener('pointermove', onMove)
    plate.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      sizes.disconnect()
      theme.disconnect()
      plate.removeEventListener('pointermove', onMove)
      plate.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      plate.classList.remove('has-mill-canvas')
    }
  }, [on])

  if (!on) return null
  return <canvas ref={ref} className="home-plate__mill" aria-hidden="true" />
}

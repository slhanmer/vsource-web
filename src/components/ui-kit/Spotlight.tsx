import React, { ReactNode, RefObject, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import { Stepper } from './Stepper'

import './styles/spotlight.scss'

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SpotlightPlacement = 'top' | 'bottom' | 'left' | 'right'

/**
 * A single stop in the sequence. Generic: it knows a target and a placement,
 * plus an open bag of data the consumer's panel renderer can read. The kit
 * does NOT know what `data` means — onboarding puts {title, description} here.
 */
export interface SpotlightStep<TData = unknown> {
  /** Ref to the element this stop highlights. */
  targetRef: RefObject<HTMLElement | null>
  /** Preferred panel side; flips if it won't fit. Default `'right'`. */
  placement?: SpotlightPlacement
  /** Arbitrary per-step payload for the panel renderer. */
  data?: TData
}

/**
 * Everything the panel renderer (or default card) needs for the current stop.
 * Passed to `renderPanel`. This is the whole contract a consumer codes against.
 */
export interface SpotlightPanelContext<TData = unknown> {
  step: SpotlightStep<TData>
  data: TData | undefined
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  next: () => void
  back: () => void
  close: () => void
}

interface SpotlightProps<TData = unknown> {
  steps: SpotlightStep<TData>[]
  /** Controlled active index. */
  activeIndex: number
  /** Whether the spotlight is showing at all. */
  open: boolean
  onNext: () => void
  onBack: () => void
  onClose: () => void
  onFinish: () => void
  /**
   * Optional panel renderer. Omit to get the kit's default card (title +
   * description read from `step.data`, progress dots, back/next/skip/finish).
   * Provide to render anything — a coachmark bubble, your own modal, etc.
   */
  renderPanel?: (ctx: SpotlightPanelContext<TData>) => ReactNode
  /** Called before a step shows — e.g. open a drawer the target lives in. */
  onBeforeStep?: (step: SpotlightStep<TData>, index: number) => void
  /** Portal target id. Defaults to the app's shared `#tooltip-root`. */
  portalId?: string
}

const PANEL_WIDTH = 300
const SPOTLIGHT_PAD = 6
const PANEL_GAP = 14
// Min distance from the viewport edge.
const EDGE_GAP = 8
// Keeps the ring's stroke fully on-canvas: the stroke is centred on the path,
// so a rect flush to the edge would lose its outer half. Covers the pulse peak.
const RING_INSET = 2
// Seeds the first frame only — the real height is measured once rendered.
const PANEL_HEIGHT_ESTIMATE = 180
// How many frames to keep retrying for a target that hasn't mounted yet (a step
// may open a drawer or switch a tab first). ~30 frames ≈ half a second at 60fps.
const MEASURE_RETRY_FRAMES = 30

/* -------------------------------------------------------------------------- */
/*  Default card — shown when no renderPanel is supplied                       */
/* -------------------------------------------------------------------------- */

interface DefaultCardData {
  title?: string
  description?: string
}

function DefaultCard<TData>({ ctx }: { ctx: SpotlightPanelContext<TData> }) {
  const d = (ctx.data ?? {}) as DefaultCardData
  return (
    <>
      <Button
        className="spotlight__close"
        variant="close"
        handleClick={ctx.close}
        aria-label="Skip"
      />

      <div className="spotlight__dots" aria-hidden="true">
        {Array.from({ length: ctx.total }).map((_, i) => (
          <span
            key={i}
            className={`spotlight__dot ${
              i === ctx.index ? 'is-active' : i < ctx.index ? 'is-done' : ''
            }`}
          />
        ))}
      </div>

      {d.title && <h3 className="spotlight__title">{d.title}</h3>}
      {d.description && <p className="spotlight__desc">{d.description}</p>}

      <Stepper
        index={ctx.index}
        total={ctx.total}
        onBack={ctx.back}
        onNext={ctx.next}
        onFinish={ctx.next}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Spotlight — the generic mechanism                                          */
/* -------------------------------------------------------------------------- */

export function Spotlight<TData = unknown>({
  steps,
  activeIndex,
  open,
  onNext,
  onBack,
  onClose,
  onFinish,
  renderPanel,
  onBeforeStep,
  portalId = 'tooltip-root',
}: SpotlightProps<TData>) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const vw = viewport.w
  const vh = viewport.h

  const step = steps[activeIndex]
  const isFirst = activeIndex === 0
  const isLast = activeIndex === steps.length - 1

  const next = useCallback(() => {
    if (isLast) onFinish()
    else onNext()
  }, [isLast, onFinish, onNext])

  // Measure the active target; keep fresh on scroll/resize.
  useEffect(() => {
    if (!open || !step) return
    onBeforeStep?.(step, activeIndex)

    let frame = 0
    let raf = 0

    const measure = () => {
      const node = step.targetRef.current
      setViewport({ w: window.innerWidth, h: window.innerHeight })

      if (node) {
        setRect(node.getBoundingClientRect())
        return
      }

      // Target isn't mounted yet. onBeforeStep may have just triggered a state
      // change (opening a drawer, switching a tab) whose DOM lands a frame or
      // more later — so retry rather than assume one frame is enough. Bounded,
      // because a genuinely absent target must not spin forever.
      setRect(null)
      if (frame < MEASURE_RETRY_FRAMES) {
        frame += 1
        raf = requestAnimationFrame(measure)
      }
    }

    raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open, step, activeIndex, onBeforeStep])

  // Keyboard: Esc closes, arrows step, focus the panel on step change.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft' && !isFirst) onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, next, onBack, onClose, isFirst])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open, activeIndex])

  // Placement depends on the panel's height, which isn't known until it has
  // rendered. A ResizeObserver is the right tool: the panel's height changes
  // for reasons React doesn't drive (copy length, font load, reflow at narrow
  // widths), and this is exactly the "subscribe to an external system, setState
  // from its callback" shape effects are for.
  const [panelH, setPanelH] = useState(0)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    const ro = new ResizeObserver(([entry]) => {
      setPanelH(entry.contentRect.height)
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [open])

  if (!open || !step) return null
  // Viewport is measured on the first frame; nothing can be placed until then.
  if (!vw || !vh) return null

  // Pad the target, but keep the rect inside the viewport — a full-bleed target
  // (mobile preview) would otherwise push the ring off-canvas and clip its
  // stroke on the overflowing sides.
  const spot = rect
    ? (() => {
        const x = Math.max(RING_INSET, rect.left - SPOTLIGHT_PAD)
        const y = Math.max(RING_INSET, rect.top - SPOTLIGHT_PAD)
        const right = Math.min(vw - RING_INSET, rect.right + SPOTLIGHT_PAD)
        const bottom = Math.min(vh - RING_INSET, rect.bottom + SPOTLIGHT_PAD)
        return { x, y, w: Math.max(0, right - x), h: Math.max(0, bottom - y) }
      })()
    : null

  const panelPos = (() => {
    const width = Math.min(PANEL_WIDTH, vw - EDGE_GAP * 2)
    // Measured height once the panel has rendered; the constant seeds frame one.
    const height = panelH || PANEL_HEIGHT_ESTIMATE

    if (!rect) {
      return { top: (vh - height) / 2, left: (vw - width) / 2, width }
    }

    const clampX = (x: number) => Math.max(EDGE_GAP, Math.min(x, vw - width - EDGE_GAP))
    const clampY = (y: number) => Math.max(EDGE_GAP, Math.min(y, vh - height - EDGE_GAP))

    // Candidate position per side, plus whether it actually fits there.
    const sides = {
      right: {
        fits: rect.right + PANEL_GAP + width <= vw - EDGE_GAP,
        pos: () => ({ top: clampY(rect.top), left: rect.right + PANEL_GAP }),
      },
      left: {
        fits: rect.left - PANEL_GAP - width >= EDGE_GAP,
        pos: () => ({ top: clampY(rect.top), left: rect.left - PANEL_GAP - width }),
      },
      bottom: {
        fits: rect.bottom + PANEL_GAP + height <= vh - EDGE_GAP,
        pos: () => ({
          top: rect.bottom + PANEL_GAP,
          left: clampX(rect.left + rect.width / 2 - width / 2),
        }),
      },
      top: {
        fits: rect.top - PANEL_GAP - height >= EDGE_GAP,
        pos: () => ({
          top: rect.top - PANEL_GAP - height,
          left: clampX(rect.left + rect.width / 2 - width / 2),
        }),
      },
    } as const

    // Preferred side wins if it fits; otherwise try its opposite (so a 'top'
    // that won't fit lands below the target, not beside it), then the rest.
    const preferred = step.placement ?? 'right'
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
    const order: SpotlightPlacement[] = [
      preferred,
      opposite[preferred],
      ...(['right', 'left', 'bottom', 'top'] as SpotlightPlacement[]),
    ]

    for (const side of order) {
      if (sides[side].fits) {
        const p = sides[side].pos()
        return { ...p, width }
      }
    }

    // Nothing fits cleanly (target fills the viewport) — clamp into view.
    return {
      top: clampY(rect.bottom + PANEL_GAP),
      left: clampX(rect.left),
      width,
    }
  })()

  const ctx: SpotlightPanelContext<TData> = {
    step,
    data: step.data,
    index: activeIndex,
    total: steps.length,
    isFirst,
    isLast,
    next,
    back: onBack,
    close: onClose,
  }

  return createPortal(
    <div className="spotlight" role="dialog" aria-modal="true" aria-label="Guided walkthrough">
      <svg
        className="spotlight__mask"
        aria-hidden="true"
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
      >
        <defs>
          <mask id="spotlight-cutout">
            <rect x="0" y="0" width={vw} height={vh} fill="white" />
            {spot && (
              <rect x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx="10" fill="black" />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={vw}
          height={vh}
          className="spotlight__scrim"
          mask="url(#spotlight-cutout)"
        />
        {spot && (
          <rect
            className="spotlight__ring"
            x={spot.x}
            y={spot.y}
            width={spot.w}
            height={spot.h}
            rx="10"
          />
        )}
      </svg>

      <div
        ref={panelRef}
        tabIndex={-1}
        className="spotlight__panel"
        style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}
      >
        {renderPanel ? renderPanel(ctx) : <DefaultCard ctx={ctx} />}
      </div>
    </div>,
    document.getElementById(portalId) || document.body
  )
}

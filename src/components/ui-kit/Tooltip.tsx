import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { createPortal } from 'react-dom'
import { useViewport } from '@hooks'

import './styles/tooltip.scss'

const VIEWPORT_PAD = 8
const GAP = 5 // space between trigger and bubble

/**
 * Imperative handle exposed via ref, used to drive the tooltip from a
 * walkthrough/onboarding controller. While a tooltip is force-shown, hover,
 * focus and touch are fully overridden (they neither open nor close it) — the
 * controller owns visibility until it calls `hide()`.
 *
 * @property show - Force the tooltip open, bypassing hover delay and overriding pointer input
 * @property hide - Release the forced-open state and return to normal hover behaviour (closed)
 */
export interface TooltipHandle {
  show: () => void
  hide: () => void
}

/**
 * Props for the Tooltip component.
 *
 * @property children - The element that triggers the tooltip on hover/touch
 * @property text - Text content displayed inside the tooltip bubble
 * @property position - Preferred side of the trigger (default: `'bottom'`). Flips to the
 *   opposite side when there isn't room, and clamps to the viewport on the cross axis.
 * @property previewMode - Renders a wider `385px` tooltip styled for form-builder previews
 * @property delay - Milliseconds before the tooltip appears after hover (default: `700`)
 * @property width - Override the tooltip bubble width (overrides `previewMode` sizing)
 */
interface TooltipProps {
  children: ReactNode
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  previewMode?: boolean
  delay?: number
  width?: string
}

type Side = 'top' | 'bottom' | 'left' | 'right'

export const Tooltip = forwardRef<TooltipHandle, TooltipProps>(
  (
    { children, text, position = 'bottom', previewMode = false, delay = 700, width = 'auto' },
    ref
  ) => {
    const isMobile = useViewport()
    const targetRef = useRef<HTMLDivElement>(null)
    const bubbleRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [isOpen, setIsOpen] = useState(false)
    // When true, the walkthrough controller owns visibility; hover/focus/touch
    // are ignored until hide() is called. null = not walkthrough-driven.
    const [forcedOpen, setForcedOpen] = useState<boolean | null>(null)
    // Resolved placement — null until the bubble has been measured, so it never
    // paints at 0,0 before it knows where it belongs.
    const [placement, setPlacement] = useState<{ top: number; left: number; side: Side } | null>(
      null
    )

    const isForced = forcedOpen !== null
    const effectiveOpen = isForced ? forcedOpen : isOpen

    // Clearing the resolved placement on close is derived from open state, so
    // it happens during render rather than in an effect.
    const [wasOpen, setWasOpen] = useState(effectiveOpen)
    if (effectiveOpen !== wasOpen) {
      setWasOpen(effectiveOpen)
      if (!effectiveOpen) setPlacement(null)
    }

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          // Cancel any pending hover-open so the two paths can't race.
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          setForcedOpen(true)
        },
        hide: () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          // Release control and settle closed, matching normal auto behaviour.
          setForcedOpen(null)
          setIsOpen(false)
        },
      }),
      []
    )

    // Measures the trigger and the bubble, picks a side that fits, then clamps
    // the cross axis. Measurement needs real DOM boxes, so it runs after paint.
    useLayoutEffect(() => {
      if (!effectiveOpen) return

      const place = () => {
        const target = targetRef.current
        const bubble = bubbleRef.current
        if (!target || !bubble) return

        const r = target.getBoundingClientRect()
        const bw = bubble.offsetWidth
        const bh = bubble.offsetHeight
        const vw = window.innerWidth
        const vh = window.innerHeight

        // Room available on each side of the trigger.
        const room = {
          top: r.top - GAP - VIEWPORT_PAD,
          bottom: vh - r.bottom - GAP - VIEWPORT_PAD,
          left: r.left - GAP - VIEWPORT_PAD,
          right: vw - r.right - GAP - VIEWPORT_PAD,
        }
        const needed = position === 'top' || position === 'bottom' ? bh : bw

        // Prefer the requested side; flip to its opposite if that's the only
        // one with room. If neither fits, keep the requested side and let the
        // clamp below pull it back into view.
        const opposite: Record<Side, Side> = {
          top: 'bottom',
          bottom: 'top',
          left: 'right',
          right: 'left',
        }
        const side: Side =
          room[position] >= needed || room[opposite[position]] < needed
            ? position
            : opposite[position]

        let top: number
        let left: number

        if (side === 'top') {
          top = r.top - GAP - bh
          left = r.left + r.width / 2 - bw / 2
        } else if (side === 'bottom') {
          top = r.bottom + GAP
          left = r.left + r.width / 2 - bw / 2
        } else if (side === 'left') {
          top = r.top + r.height / 2 - bh / 2
          left = r.left - GAP - bw
        } else {
          top = r.top + r.height / 2 - bh / 2
          left = r.right + GAP
        }

        // Clamp both axes so the bubble is always fully on screen.
        left = Math.min(
          Math.max(left, VIEWPORT_PAD),
          Math.max(VIEWPORT_PAD, vw - bw - VIEWPORT_PAD)
        )
        top = Math.min(Math.max(top, VIEWPORT_PAD), Math.max(VIEWPORT_PAD, vh - bh - VIEWPORT_PAD))

        setPlacement({ top, left, side })
      }

      place()

      window.addEventListener('resize', place)
      window.addEventListener('scroll', place, true)
      return () => {
        window.removeEventListener('resize', place)
        window.removeEventListener('scroll', place, true)
      }
    }, [effectiveOpen, position, text, width, previewMode])

    const handleEnter = () => {
      if (isForced) return
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setIsOpen(true), delay ?? 0)
    }

    const handleLeave = () => {
      if (isForced) return
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsOpen(false)
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }, [])

    const tooltip =
      effectiveOpen && (!isMobile || isForced)
        ? createPortal(
            <div
              ref={bubbleRef}
              className={`tooltip-bubble ${placement?.side ?? position}`}
              style={{
                top: placement?.top ?? 0,
                left: placement?.left ?? 0,
                // Hidden until measured so it never flashes at 0,0.
                visibility: placement ? 'visible' : 'hidden',
                width: width !== 'auto' ? width : previewMode ? '385px' : undefined,
                maxWidth: `calc(100vw - ${VIEWPORT_PAD * 2}px)`,
              }}
            >
              {text}
            </div>,
            document.getElementById('tooltip-root') || document.body
          )
        : null

    return (
      <div
        className="tooltip-container"
        ref={targetRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
        {tooltip}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'

import { createPortal } from 'react-dom'
import './styles/popover.scss'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

type PopoverProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  /** Anchor to an element — the popover positions against its bounding rect. */
  anchorRef?: React.RefObject<HTMLElement | null>
  /** Anchor to a point (e.g. `MouseEvent.clientX/Y`) for right-click menus. */
  x?: number
  y?: number
  /** Preferred side/alignment when anchored to an element. Flips if it would overflow. */
  placement?: Placement
  /** Gap in px between the anchor and the panel. */
  offset?: number
  className?: string
  'aria-label'?: string
}

const VIEWPORT_PAD = 8

/**
 * A portal-based anchored overlay — filter panels, dropdowns, right-click menus.
 * Non-modal: no scrim, no scroll lock, no focus trap. Dismisses on backdrop
 * click or Escape.
 *
 * Position comes from either `anchorRef` (element-anchored, flips to stay in
 * view) or `x`/`y` (point-anchored, clamped to the viewport).
 *
 * @example
 * const filterBtn = useRef<HTMLButtonElement>(null)
 * <Popover anchorRef={filterBtn} isOpen={open} onClose={close} placement="bottom-start">
 *   <DateRangeFilter />
 * </Popover>
 *
 * @example
 * <Popover x={mouseX} y={mouseY} isOpen={open} onClose={close}>
 *   <button onClick={onEdit}>Edit</button>
 * </Popover>
 */
export const Popover = ({
  isOpen,
  onClose,
  children,
  anchorRef,
  x,
  y,
  placement = 'bottom-start',
  offset = 6,
  className = '',
  'aria-label': ariaLabel,
}: PopoverProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  // Clearing the measured position on close is derived from isOpen, so it
  // happens during render rather than in an effect.
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (!isOpen) setPos(null)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Measures the panel and its anchor, then places it. DOM measurement can only
  // happen after paint, so this is the legitimate effect case rather than
  // derivable state.
  useLayoutEffect(() => {
    if (!isOpen) return

    const place = () => {
      const panel = panelRef.current
      if (!panel) return

      const { offsetWidth: pw, offsetHeight: ph } = panel
      const vw = window.innerWidth
      const vh = window.innerHeight

      let top: number
      let left: number

      const anchor = anchorRef?.current
      if (anchor) {
        const r = anchor.getBoundingClientRect()
        const wantsTop = placement.startsWith('top')
        const wantsEnd = placement.endsWith('end')

        // Flip to the other side if the preferred one doesn't fit.
        const fitsBelow = r.bottom + offset + ph <= vh - VIEWPORT_PAD
        const fitsAbove = r.top - offset - ph >= VIEWPORT_PAD
        const above = wantsTop ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove

        top = above ? r.top - offset - ph : r.bottom + offset
        left = wantsEnd ? r.right - pw : r.left
      } else {
        top = y ?? 0
        left = x ?? 0
        // Point-anchored: flip back over the pointer rather than covering it.
        if (top + ph > vh - VIEWPORT_PAD) top = Math.max(VIEWPORT_PAD, top - ph)
        if (left + pw > vw - VIEWPORT_PAD) left = Math.max(VIEWPORT_PAD, left - pw)
      }

      // Final clamp so the panel never sits outside the viewport.
      left = Math.min(Math.max(left, VIEWPORT_PAD), Math.max(VIEWPORT_PAD, vw - pw - VIEWPORT_PAD))
      top = Math.min(Math.max(top, VIEWPORT_PAD), Math.max(VIEWPORT_PAD, vh - ph - VIEWPORT_PAD))

      setPos({ top, left })
    }

    place()

    // Anchored panels track layout changes; point-anchored ones don't move.
    if (!anchorRef?.current) return
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [isOpen, anchorRef, x, y, placement, offset])

  if (!isOpen) return null

  return createPortal(
    <div className="popover-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className={`popover ${className}`}
        role="dialog"
        aria-label={ariaLabel}
        // Hidden until measured, so it never flashes at 0,0 before placement.
        style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

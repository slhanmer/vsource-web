import { useRef, useState, useEffect, useCallback } from 'react'
import { IMaskInput, IMask } from 'react-imask'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { Popover } from './Popover'
import './styles/timeInputMask.scss'

/**
 * Props for the TimeInputMask component.
 *
 * @property value - Controlled time string as `HH:mm` (24-hour)
 * @property onChange - Called with the masked string whenever the user types or picks a time
 * @property minuteStep - Granularity of the minute column (default: `5`)
 * @property disabled - Disables the input
 * @property readOnly - Prevents editing; the picker toggle is also hidden
 * @property placeholder - Overrides the default `HH:mm` hint
 */
interface TimeInputMaskProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minuteStep?: number
  disabled?: boolean
  readOnly?: boolean
}

/*
 * DRUM GEOMETRY
 *
 * The scroll container is VISIBLE * OPTION_H tall, with a spacer of
 * (VISIBLE - 1) / 2 options' height before the first option and after the
 * last. That padding is what makes this hold:
 *
 *     scrollTop === n * OPTION_H   ⇔   option n sits under the centre band
 *
 * Scroll position and option index therefore share a coordinate space, and
 * every option — including the first and last — can reach the centre.
 *
 * IMPORTANT: the container must NOT use CSS scroll-snap. Native snapping
 * centres against the container rather than this coordinate space, and fights
 * the programmatic settle — that combination caused a long tail of drift and
 * bounce bugs. The settle timer owns snapping outright.
 *
 * OPTION_H and VISIBLE must match $option-height and $visible-options in
 * timeInputMask.scss.
 */
const WHEEL_SCALE = 0.2
const OPTION_H = 30
const VISIBLE = 5

/*
 * LOOPING
 *
 * The option list is rendered COPIES times end to end, with the scroll parked
 * in the middle copy, which spans:
 *
 *     [ MIDDLE * loopLength , (MIDDLE + 1) * loopLength ]
 *
 * Leaving that band repositions by one loopLength the other way. The picture
 * is identical either side of the jump, so the drum has no ends.
 *
 * The jump deliberately does NOT suppress the scroll handler. Suppressing it
 * swallows the events still arriving from the user's gesture, which reads as
 * the drum snatching control back mid-scroll.
 */
const COPIES = 3
const MIDDLE = 1

// Rotation per option away from centre. Shallow enough that the outermost
// visible option stays legible instead of turning edge-on.
const DEG_PER_OPTION = 14
// Stillness required before the drum snaps to the nearest option and commits.
const SETTLE_MS = 130

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

export const TimeInputMask: React.FC<TimeInputMaskProps> = ({
  value = '',
  onChange,
  placeholder,
  className,
  minuteStep = 5,
  disabled = false,
  readOnly = false,
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [rejectMsg, setRejectMsg] = useState<string | null>(null)
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) =>
    String(i * minuteStep).padStart(2, '0')
  )

  const [hour, minute] = value.length === 5 ? value.split(':') : ['', '']

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return
    const before = inputRef.current?.value ?? ''
    const cursorPos = inputRef.current?.selectionStart ?? 0
    setTimeout(() => {
      const after = inputRef.current?.value ?? ''
      if (after === before) {
        if (rejectTimer.current) clearTimeout(rejectTimer.current)
        setRejectMsg(cursorPos <= 2 ? 'Hour must be between 00-23' : 'Minute must be between 00-59')
        rejectTimer.current = setTimeout(() => setRejectMsg(null), 2000)
      }
    }, 0)
  }

  return (
    <div className="time-input-wrapper">
      <div className="time-input-row">
        <IMaskInput
          mask="HH{:}mm"
          blocks={{
            HH: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
            mm: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
          }}
          value={value}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
          onAccept={(val: string) => {
            setRejectMsg(null)
            onChange(val)
          }}
          placeholder={placeholder || 'HH:mm'}
          className={`input-field ${className ?? ''}`}
          disabled={disabled}
          inputMode="numeric"
          readOnly={readOnly}
        />
        {!disabled && !readOnly && (
          <span ref={iconRef}>
            <FontAwesomeIcon
              icon={faClock}
              className="time-picker-icon"
              role="button"
              tabIndex={0}
              aria-label="Choose a time"
              onClick={() => setShowPicker((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setShowPicker((prev) => !prev)
                }
              }}
            />
          </span>
        )}
      </div>

      <Popover
        anchorRef={iconRef}
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        placement="bottom-end"
        className="time-picker-popover"
        aria-label="Choose a time"
      >
        <div className="time-picker">
          <Drum
            options={HOURS}
            value={hour}
            open={showPicker}
            ariaLabel="Hour"
            onSelect={(h) => onChange(`${h}:${minute || '00'}`)}
          />
          <span className="time-picker__separator">:</span>
          <Drum
            options={minutes}
            value={minute}
            open={showPicker}
            ariaLabel="Minute"
            onSelect={(m) => onChange(`${hour || '00'}:${m}`)}
          />
        </div>
      </Popover>

      <span className={`input-hint ${rejectMsg ? 'error' : ''}`}>{rejectMsg ?? ''}</span>
    </div>
  )
}

interface DrumProps {
  options: string[]
  value: string
  open: boolean
  ariaLabel: string
  onSelect: (value: string) => void
}

/**
 * One scroll drum.
 *
 * Transforms are written straight to the DOM rather than held in state —
 * scrolling would otherwise re-render every option on every frame. React only
 * re-renders this component when the option list itself changes.
 */
const Drum: React.FC<DrumProps> = ({ options, value, open, ariaLabel, onSelect }) => {
  const colRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Set while we move the scroll ourselves, so the resulting scroll events
  // aren't mistaken for the user turning the drum — otherwise the snap
  // retriggers the handler that scheduled it.
  const silentRef = useRef(false)
  // Current value, read inside callbacks without re-binding them on change.
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const onWheel = useCallback((e: React.WheelEvent) => {
    const col = colRef.current
    if (!col) return
    e.preventDefault()
    // Native wheel deltas are far too large for a 30px option — a free-spinning
    // wheel travels several options per notch. Scale it down and drive the
    // scroll ourselves.
    col.scrollTop += e.deltaY * WHEEL_SCALE
  }, [])

  const loopLength = options.length * OPTION_H
  const items = Array.from({ length: COPIES }, () => options).flat()

  /** Rotates and fades each option by its distance from the centre band. */
  const paint = useCallback(() => {
    const col = colRef.current
    if (!col) return
    const centre = col.scrollTop / OPTION_H

    const nodes = col.querySelectorAll<HTMLElement>('.time-picker__option')
    nodes.forEach((node, i) => {
      const offset = i - centre
      const distance = Math.abs(offset)

      if (distance > VISIBLE) {
        // Outside the drum. Hidden, but left in flow so scroll height holds.
        node.style.opacity = '0'
        node.style.transform = ''
        node.classList.remove('is-centre')
        return
      }

      const fade = Math.max(0, 1 - distance / (VISIBLE / 2 + 0.5))
      node.style.transform = `rotateX(${-offset * DEG_PER_OPTION}deg) translateZ(${OPTION_H * 1.4}px)`
      node.style.opacity = String(0.3 + fade * 0.7)
      node.classList.toggle('is-centre', distance < 0.5)
    })
  }, [])

  /** Jumps the drum without animating — used for positioning on open. */
  const jumpTo = useCallback(
    (top: number) => {
      const col = colRef.current
      if (!col) return
      if (Math.abs(col.scrollTop - top) < 1) {
        paint()
        return
      }
      silentRef.current = true
      col.scrollTop = top
      paint()
      // The assignment queues one scroll event; release after it lands.
      requestAnimationFrame(() => {
        silentRef.current = false
      })
    },
    [paint]
  )

  /**
   * Eased settle. Native smooth scrolling has a fixed duration and no easing
   * hook, so it reads as a snap rather than a wheel coming to rest.
   *
   * Suppresses the scroll handler throughout — the events this generates would
   * otherwise reschedule the settle that started it.
   */
  const animateTo = useCallback(
    (top: number, duration = 260) => {
      const col = colRef.current
      if (!col) return
      const from = col.scrollTop
      const distance = top - from
      if (Math.abs(distance) < 1) {
        paint()
        return
      }

      silentRef.current = true
      const start = performance.now()
      // easeOutCubic — quick departure, long soft landing.
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)

      const step = (now: number) => {
        const c = colRef.current
        if (!c) return
        const t = Math.min(1, (now - start) / duration)
        c.scrollTop = from + distance * ease(t)
        paint()
        if (t < 1) {
          requestAnimationFrame(step)
          return
        }
        c.scrollTop = top
        paint()
        requestAnimationFrame(() => {
          silentRef.current = false
        })
      }
      requestAnimationFrame(step)
    },
    [paint]
  )

  // Land on the current value each time the picker opens.
  useEffect(() => {
    if (!open) return
    const index = Math.max(0, options.indexOf(valueRef.current))
    jumpTo(index * OPTION_H)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open transition only
  }, [open])

  const onScroll = useCallback(() => {
    if (silentRef.current) return
    const col = colRef.current
    if (!col) return

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const top = col.scrollTop

      // Fold the position back into the middle copy. A free-spinning wheel can
      // travel more than one list length between frames, so this normalises by
      // however many lengths it takes rather than jumping exactly one.
      const lower = MIDDLE * loopLength
      const folded = lower + ((((top - lower) % loopLength) + loopLength) % loopLength)
      if (Math.abs(folded - top) > 0.5) {
        col.scrollTop = folded
        paint()
        return
      }

      paint()
      paint()
    })

    // Settle once movement stops, so flicking through several options commits
    // just the one it lands on. Scheduled outside the frame callback so a
    // reposition can't leave the drum uncommitted.
    if (settleRef.current) clearTimeout(settleRef.current)
    settleRef.current = setTimeout(() => {
      const c = colRef.current
      if (!c) return
      // Read fresh — momentum may have carried on since this was scheduled.
      const nearest = Math.round(c.scrollTop / OPTION_H)
      animateTo(nearest * OPTION_H)

      const next = options[nearest % options.length]
      if (next !== undefined && next !== valueRef.current) onSelect(next)
    }, SETTLE_MS)
  }, [loopLength, options, onSelect, paint, animateTo])

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (settleRef.current) clearTimeout(settleRef.current)
    },
    []
  )

  return (
    <div className="time-picker__column">
      <div className="time-picker__band" aria-hidden="true" />
      <div
        className="time-picker__drum"
        ref={colRef}
        onScroll={onScroll}
        onWheel={onWheel}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <div className="time-picker__spacer" />
        {items.map((opt, i) => (
          <div
            key={i}
            className="time-picker__option"
            role="option"
            aria-selected={opt === value}
            onClick={() => {
              animateTo(i * OPTION_H)
              if (opt !== value) onSelect(opt)
            }}
          >
            {opt}
          </div>
        ))}
        <div className="time-picker__spacer" />
      </div>
    </div>
  )
}

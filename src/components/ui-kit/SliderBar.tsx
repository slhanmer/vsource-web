'use client'

import React, { useRef } from 'react'
import './styles/sliderBar.scss'

/**
 * Props for the SliderBar component.
 *
 * @property value - Controlled current value
 * @property onChange - Called with the snapped value after each pointer interaction
 * @property min - Minimum value (default: `50`)
 * @property max - Maximum value (default: `500`)
 * @property step - Snap increment used when no `scale` is provided (default: `10`)
 * @property label - Optional label rendered above the track
 * @property width - CSS width of the outer container (default: `'100%'`)
 * @property unit - Unit suffix displayed next to the current value (default: `'px'`)
 * @property scale - Custom non-linear scale functions for logarithmic or exponential sliders.
 *   - `toSlider(value)` — maps the domain value to a 0–1 track position
 *   - `fromSlider(pos)` — maps a 0–1 track position back to the domain value
 *   When provided, `min`, `max`, and `step` are ignored for position calculation.
 */
interface SliderBarProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  width?: string | number
  unit?: string
  scale?: {
    toSlider: (value: number) => number // value → 0..1 position
    fromSlider: (pos: number) => number // 0..1 position → value
  }
}

// Thumb width (px) — must match .slider-thumb in sliderBar.scss.
const THUMB_W = 14

export const SliderBar: React.FC<SliderBarProps> = ({
  value,
  onChange,
  min = 50,
  max = 500,
  step = 10,
  label,
  width = '100%',
  unit = 'px',
  scale,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)

  const handlePointer = (e: PointerEvent) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const pos = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)

    const percent = pos / rect.width

    const snapped = scale
      ? scale.fromSlider(percent)
      : Math.round((min + percent * (max - min)) / step) * step

    onChange(snapped)
  }

  const pct = scale ? scale.toSlider(value) : (value - min) / (max - min)

  // Inset-corrected position: thumb centre travels from THUMB_W/2 to
  // (width - THUMB_W/2) so it stays inside the channel ends. The fill's right
  // edge uses the SAME value so it always meets the thumb centre — no gap.
  const thumbLeft = `calc(${pct * 100}% + ${(0.5 - pct) * THUMB_W}px)`

  return (
    <div className="slider-container" style={{ width }}>
      {label && <label className="slider-label">{label}</label>}

      <div
        className="slider-track"
        ref={trackRef}
        onPointerDown={(e) => {
          e.preventDefault()
          handlePointer(e.nativeEvent)
          window.addEventListener('pointermove', handlePointer)
          window.addEventListener(
            'pointerup',
            () => {
              window.removeEventListener('pointermove', handlePointer)
            },
            { once: true }
          )
        }}
      >
        <div
          className="slider-fill"
          style={{ width: thumbLeft }} // ends exactly at the thumb centre
        />
        <div
          className="slider-thumb"
          style={{ left: thumbLeft }} // same value → fill meets thumb, no gap
        />
      </div>

      <div className="slider-value">
        {value}
        {unit}
      </div>
    </div>
  )
}

import React from 'react'
import './styles/slideSwitch.scss'

/**
 * Props for the SlideSwitch component.
 *
 * @property checked - Controlled on/off state
 * @property onChange - Called with the next boolean when toggled
 * @property disabled - Greys out and blocks interaction
 * @property variant - Layout mode:
 *   - `'knob'` (default) — original behaviour; optional label rides inside the
 *     track, state read from knob position. Unchanged from prior usage.
 *   - `'labelled'` — component owns a fixed label rendered ABOVE the switch
 *     (matching Input/Dropdown label placement); "on" reads via track fill
 *     (`--action-primary`) + knob position. Label never moves with state.
 * @property label - Visible label. In `knob` it sits in the track; in `labelled`
 *   it sits above the switch. If omitted, `aria-label` is required.
 * @property knobOn / knobOff - Optional content rendered inside the knob per state
 * @property width - Track width (CSS length); drives the knob travel distance
 * @property className - Extra class on the root
 */
type SlideSwitchBase = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  variant?: 'knob' | 'labelled'
  knobOn?: React.ReactNode
  knobOff?: React.ReactNode
  width?: string
  className?: string
}

type SlideSwitchProps = SlideSwitchBase &
  (
    | { label: string; 'aria-label'?: string } // visible label (may still override for SR)
    | { label?: undefined; 'aria-label': string } // no visible label → aria-label required
  )

export const SlideSwitch: React.FC<SlideSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  variant = 'knob',
  label,
  knobOn,
  knobOff,
  width,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <label className={`slide-switch ss--${variant} ${disabled ? 'is-disabled' : ''} ${className}`}>
      {/* labelled variant: component owns the label, rendered BEFORE the input so
          the `input + .slide-switch__track` adjacency (which drives knob travel,
          track-label flip, and focus ring) is preserved. Column layout in SCSS
          places it above the track. */}
      {variant === 'labelled' && label && (
        <span className="slide-switch__field-label">{label}</span>
      )}

      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        // aria-label always resolves: explicit prop wins, else the visible label.
        aria-label={ariaLabel ?? label}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span
        className="slide-switch__track"
        style={width ? ({ '--switch-width': width } as React.CSSProperties) : undefined}
      >
        {/* knob variant keeps its in-track label slot untouched */}
        {variant === 'knob' && label && <span className="slide-switch__track-label">{label}</span>}
        <span className="slide-switch__knob">
          <span className="slide-switch__knob-content">{checked ? knobOn : knobOff}</span>
        </span>
      </span>
    </label>
  )
}

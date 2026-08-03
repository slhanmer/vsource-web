import React from 'react'
import type { ReactNode } from 'react'
import './styles/choice.scss'

/**
 * Props for the Choice component (checkbox or radio input).
 *
 * @property name - Field name for the underlying `<input>`
 * @property label - Display label. Pass an empty string to render only the checkbox/radio mark.
 * @property type - Input type: `'checkbox'` (default) or `'radio'`
 * @property checked - Controlled checked state (default: `false`)
 * @property onChange - Change handler forwarded from the `<input>`
 * @property required - Marks as required; highlights when unchecked
 * @property disabled - Disables the input and greys out the label
 * @property error - Error message rendered below the choice
 * @property value - HTML `value` attribute for radio groups
 * @property size - Visual size: `'default'` or `'large'`
 * @property markType - Check mark style:
 *   - `'default'` — inherits theme colour
 *   - `'success'` — green check
 *   - `'error'` — red check
 *   - `'neutral'` — grey check
 * @property color - Overrides the mark/border colour via `--choice-mark-color` CSS variable
 * @property withLink - Render the label as a clickable anchor element
 * @property handleLinkClick - Handler for the label anchor click when `withLink` is `true`
 * @property focusKey - `data-focus-key` attribute for programmatic focus navigation
 * @property isEditing - Swap the label into an inline `<input>` for in-place editing
 * @property onLabelChange - Called with the new label text when `isEditing` is active
 */
type ChoiceProps = {
  label: string | ReactNode
  withLink?: boolean
  handleLinkClick?: () => void
  name: string
  value?: string | number
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  type?: 'checkbox' | 'radio'
  className?: string
  style?: React.CSSProperties
  size?: 'default' | 'large'
  variant?: 'default' | 'round'
  markType?: 'default' | 'success' | 'error' | 'neutral'
  focusKey?: string
  isEditing?: boolean
  onLabelChange?: (value: string) => void
  color?: string
}

const Choice: React.FC<ChoiceProps> = ({
  label,
  withLink = false,
  handleLinkClick,
  name,
  value,
  checked = false,
  onChange,
  error,
  required,
  disabled,
  type = 'checkbox',
  style,
  className,
  size = 'default',
  variant = 'default',
  markType = 'default',
  focusKey,
  isEditing,
  onLabelChange,
  color,
}) => {
  const isRequired = required && !checked

  return (
    <div
      className={`choice ${checked ? 'is-checked' : ''} ${size === 'default' ? '' : 'large'} ${variant === 'default' ? '' : 'round'} ${
        disabled ? 'is-disabled' : ''
      } ${required ? 'required' : ''} ${className || ''}`}
      style={
        {
          ...style,
          '--choice-mark-color': color ?? undefined,
        } as React.CSSProperties
      }
      data-focus-key={focusKey}
    >
      {/* The label now only wraps the input + box */}
      <label>
        <input
          type={type}
          name={name}
          value={value}
          {...(onChange ? { checked, onChange } : { defaultChecked: checked })}
          required={isRequired}
          disabled={disabled}
          aria-label={typeof label === 'string' && label !== '' ? label : undefined}
        />
        <span
          className={`choice__box ${size === 'default' ? '' : 'large'} ${variant === 'default' ? '' : 'round'}  ${markType === 'default' ? '' : markType}  ${disabled ? 'is-disabled' : ''} ${isRequired ? 'required' : ''}`}
          aria-hidden="true"
          style={{ borderColor: color ?? color }}
        />
      </label>

      {/* Label text (with or without link) */}
      {(label !== '' || isEditing || onLabelChange) &&
        (isEditing ? (
          <input
            className={`choice__label-edit ${size === 'default' ? '' : 'large'} ${variant === 'default' ? '' : 'round'}`}
            defaultValue={typeof label === 'string' ? label : ''}
            autoFocus
            onChange={(e) => onLabelChange?.(e.target.value)}
            onBlur={() => {}}
            onClick={(e) => e.stopPropagation()}
            aria-label={typeof label === 'string' && label !== '' ? label : undefined}
          />
        ) : withLink ? (
          <a className="choice__label link" role="button" onClick={handleLinkClick}>
            {label}
          </a>
        ) : (
          <span
            className={`choice__label ${size === 'default' ? '' : 'large'} ${variant === 'default' ? '' : 'round'} ${disabled ? 'is-disabled' : ''} ${isRequired ? 'required' : ''}`}
          >
            {label}
          </span>
        ))}

      {error && <span className="choice__error">{error}</span>}
    </div>
  )
}

export default Choice

import React, { forwardRef, useMemo, useState, useRef } from 'react'
import { debounceButton } from '@utils'
import { useHoverAndTouch, useViewport } from '@hooks'
import { FingerprintIcon } from '@icons'
import { ButtonLoader } from './ButtonLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { createPortal } from 'react-dom'

import './styles/button.scss'

/**
 * Props for the Button component.
 *
 * @property variant - Visual style, aligned to the Figma "Button" set:
 *   `'basic'` | `'secondary'` | `'tertiary'` | `'cta'` | `'danger'` | `'success'`
 *   | `'text-only'` | `'icon'` | `'icon-only'` | `'toggle'`
 *   Load-bearing app extras (not in the Figma set, kept until their screens
 *   are reworked): `'cancel'` | `'fingerprint'` | `'close'` | `'edit'`
 *   | `'plus'` | `'minus'` | `'filter'`
 * @property handleClick - Click handler. Debounced and locked during async execution.
 * @property label - Button label. Uppercased unless `normalCase` is set.
 * @property normalCase - Suppress automatic uppercasing of string labels.
 * @property icon - Icon element to render alongside (or instead of) the label.
 * @property iconPosition - Icon side for the `'icon'` variant (default `'right'`).
 * @property tooltip - Hover/touch tooltip, rendered via a `document.body` portal.
 */
type BaseButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  variant?:
    | 'basic'
    | 'secondary'
    | 'tertiary'
    | 'cta'
    | 'danger'
    | 'success'
    | 'text-only'
    | 'icon'
    | 'icon-only'
    | 'toggle'
    | 'cancel'
    | 'fingerprint'
    | 'close'
    | 'edit'
    | 'plus'
    | 'minus'
    | 'filter'
  handleClick?: (event: any) => void
  label?: React.ReactNode
  normalCase?: boolean
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  required?: boolean
  tooltip?: string
  debounceDelay?: number
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  width?: string
  suffix?: React.ReactNode
  'aria-label'?: string
}

const Button = forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  const {
    type = 'button',
    variant = 'basic',
    handleClick = (e) => e.preventDefault(),
    label = '',
    icon,
    iconPosition = 'right',
    normalCase = true,
    style,
    className = '',
    disabled = false,
    required = false,
    tooltip,
    debounceDelay = 500,
    width,
    suffix,
    'aria-label': ariaLabelProp,
  } = props

  // Tooltip now anchors to the button itself (button-container removed).
  const localRef = useRef<HTMLButtonElement>(null)
  const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || localRef

  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  const debouncedClick = useMemo(() => {
    return debounceButton(async (event: any) => {
      if (disabled || isLocked) return
      try {
        setIsLocked(true)
        await Promise.resolve(handleClick(event))
      } finally {
        setIsLocked(false)
      }
    }, debounceDelay)
  }, [debounceDelay, disabled, isLocked, handleClick])

  const {
    isHovered,
    isTouched,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useHoverAndTouch()
  const showTooltip = (isHovered || isTouched) && !!tooltip

  const isMobile = useViewport()

  const isIconOnly =
    variant === 'icon-only' ||
    variant === 'close' ||
    variant === 'edit' ||
    variant === 'plus' ||
    variant === 'minus'

  const ariaLabel =
    ariaLabelProp ||
    (typeof label === 'string' && label.trim()) ||
    tooltip ||
    (isIconOnly ? 'Icon button' : undefined)

  const renderLabel = (text: React.ReactNode) =>
    typeof text === 'string' ? (normalCase ? text : text.toUpperCase()) : text

  const onEnter = () => {
    handleMouseEnter()
    const el = buttonRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setTooltipPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 })
    }
  }
  const onLeave = () => {
    handleMouseLeave()
    setTooltipPos(null)
  }

  const buttonEl = (
    <button
      type={type}
      style={{ width, ...style }}
      className={`basic-button ${variant}-button ${className} ${
        required ? 'required' : ''
      } ${disabled ? 'disabled' : ''} ${isMobile ? 'mobile' : ''}`}
      onClick={debouncedClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || isLocked}
      ref={buttonRef}
      aria-label={ariaLabel}
    >
      {/* ICON-ONLY */}
      {variant === 'icon-only' && icon ? (
        <span className="icon-only-wrapper">{icon}</span>
      ) : /* ICON: label + icon side by side */
      variant === 'icon' && icon ? (
        <span className="label-icon-wrapper">
          <span className={iconPosition === 'right' ? 'label-left' : 'label-right'}>
            {renderLabel(label)}
          </span>
          <span className={iconPosition === 'right' ? 'icon-right' : 'icon-left'}>{icon}</span>
        </span>
      ) : /* FINGERPRINT */
      variant === 'fingerprint' ? (
        <FingerprintIcon className={`icon fingerprint ${required ? 'required' : ''}`} />
      ) : /* PLUS / MINUS */
      variant === 'plus' || variant === 'minus' ? (
        <>
          {label && <span className="mini-label">{label}</span>}
          <FontAwesomeIcon icon={variant === 'plus' ? faPlus : faMinus} size="sm" />
        </>
      ) : (
        /* DEFAULT label */
        <>
          {label && (
            <span className="label-span">
              {isLocked ? (
                <span className="label-span loading">
                  {renderLabel(label)}
                  <span className="overlay-loader">
                    <ButtonLoader />
                  </span>
                </span>
              ) : (
                renderLabel(label)
              )}
            </span>
          )}
        </>
      )}
    </button>
  )

  const tooltipPortal =
    showTooltip && tooltipPos
      ? createPortal(
          <div
            style={{
              position: 'fixed',
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateX(-50%)',
              zIndex: 9999,
              fontSize: '12px',
              padding: '4px 6px',
              borderRadius: '4px',
              color: 'whitesmoke',
              background: 'rgba(40, 40, 40, 0.9)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {tooltip}
          </div>,
          document.body
        )
      : null

  // FINGERPRINT keeps a minimal column wrapper (button + label beneath).
  if (variant === 'fingerprint') {
    return (
      <span
        className={`fingerprint-wrapper ${required ? 'required' : ''} ${
          disabled ? 'disabled' : ''
        }`}
      >
        {buttonEl}
        {label && (
          <span
            className={`fingerprint-label ${required ? 'required' : ''} ${
              disabled ? 'disabled' : ''
            }`}
          >
            {renderLabel(label)}
          </span>
        )}
        {suffix}
        {tooltipPortal}
      </span>
    )
  }

  // All other variants: bare button, no container wrapper.
  return (
    <>
      {buttonEl}
      {suffix}
      {tooltipPortal}
    </>
  )
})

Button.displayName = 'CustomButton'
export default Button

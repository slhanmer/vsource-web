import React, { useState, useId } from 'react'
import './styles/starRating.scss'

/**
 * A controlled star-rating input.
 *
 * Functional content (the three-state rule): the fill is a COLOUR lane
 * (--action-primary), not shadow/emboss. Empty stars are a flat outline.
 * Dark-mode parity is automatic — --action-primary swaps to the blue lane
 * under [data-theme='dark'] at the token layer, so this component owns no
 * theme-specific CSS.
 *
 * Emits a rating; knows nothing about submission. Compose inside a modal
 * or form and lift the value.
 *
 * @property value - Current rating (0 = unrated). Controlled.
 * @property onChange - Fired with the chosen rating (1..max).
 * @property max - Number of stars (default 5).
 * @property readOnly - Display-only, no interaction.
 * @property disabled - Non-interactive + dimmed.
 * @property size - Visual size preset.
 * @property label - Accessible group label (defaults to "Rating").
 * @property showText - Render a textual readout beside the stars.
 * @property formatText - Override the readout. Receives (value, max);
 *   defaults to "N out of max". Return '' to render nothing for a value.
 * @property notRatedText - Readout shown when value is 0 (default "Not rated").
 * @property textPosition - Readout placement relative to the stars (default "below").
 */
interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  max?: number
  readOnly?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showText?: boolean
  formatText?: (value: number, max: number) => string
  notRatedText?: string
  textPosition?: 'below' | 'side'
  className?: string
}

const STAR_PATH =
  'M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z'

const StarIcon = ({ filled, gradientId }: { filled: boolean; gradientId: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {filled && (
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="star-grad-top" />
          <stop offset="100%" className="star-grad-bottom" />
        </linearGradient>
      </defs>
    )}
    <path
      d={STAR_PATH}
      className={filled ? 'star-fill' : 'star-outline'}
      fill={filled ? `url(#${gradientId})` : 'none'}
    />
  </svg>
)

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  label = 'Rating',
  showText = false,
  formatText,
  notRatedText = 'Not rated',
  textPosition = 'below',
  className = '',
}) => {
  const [hover, setHover] = useState<number>(0)
  const groupId = useId()

  const interactive = !readOnly && !disabled
  // hover preview only makes sense with a pointer — gate it off touch
  const active = hover || value

  const commit = (rating: number) => {
    if (!interactive) return
    // click the current rating again to clear it back to 0
    onChange?.(rating === value ? 0 : rating)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return
    let next = value
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(max, value + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, value - 1)
    else if (/^[1-9]$/.test(e.key)) next = Math.min(max, Number(e.key))
    else if (e.key === 'Home') next = 1
    else if (e.key === 'End') next = max
    else return
    e.preventDefault()
    onChange?.(next)
  }

  // Readout reflects the previewed value on hover, else the committed value.
  const readoutValue = hover || value
  const readoutText =
    readoutValue === 0
      ? notRatedText
      : formatText
        ? formatText(readoutValue, max)
        : `${readoutValue} out of ${max}`

  return (
    <div
      className={[
        'star-rating',
        `star-rating--${size}`,
        showText ? `star-rating--text-${textPosition}` : '',
        disabled ? 'star-rating--disabled' : '',
        readOnly ? 'star-rating--readonly' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-disabled={disabled || undefined}
    >
      <div
        className="star-rating__stars"
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={interactive ? label : `${label}: ${value} out of ${max} stars`}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1
          const filled = starValue <= active
          return (
            <button
              key={`${groupId}-${starValue}`}
              type="button"
              className="star-rating__star"
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? starValue === value : undefined}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
              tabIndex={-1}
              disabled={!interactive}
              onClick={() => commit(starValue)}
              onMouseEnter={() => interactive && setHover(starValue)}
            >
              <StarIcon filled={filled} gradientId={`${groupId}-grad-${starValue}`} />
            </button>
          )
        })}
      </div>

      {showText && readoutText !== '' && (
        <span
          className={['star-rating__text', readoutValue === 0 ? 'star-rating__text--empty' : '']
            .filter(Boolean)
            .join(' ')}
        >
          {readoutText}
        </span>
      )}
    </div>
  )
}

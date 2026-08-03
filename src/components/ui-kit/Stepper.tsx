import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import './styles/stepper.scss'

/**
 * Props for the Stepper component.
 *
 * Paged navigation for any stepped flow — walkthroughs, wizards, multi-step
 * modals. Renders `[< Back]  [n of m]  [Next >]` and owns the edge-case logic:
 * Back is disabled on the first step, and Next becomes the finish action on the
 * last. Both are overridable.
 *
 * NOTE: renders its own controls rather than composing Button — the kit's
 * button variants carry chrome (2px strokes, fills, the text-only underline)
 * that is too heavy for inline nav. Trade-off: no Button debounce. Acceptable
 * here because stepping is idempotent — a double-fire lands on the same step.
 *
 * @property index - Current step, zero-based
 * @property total - Total number of steps
 * @property onBack - Fires when Back is activated
 * @property onNext - Fires when Next is activated (non-final steps)
 * @property onFinish - Fires when Next is activated on the final step; falls back to onNext
 * @property backLabel - Override the Back label (default `'Back'`)
 * @property nextLabel - Override the Next label (default `'Next'`)
 * @property finishLabel - Override the final-step label (default `'Finish'`)
 * @property showCount - Render the `n of m` counter (default `true`)
 * @property hideBackOnFirst - Hide rather than disable Back on the first step
 * @property disableBack - Force Back disabled regardless of position
 */
interface StepperProps {
  index: number
  total: number
  onBack?: () => void
  onNext?: () => void
  onFinish?: () => void
  backLabel?: string
  nextLabel?: string
  finishLabel?: string
  showCount?: boolean
  hideBackOnFirst?: boolean
  disableBack?: boolean
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({
  index,
  total,
  onBack,
  onNext,
  onFinish,
  backLabel = 'Back',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  showCount = true,
  hideBackOnFirst = false,
  disableBack,
  className = '',
}) => {
  const isFirst = index <= 0
  const isLast = index >= total - 1

  // Stepper owns the edge cases; props override.
  const backDisabled = disableBack ?? isFirst
  const showBack = !(isFirst && hideBackOnFirst)

  const handleNext = () => {
    if (isLast) (onFinish ?? onNext)?.()
    else onNext?.()
  }

  return (
    <div className={`stepper ${className}`}>
      {showBack ? (
        <button
          type="button"
          className="stepper__control stepper__control--back"
          onClick={onBack}
          disabled={backDisabled}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="stepper__chevron" />
          <span className="stepper__label">{backLabel}</span>
        </button>
      ) : (
        // Keep the row balanced when Back is hidden.
        <span className="stepper__spacer" aria-hidden="true" />
      )}

      {showCount && (
        <span className="stepper__count">
          {Math.min(index + 1, total)} of {total}
        </span>
      )}

      <button
        type="button"
        className="stepper__control stepper__control--next"
        onClick={handleNext}
      >
        <span className="stepper__label">{isLast ? finishLabel : nextLabel}</span>
        {!isLast && <FontAwesomeIcon icon={faChevronRight} className="stepper__chevron" />}
      </button>
    </div>
  )
}

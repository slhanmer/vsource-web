import { useState, useCallback } from 'react'

/**
 * Tracks hover and touch state for an element, returning stable event handler callbacks.
 * Used by components that need to respond identically to mouse hover and touch press
 * (e.g. showing tooltips on both desktop and mobile).
 *
 * Attach the returned handlers to the target element's `onMouseEnter`, `onMouseLeave`,
 * `onTouchStart`, and `onTouchEnd` props.
 *
 * @returns `{ isHovered, isTouched, handleMouseEnter, handleMouseLeave, handleTouchStart, handleTouchEnd }`
 *
 * @example
 * const { isHovered, isTouched, handleMouseEnter, handleMouseLeave } = useHoverAndTouch()
 * const showTooltip = isHovered || isTouched
 */
export const useHoverAndTouch = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleTouchStart = useCallback(() => {
    setIsTouched(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsTouched(false)
  }, [])

  return {
    isHovered,
    isTouched,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  }
}

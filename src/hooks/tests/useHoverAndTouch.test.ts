import { renderHook, act } from '@testing-library/react'
import { useHoverAndTouch } from '../useHoverAndTouch'

describe('useHoverAndTouch', () => {
  it('initializes with not hovered and not touched', () => {
    const { result } = renderHook(() => useHoverAndTouch())

    expect(result.current.isHovered).toBe(false)
    expect(result.current.isTouched).toBe(false)
  })

  it('sets hovered state correctly', () => {
    const { result } = renderHook(() => useHoverAndTouch())

    act(() => {
      result.current.handleMouseEnter()
    })
    expect(result.current.isHovered).toBe(true)

    act(() => {
      result.current.handleMouseLeave()
    })
    expect(result.current.isHovered).toBe(false)
  })

  it('sets touched state correctly', () => {
    const { result } = renderHook(() => useHoverAndTouch())

    act(() => {
      result.current.handleTouchStart()
    })
    expect(result.current.isTouched).toBe(true)

    act(() => {
      result.current.handleTouchEnd()
    })
    expect(result.current.isTouched).toBe(false)
  })
})

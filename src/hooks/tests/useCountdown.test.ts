import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '../useCountdown'

jest.useFakeTimers()

describe('useCountdown', () => {
  it('initializes with 0 seconds', () => {
    const { result } = renderHook(() => useCountdown(5))
    expect(result.current.countdown).toBe(0)
    expect(result.current.isCountdownExpired).toBe(true)
  })

  it('starts countdown from initialSeconds when no arg given', () => {
    const { result } = renderHook(() => useCountdown(3))

    act(() => {
      result.current.startCountdown()
    })
    expect(result.current.countdown).toBe(3)

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.countdown).toBe(2)
    expect(result.current.isCountdownExpired).toBe(false)

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(result.current.countdown).toBe(0)
    expect(result.current.isCountdownExpired).toBe(true)
  })

  it('starts countdown from provided value', () => {
    const { result } = renderHook(() => useCountdown(10))

    act(() => {
      result.current.startCountdown(5)
    })
    expect(result.current.countdown).toBe(5)

    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.countdown).toBe(2)
  })

  it('resets countdown back to initialSeconds', () => {
    const { result } = renderHook(() => useCountdown(4))

    act(() => {
      result.current.startCountdown()
      jest.advanceTimersByTime(2000)
    })
    expect(result.current.countdown).toBe(2)

    act(() => {
      result.current.resetCountdown()
    })
    expect(result.current.countdown).toBe(4)
  })
})

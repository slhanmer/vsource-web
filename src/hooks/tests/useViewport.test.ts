import { renderHook, act, waitFor } from '@testing-library/react'
import { useViewport } from '../useViewport'

// Mock debounceViewport to just call immediately
jest.mock('../../utils', () => ({
  debounceViewport: (fn: (...args: any[]) => void) => fn,
  getCssVarPx: () => 1024,
}))

describe('useViewport', () => {
  beforeEach(() => {
    delete (window as any).ontouchstart // reset touch
  })

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    window.dispatchEvent(new Event('resize'))
  }

  it('returns false on desktop width without touch', async () => {
    setWindowWidth(1200)
    const { result } = renderHook(() => useViewport(1024))
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('returns true on mobile width', async () => {
    setWindowWidth(500)
    const { result } = renderHook(() => useViewport(1024))
    await waitFor(() => expect(result.current).toBe(true))
  })

  it('updates when window is resized', async () => {
    setWindowWidth(1200)
    const { result } = renderHook(() => useViewport(1024))
    await waitFor(() => expect(result.current).toBe(false))

    act(() => {
      setWindowWidth(600)
    })

    await waitFor(() => expect(result.current).toBe(true))
  })

  it('returns true if device supports touch regardless of width', async () => {
    ;(window as any).ontouchstart = true
    setWindowWidth(1500)
    const { result } = renderHook(() => useViewport(1024))
    await waitFor(() => expect(result.current).toBe(true))
  })
})

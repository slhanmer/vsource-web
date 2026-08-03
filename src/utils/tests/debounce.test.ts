import { debounceButton, debounceViewport } from '../debounce'

jest.useFakeTimers()

describe('debounceButton', () => {
  it('debounces calls and only runs once after delay', () => {
    const mockFn = jest.fn()
    const debounced = debounceButton(mockFn, 200)

    debounced('a')
    debounced('b')
    debounced('c')

    // Not called immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Fast-forward time
    jest.advanceTimersByTime(199)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('c') // last args only
  })
})

describe('debounceViewport', () => {
  it('debounces multiple calls to one execution', () => {
    const mockFn = jest.fn()
    const debounced = debounceViewport(mockFn, 300)

    debounced()
    debounced()
    debounced()

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('passes arguments correctly', () => {
    const mockFn = jest.fn()
    const debounced = debounceViewport(mockFn, 100)

    debounced(1, 2, 3)
    jest.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith(1, 2, 3)
  })
})

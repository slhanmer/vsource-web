/**
 * Debounces a button click handler. Prevents rapid re-firing during the delay window.
 * Used by the `Button` component to block double-clicks.
 *
 * @param func - The click handler to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns A debounced version of `func`
 */
export function debounceButton<T extends (...args: Array<unknown>) => void>(
  func: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * Debounces a resize/viewport handler. Used by `useViewport` to throttle window resize events.
 *
 * @param func - The handler to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns A debounced version of `func`
 */
export function debounceViewport<T extends (...args: unknown[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * Debounces a function and attaches a `.cancel()` method to clear any pending invocation.
 * Used for search inputs and other fields where in-flight calls must be cancellable on unmount.
 *
 * @param func - The function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns A debounced version of `func` with an additional `.cancel()` method
 */
export function debounceInput<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timer: NodeJS.Timeout

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }

  debounced.cancel = () => clearTimeout(timer)

  return debounced as T & { cancel: () => void }
}

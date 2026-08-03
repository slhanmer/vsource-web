/** Visual severity of a toast notification. Maps to distinct icon and colour styles. */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Numeric shorthand for toast type — mirrors `MsgCode` so API responses can be
 * passed directly to `showToast` without mapping. `1` = success, `3`/`4` = error.
 */
export type ToastCode = 0 | 1 | 2 | 3 | 4

/** An individual toast notification tracked in the Toast context. */
export type Toast = {
  /** Unique identifier used to target and remove the toast */
  id: string
  message: string
  type: ToastType
  /** True while the dismiss animation is running, just before removal */
  exiting?: boolean
}

/** Shape of the Toast context value provided by `ToastProvider`. */
export type ToastContextType = {
  /**
   * Display a toast notification.
   * @param message - Text shown in the toast
   * @param typeOrCode - `ToastType` string or numeric `MsgCode` from an API response
   * @param duration - Auto-dismiss delay in milliseconds (default: 3000)
   */
  showToast: (message: string, typeOrCode?: ToastType | ToastCode, duration?: number) => void
}

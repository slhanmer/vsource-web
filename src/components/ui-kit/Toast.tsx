'use client'
import React, { createContext, useCallback, useContext, useState } from 'react'

import './styles/toast.scss'
import { Toast, ToastCode, ToastContextType, ToastType } from '@types'

// This is to integrate with useFetchApi's message codes automatically
const getToastTypeFromCode = (code?: number): ToastType => {
  switch (code) {
    case 0:
      return 'info' // start value in fetchApi hook
    case 1:
      return 'success' // success
    case 2:
      return 'info' // redirect/info
    case 3:
      return 'warning' // client error
    case 4:
      return 'error' // server error
    default:
      return 'info'
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Context provider that mounts the toast container and exposes `showToast`.
 * Wrap the app (or a subtree) with this component to enable toasts.
 *
 * @example
 * // In layout.tsx:
 * <ToastProvider>
 *   {children}
 * </ToastProvider>
 *
 * // In any child component:
 * const { showToast } = useToast()
 * showToast('Saved successfully', 1)
 */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Array<Toast>>([])

  /**
   * Show a toast
   * @param message Text to display
   * @param typeOrCode Either a ToastType ("success", "error", etc) or a numeric ToastCode
   * @param duration Override display duration in ms (defaults to 3000)
   */
  const showToast = useCallback(
    (message: string, typeOrCode?: ToastType | ToastCode, duration: number = 3000) => {
      const id = crypto.randomUUID()

      // convert number codes into a ToastType
      const type: ToastType =
        typeof typeOrCode === 'number' ? getToastTypeFromCode(typeOrCode) : typeOrCode || 'info'

      setToasts((prev) => [...prev, { id, message, type }])

      // Start the exit animation before removal
      setTimeout(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
      }, duration - 300) // e.g. animate for 300ms at the end

      // Remove the toast fully
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type} ${toast.exiting ? 'exiting' : ''}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

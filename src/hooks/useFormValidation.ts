import { useState, useCallback } from 'react'

/**
 * Manages a map of field-level validation error strings for a form.
 *
 * @param initialErrors - Optional initial error state keyed by field name (defaults to `{}`)
 * @returns `{ errors, setFieldError }` — read `errors[name]` for the current error,
 *   call `setFieldError(name, null)` to clear a field.
 *
 * @example
 * const { errors, setFieldError } = useFormValidation()
 * // On submit:
 * if (!value) setFieldError('email', 'Email is required.')
 * // In JSX:
 * <Input error={errors.email} />
 */
export function useFormValidation(initialErrors: Record<string, string | null> = {}) {
  const [errors, setErrors] = useState(initialErrors)

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  return { errors, setFieldError }
}

import { DEFAULT_PASSWORD_RULES } from '@/constants'
import { InputType, ValidationOptions } from '@types'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// AU mobiles: 04xxxxxxxx or +614xxxxxxxx
const auMobileRegex = /^(?:\+?61|0)4\d{8}$/
// General E.164-ish (very loose fallback)
const intlPhoneRegex = /^\+?[0-9\s\-()]{7,}$/

/**
 * Validates a form field value for a given `InputType`.
 *
 * Returns an error message string when invalid, or `null` when valid (or empty and not required).
 * Used by the `Input` component for real-time validation and by forms on submit.
 *
 * @param type - The input type (e.g. `'email'`, `'mobile'`, `'password'`)
 * @param value - The raw field value to validate
 * @param opts - Optional validation constraints (required, min/max, password rules, region, etc.)
 * @returns An error message string, or `null` if valid
 *
 * @example
 * validateValue('email', 'not-an-email') // → 'Please enter a valid email.'
 * validateValue('email', 'test@example.com') // → null
 * validateValue('text', '', { required: true }) // → 'This field is required.'
 */
export function validateValue(
  type: InputType,
  value: string | number | undefined | null,
  opts: ValidationOptions = {}
): string | null {
  const v = String(value ?? '').trim()

  // Required
  if (opts.required && v.length === 0) return 'This field is required.'

  if (!v) return null // empty but not required → no error

  switch (type) {
    case 'date': {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return 'Please enter a valid date (DD/MM/YYYY).'
      return null
    }

    case 'time': {
      if (!/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(v))
        return 'Please enter a valid time (HH:MM AM/PM).'
      return null
    }

    case 'currency': {
      const num = Number(v)
      if (Number.isNaN(num)) return 'Please enter a valid amount.'

      // Check for 2 decimal places max
      if (!/^\d+(\.\d{1,2})?$/.test(v)) {
        return 'Must be a valid amount with up to 2 decimal places.'
      }

      if (opts.min !== undefined && num < opts.min) return `Must be ≥ ${opts.min}.`
      if (opts.max !== undefined && num > opts.max) return `Must be ≤ ${opts.max}.`

      return null
    }

    case 'email': {
      if (!emailRegex.test(v)) return 'Please enter a valid email.'
      return null
    }
    case 'password': {
      // Defaults applied here rather than relying on every caller to pass them — an omitted validationOptions previously meant length-only, which fails open.
      const rules = { ...DEFAULT_PASSWORD_RULES, ...opts }

      const min = rules.passwordMinLen ?? 12
      if (v.length < min) return `Password must be at least ${min} characters.`
      if (rules.requireUpper && !/[A-Z]/.test(v)) return 'Include at least one uppercase letter.'
      if (rules.requireLower && !/[a-z]/.test(v)) return 'Include at least one lowercase letter.'
      if (rules.requireNumber && !/[0-9]/.test(v)) return 'Include at least one number.'
      if (rules.requireSpecial && !/[^\w\s]/.test(v))
        return 'Include at least one special character.'
      return null
    }
    case 'number': {
      const num = Number(v)
      if (Number.isNaN(num)) return 'Please enter a valid number.'
      if (opts.min !== undefined && num < opts.min) return `Must be ≥ ${opts.min}.`
      if (opts.max !== undefined && num > opts.max) return `Must be ≤ ${opts.max}.`
      return null
    }
    case 'mobile':
    case 'phone': {
      if (opts.region === 'AU') {
        if (!auMobileRegex.test(v)) return 'Please enter a valid AU mobile (e.g. 04XXXXXXXX).'
      } else {
        if (!intlPhoneRegex.test(v)) return 'Please enter a valid phone number.'
      }
      return null
    }
    case 'text':
    default: {
      if (opts.minLength && v.length < opts.minLength)
        return `Must be at least ${opts.minLength} characters.`
      if (opts.maxLength && v.length > opts.maxLength)
        return `Must be at most ${opts.maxLength} characters.`
      return null
    }
  }
}

/**
 * Supported input types for the `Input` ui-kit component.
 * Drives rendering (e.g. textarea for long `text`), masking, validation, and autocomplete behaviour.
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'mobile'
  | 'phone'
  | 'currency'
  | 'colour'
  | 'date'
  | 'time'
  | 'datetime'
  | 'chat'
  | 'code'

/**
 * Validation constraints passed to `validateValue` and the `Input` component.
 * All fields are optional — only the constraints relevant to the given `InputType` are applied.
 */
export type ValidationOptions = {
  required?: boolean
  minLength?: number
  maxLength?: number
  /** Minimum numeric value (applies to `number` and `currency` types) */
  min?: number
  /** Maximum numeric value (applies to `number` and `currency` types) */
  max?: number
  /** Minimum password length; defaults to 12 when not provided */
  passwordMinLen?: number
  requireUpper?: boolean
  requireLower?: boolean
  requireNumber?: boolean
  requireSpecial?: boolean
  /** Phone/mobile validation region. `'AU'` enforces the `04XXXXXXXX` format. */
  region?: 'AU' | 'INTL'
}

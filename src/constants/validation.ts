import type { ValidationOptions } from '@types'

export const DEFAULT_PASSWORD_RULES: ValidationOptions = {
  passwordMinLen: 12,
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSpecial: true,
}

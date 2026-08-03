import { validateValue } from '../validateValue'
import type { ValidationOptions } from '@types'

describe('validateValue', () => {
  describe('required', () => {
    it('returns error when required and empty', () => {
      expect(validateValue('text', '', { required: true })).toBe('This field is required.')
    })

    it('returns null when not required and empty', () => {
      expect(validateValue('text', '', { required: false })).toBeNull()
    })
  })

  describe('email', () => {
    it('accepts valid email', () => {
      expect(validateValue('email', 'test@example.com')).toBeNull()
    })

    it('rejects invalid email', () => {
      expect(validateValue('email', 'not-an-email')).toBe('Please enter a valid email.')
    })
  })

  describe('password', () => {
    const opts: ValidationOptions = {
      passwordMinLen: 8,
      requireUpper: true,
      requireLower: true,
      requireNumber: true,
      requireSpecial: true,
    }

    it('accepts valid password', () => {
      expect(validateValue('password', 'GoodPass1!', opts)).toBeNull()
    })

    it('enforces minimum length', () => {
      expect(validateValue('password', 'Short1!', opts)).toBe(
        'Password must be at least 8 characters.'
      )
    })

    it('requires uppercase', () => {
      expect(validateValue('password', 'goodpass1!', opts)).toBe(
        'Include at least one uppercase letter.'
      )
    })

    it('requires lowercase', () => {
      expect(validateValue('password', 'GOODPASS1!', opts)).toBe(
        'Include at least one lowercase letter.'
      )
    })

    it('requires number', () => {
      expect(validateValue('password', 'GoodPass!', opts)).toBe('Include at least one number.')
    })

    it('requires special char', () => {
      expect(validateValue('password', 'GoodPass1', opts)).toBe(
        'Include at least one special character.'
      )
    })
  })

  describe('number', () => {
    it('accepts valid number', () => {
      expect(validateValue('number', 42)).toBeNull()
    })

    it('rejects invalid number', () => {
      expect(validateValue('number', 'abc')).toBe('Please enter a valid number.')
    })

    it('enforces min/max', () => {
      expect(validateValue('number', 1, { min: 5 })).toBe('Must be ≥ 5.')
      expect(validateValue('number', 20, { max: 10 })).toBe('Must be ≤ 10.')
    })
  })

  describe('phone/mobile', () => {
    it('accepts valid AU mobile', () => {
      expect(validateValue('mobile', '0412345678', { region: 'AU' })).toBeNull()
      expect(validateValue('mobile', '+61412345678', { region: 'AU' })).toBeNull()
    })

    it('rejects invalid AU mobile', () => {
      expect(validateValue('mobile', '0312345678', { region: 'AU' })).toBe(
        'Please enter a valid AU mobile (e.g. 04XXXXXXXX).'
      )
    })

    it('accepts general phone', () => {
      expect(validateValue('phone', '+1-202-555-0100')).toBeNull()
    })

    it('rejects invalid general phone', () => {
      expect(validateValue('phone', 'bad')).toBe('Please enter a valid phone number.')
    })
  })

  describe('text', () => {
    it('enforces minLength and maxLength', () => {
      expect(validateValue('text', 'hi', { minLength: 5 })).toBe('Must be at least 5 characters.')
      expect(validateValue('text', 'hellooooo', { maxLength: 5 })).toBe(
        'Must be at most 5 characters.'
      )
    })

    it('returns null if within bounds', () => {
      expect(validateValue('text', 'hello', { minLength: 3, maxLength: 10 })).toBeNull()
    })
  })
})

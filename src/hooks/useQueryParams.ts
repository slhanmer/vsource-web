'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Reads URL query parameters and returns them typed and merged with defaults.
 * Values are coerced to match the type of the corresponding default:
 * - boolean defaults → `raw === 'true'`
 * - number defaults → `Number(raw)`
 * - string defaults → raw string value
 *
 * Missing parameters fall back to their default value.
 * Must be used inside a `<Suspense>` boundary (wraps `useSearchParams`).
 *
 * @param defaults - An object whose keys are the expected query param names and
 *   whose values define both the fallback and the coercion type
 * @returns A typed object with the same shape as `defaults`, populated from the URL
 *
 * @example
 * const { page, active } = useQueryParams({ page: 1, active: false })
 * // ?page=3&active=true → { page: 3, active: true }
 */
export function useQueryParams<T extends Record<string, any>>(defaults: T): T {
  const params = useSearchParams()

  return Object.keys(defaults).reduce((acc, key) => {
    const def = defaults[key]
    const raw = params.get(key)

    let value: unknown = def

    if (raw !== null) {
      if (typeof def === 'boolean') {
        value = raw === 'true'
      } else if (typeof def === 'number') {
        value = Number(raw)
      } else {
        value = raw
      }
    }

    acc[key as keyof T] = value as T[keyof T]
    return acc
  }, {} as T)
}

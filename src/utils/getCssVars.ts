/**
 * Reads a CSS custom property value from `:root`.
 * Returns `fallback` (or `''`) when called server-side or when the variable is not set.
 *
 * @param name - CSS variable name including the `--` prefix (e.g. `'--primary-colour'`)
 * @param fallback - Value to return when the variable is unset or not in a browser context
 * @returns The trimmed CSS variable value, or `fallback`
 */
export function getCssVar(name: string, fallback?: string): string {
  if (typeof window === 'undefined') return fallback ?? ''
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return val || fallback || ''
}

/**
 * Reads a CSS custom property and returns its value as a pixel integer.
 * Strips the trailing `px` suffix before parsing.
 *
 * @param name - CSS variable name including the `--` prefix (e.g. `'--breakpoint-desktop'`)
 * @param fallback - Numeric fallback in pixels when the variable is unset (defaults to `0`)
 * @returns The integer pixel value, or `fallback`
 */
export function getCssVarPx(name: string, fallback = 0): number {
  const raw = getCssVar(name, `${fallback}px`)
  return raw.endsWith('px') ? parseInt(raw.replace('px', ''), 10) : fallback
}

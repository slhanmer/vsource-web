/**
 * Converts an ISO 8601 datetime string to the `YYYY-MM-DD` format expected by
 * HTML `<input type="date">` elements.
 *
 * @param isoString - Full ISO datetime string (e.g. `'2024-06-15T10:30:00Z'`), or `undefined`
 * @returns The date portion (`'YYYY-MM-DD'`), or `''` if the input is falsy
 */
export function toDateInputValue(isoString: string | undefined): string {
  return isoString ? isoString.split('T')[0] : ''
}

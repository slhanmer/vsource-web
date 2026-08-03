/**
 * Builds a URL string by appending query parameters to a path.
 * `null` and `undefined` values are omitted from the query string.
 *
 * @param path - The URL path (e.g. `'/reports/list'`)
 * @param params - Key-value map of query parameters; `null`/`undefined` values are skipped
 * @returns Full URL string with encoded query string (e.g. `'/reports/list?page=1&active=true'`)
 *
 * @example
 * buildQuery('/api/users', { page: 1, active: true, filter: null })
 * // → '/api/users?page=1&active=true'
 */
export function buildQuery(
  path: string,
  params: Record<string, string | number | boolean | null | undefined>
) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value))
    }
  })
  return `${path}?${search.toString()}`
}

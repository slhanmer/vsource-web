/** Payload sent to the server-side error logging endpoint when a fetch fails. */
export type ErrorLog = {
  /** API path or URL that failed */
  location: string
  /** Request body that was sent, if any */
  dataSubmitted?: any
  /** HTTP status code as a string */
  errorCode?: string
  errorDesc?: string
  errorMsg?: string
  errorStack?: string
}

/**
 * Normalised response code from `useFetchApi`.
 * - `0` — uninitialised / not yet run
 * - `1` — success (HTTP 2xx)
 * - `2` — redirect (HTTP 3xx)
 * - `3` — client error (HTTP 4xx)
 * - `4` — server error (HTTP 5xx) or network failure
 */
export type MsgCode = 0 | 1 | 2 | 3 | 4

/**
 * Standard envelope returned by every `useFetchApi` call.
 * @template T Shape of the `data` payload on a successful response.
 */
export type FetchResult<T = any> = {
  /** Human-readable message from the server (`msg` or `message` field) */
  msg: string
  msgCode: MsgCode
  /** Raw HTTP status code, if a response was received */
  status?: number
  /** Typed response payload; `undefined` on error or HTTP 204 */
  data?: T
}

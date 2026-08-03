'use client'

import { useCallback } from 'react'
import type { FetchResult, ErrorLog, MsgCode } from '@types'

const env = process.env.NEXT_PUBLIC_APP_ENV || 'dev'

const API_BASE =
  env === 'staging'
    ? process.env.NEXT_PUBLIC_STAGING_EXTERNAL_API
    : env === 'prod'
      ? process.env.NEXT_PUBLIC_PROD_EXTERNAL_API
      : process.env.NEXT_PUBLIC_DEV_EXTERNAL_API

function logError(errorDeets: ErrorLog) {
  // Fire-and-forget: logging must never block or break the caller's request.
  fetch(API_BASE + 'errors/logError', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(errorDeets),
  }).catch((err) => {
    console.error('Error logging failed:', err)
  })
}

/**
 * Returns a `fetchApi` function for making authenticated API calls to the backend.
 *
 * The returned function handles:
 * - JSON and `FormData` request bodies (auto-detects `File`/`Blob` values)
 * - `blob` response type for file downloads
 * - HTTP status → `MsgCode` normalisation (1=success, 2=redirect, 3=client error, 4=server error)
 * - Automatic server-side error logging for 4xx/5xx responses
 * - Injects a `timestamp` field into JSON bodies to prevent replay caching
 * - Selects the correct API base URL from environment variables based on `NEXT_PUBLIC_APP_ENV`
 *
 * The returned function is referentially stable for the lifetime of the
 * component. It closes over nothing reactive — `API_BASE` and `logError` are
 * module scope, and every input arrives as an argument — so an empty
 * dependency list is correct rather than a suppression. Stability matters
 * because callers legitimately need to put `fetchApi` in effect dependency
 * arrays; without it, any such effect re-runs on every render.
 *
 * @returns An async `fetchApi` function
 *
 * @example
 * const fetchApi = useFetchApi()
 * const res = await fetchApi<User[]>('user/list', { page: 1 })
 * if (res.msgCode === 1) setUsers(res.data)
 */
export function useFetchApi() {
  const fetchApi = useCallback(
    async <T = any>(
      /**
       * API path relative to the base URL, or an absolute URL (must start with `http`).
       */
      location: string,
      /**
       * Request payload. Plain objects are sent as JSON (or as `FormData` if any value is a `File`/`Blob`).
       * Pass `null` or omit for requests with no body.
       */
      postData?: Record<string, any> | FormData | null,
      /** Response format — use `'blob'` for file download endpoints. */
      responseType: 'json' | 'blob' = 'json',
      /** Override the API base URL for third-party endpoints. Disables error logging when set. */
      baseUrl?: string,
      method: 'POST' | 'GET' = 'POST'
    ): Promise<FetchResult<T>> => {
      let msg = ''
      let msgCode: MsgCode = 0
      let status: number | undefined
      let data: T | undefined

      const headers: HeadersInit = { Accept: 'application/json' }
      let body: BodyInit | undefined

      if (postData instanceof FormData) {
        body = postData
      } else if (postData) {
        const hasFile = Object.values(postData).some(
          (val) =>
            val instanceof File ||
            val instanceof Blob ||
            (Array.isArray(val) && val.some((item) => item instanceof File || item instanceof Blob))
        )

        if (hasFile) {
          const formData = new FormData()
          Object.entries(postData).forEach(([key, val]) => {
            if (Array.isArray(val)) {
              val.forEach((item) => formData.append(key, item as any))
            } else {
              formData.append(key, val as any)
            }
          })
          body = formData
        } else {
          headers['Content-Type'] = 'application/json'
          body = JSON.stringify(postData)
        }
      }

      try {
        const isAbsolute = location.startsWith('http')
        const urlBase = baseUrl ?? API_BASE
        let finalBody = body

        if (body && typeof body === 'string') {
          finalBody = JSON.stringify({
            ...JSON.parse(body),
            timestamp: Date.now(),
          })
        }

        if (method === 'GET') {
          finalBody = undefined
        }

        const res = await fetch(isAbsolute ? location : urlBase + location, {
          method,
          headers,
          body: finalBody,
          credentials: 'include',
          mode: 'cors',
        })

        status = res.status

        if (responseType === 'blob') {
          data = (await res.blob()) as any
        } else if (res.status === 204) {
          data = undefined
          msg = ''
          msgCode = 1
        } else {
          try {
            const json = await res.json()
            msg = json.msg ?? json.message ?? ''
            data = json.data as T
          } catch {
            msg = 'Server returned invalid JSON'
            msgCode = 4
          }
        }

        const errorDeets: ErrorLog = {
          location,
          dataSubmitted: body,
          errorCode: String(res.status),
          errorDesc: msg,
        }

        switch (true) {
          case res.status >= 200 && res.status < 300:
            msgCode = 1
            break
          case res.status >= 300 && res.status < 400:
            msgCode = 2
            break
          case res.status >= 400 && res.status < 500:
            msgCode = 3
            logError(errorDeets)
            break
          case res.status >= 500:
            msgCode = 4
            logError(errorDeets)
            break
          default:
            msgCode = 4
            errorDeets.errorDesc = 'Unhandled status code'
            logError(errorDeets)
        }
      } catch (err: any) {
        console.error('Fetch failed:', err)
        if (!baseUrl) {
          logError({
            location,
            dataSubmitted: body,
            errorCode: err?.errorCode,
            errorDesc: 'Failed to fetch request',
            errorMsg: err?.message,
            errorStack: err?.stack,
          })
          msg = 'Failed to communicate with server'
          msgCode = 4
        }
      }

      return { msg, msgCode, status, data }
    },
    []
  )

  return fetchApi
}

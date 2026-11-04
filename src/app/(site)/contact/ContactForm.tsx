'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Button, Input, HoneypotField, useToast } from '@components'
import { readVisitOrigin } from '@utils'

import '../styles/contact.scss'

/** Optional: with no site key the widget never renders and the route skips it. */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

interface TurnstileOptions {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

interface TurnstileApi {
  render: (el: HTMLElement, opts: TurnstileOptions) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

/**
 * Contact form.
 *
 * Client-side validation is a courtesy, not a control — the route handler
 * re-validates everything. Two anti-spam measures run quietly alongside: the
 * kit's HoneypotField (a hidden input with a randomised name that only a bot
 * fills), and a render timestamp, because a form submitted within a couple of
 * seconds of loading was not typed by a person.
 */

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm() {
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Tokens are single-use and expire after five minutes, so the widget is reset
  // whenever the server actually spends one.
  const [scriptReady, setScriptReady] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const widgetHost = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  /**
   * Required styling is held back until a submit has been attempted — an empty
   * form should not open shouting red at someone who has not typed anything
   * yet. Matches the portal's convention (see RegisterForm / MyPassword):
   * `required={attempted && !value.trim()}`, and `attempted` clears again as
   * soon as the user starts fixing things.
   */
  const [attempted, setAttempted] = useState(false)

  const clearAttempted = () => {
    if (attempted) setAttempted(false)
  }

  // Stamped on mount, not during render — Date.now() in a render pass is an
  // impure call and the compiler rejects it. Sent with the payload for the
  // timing check; a 0 here would simply read as "loaded long ago" and pass.
  const startedAt = useRef(0)
  const honeypot = useRef<Record<string, string | null>>({})

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const registerHoneypot = (fieldName: string, value: string | null) => {
    honeypot.current[fieldName] = value
  }

  /**
   * Both render paths share this so they cannot drift. useCallback so it is a
   * stable dependency of the render effect below.
   *
   * Theme is read once — Turnstile cannot restyle in place, and tearing the
   * challenge down on a theme flip would make the visitor start again.
   */
  const widgetOptions = useCallback(
    (): TurnstileOptions => ({
      sitekey: TURNSTILE_SITE_KEY as string,
      theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
      size: 'flexible',
      callback: (value) => setToken(value),
      'expired-callback': () => setToken(null),
      'error-callback': () => setToken(null),
    }),
    []
  )

  /**
   * Explicit render, not the implicit `.cf-turnstile` path — that orphans a
   * widget every time the form remounts ("Send another").
   */
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !scriptReady || sent) return
    const host = widgetHost.current
    const api = window.turnstile
    if (!host || !api) return

    const id = api.render(host, widgetOptions())
    widgetId.current = id

    return () => {
      api.remove(id)
      widgetId.current = null
    }
  }, [scriptReady, sent, widgetOptions])

  /** Burn the current token and ask for a fresh one. */
  const resetTurnstile = () => {
    setToken(null)
    const api = window.turnstile
    const host = widgetHost.current
    if (!api || !host || !TURNSTILE_SITE_KEY) return
    if (widgetId.current) api.remove(widgetId.current)
    widgetId.current = api.render(host, widgetOptions())
  }

  const validate = (): boolean => {
    const next: FieldErrors = {}
    if (name.trim().length < 2) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = 'That email address looks wrong.'
    if (message.trim().length < 10) next.message = 'A little more detail would help.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setAttempted(true)
    if (!validate()) return

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          honeypot: honeypot.current,
          startedAt: startedAt.current,
          turnstileToken: token,
          // Read at submit rather than at mount: it is the same value either
          // way, and this keeps the storage access off the render path.
          origin: readVisitOrigin(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        setSent(true)
        showToast('Message sent. We will come back to you shortly.', 'success', 5000)
        setName('')
        setEmail('')
        setCompany('')
        setMessage('')
        setErrors({})
        setAttempted(false)
        return
      }

      if (res.status === 422 && data.errors) {
        // Verified after validation, so the token is unspent — leave it alone.
        setErrors(data.errors as FieldErrors)
        showToast('Have another look at the highlighted fields.', 'warning')
        return
      }

      if (res.status === 403) {
        resetTurnstile()
        showToast('That check did not pass. Give it another go.', 'warning')
        return
      }

      showToast(data.error ?? 'Something went wrong. Please email us directly.', 'error', 6000)
    } catch {
      showToast('Could not reach the server. Please email us directly.', 'error', 6000)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="contact__sent" role="status">
        <h2 className="contact__sent-heading">Thanks — that has landed.</h2>
        <p className="contact__sent-body">
          We read everything ourselves, so it may take a day or so, but it will be a person
          replying.
        </p>
        <Button label="Send another" variant="secondary" handleClick={() => setSent(false)} />
      </div>
    )
  }

  return (
    <form className="contact__form" onSubmit={handleSubmit} noValidate>
      <HoneypotField onRegisterField={registerHoneypot} />

      <Input
        name="name"
        label="Your name"
        hideLabel={false}
        reservesError
        required={attempted && !name.trim()}
        fullWidth
        value={name}
        error={errors.name}
        autoComplete="name"
        onChange={(e) => {
          clearAttempted()
          setName(e.target.value)
        }}
      />

      <Input
        name="email"
        type="email"
        label="Email"
        hideLabel={false}
        reservesError
        required={attempted && !email.trim()}
        fullWidth
        value={email}
        error={errors.email}
        autoComplete="email"
        onChange={(e) => {
          clearAttempted()
          setEmail(e.target.value)
        }}
      />

      <Input
        name="company"
        label="Company (optional)"
        hideLabel={false}
        reservesError
        fullWidth
        value={company}
        autoValidate={false}
        autoComplete="organization"
        onChange={(e) => setCompany(e.target.value)}
      />

      <Input
        name="message"
        label="What are you building?"
        hideLabel={false}
        reservesError
        required={attempted && !message.trim()}
        fullWidth
        maxLength={2000}
        value={message}
        error={errors.message}
        onChange={(e) => {
          clearAttempted()
          setMessage(e.target.value)
        }}
      />

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
          />
          <div className="contact__turnstile" ref={widgetHost} />
        </>
      )}

      <div className="contact__actions">
        {/*
          handleClick is an explicit no-op: the kit's Button defaults it to
          `(e) => e.preventDefault()`, which would silently stop the form from
          submitting. Submission is driven by the form's onSubmit so that Enter
          in a text field works as well as clicking.
        */}
        <Button
          label={sending ? 'Sending...' : 'Send message'}
          type="submit"
          disabled={sending}
          handleClick={() => {}}
        />
      </div>
    </form>
  )
}

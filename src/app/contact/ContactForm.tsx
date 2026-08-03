'use client'

import { useRef, useState } from 'react'
import { Button, Input, HoneypotField, useToast } from '@components'

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

  // Set once on first render, sent with the payload for the timing check.
  const startedAt = useRef<number>(Date.now())
  const honeypot = useRef<Record<string, string | null>>({})

  const registerHoneypot = (fieldName: string, value: string | null) => {
    honeypot.current[fieldName] = value
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
        setErrors(data.errors as FieldErrors)
        showToast('Have another look at the highlighted fields.', 'warning')
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
          replying rather than a workflow.
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

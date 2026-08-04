import { NextRequest, NextResponse } from 'next/server'

/**
 * Contact form endpoint.
 *
 * Sends through Resend's REST API directly rather than the SDK — one fetch, no
 * dependency, nothing extra to keep patched. Deliberately does NOT talk to the
 * Aptium Express API: this site has no business depending on a separate
 * deployment in order to send an email.
 *
 * Required environment (see .env.example):
 *   RESEND_API_KEY     - from resend.com
 *   CONTACT_TO_EMAIL   - where enquiries land (simon@ while testing)
 *   CONTACT_FROM_EMAIL - must sit on a domain verified in Resend
 *
 * Optional:
 *   TURNSTILE_SECRET_KEY - Cloudflare Turnstile. Absent = the check is skipped.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Minimum time a human plausibly takes to fill this in. Faster is a bot. */
const MIN_FILL_MS = 2500

const LIMIT_MAX = 5
const LIMIT_WINDOW_MS = 15 * 60 * 1000

/**
 * In-memory rate limit. Per-instance and cleared on restart, which is fine for a
 * marketing contact form — it stops casual abuse without needing Redis. If this
 * is ever scaled beyond one instance the limit becomes per-instance.
 */
const hits = new Map<string, number[]>()

const rateLimited = (ip: string): boolean => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < LIMIT_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < LIMIT_WINDOW_MS)) hits.delete(key)
    }
  }

  return recent.length > LIMIT_MAX
}

const clientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/** Strip control characters and clamp length. Never trust client-side validation. */
const clean = (value: unknown, max: number): string =>
  typeof value === 'string'
    ? value
        .normalize('NFC')
        .replace(/[\u0000-\u001F\u007F]/g, '')
        .trim()
        .slice(0, max)
    : ''

/**
 * Header-injection guard. A newline in a value that ends up in a mail header
 * (reply-to, subject) would let an attacker append headers of their own.
 */
const hasNewline = (value: string): boolean => /[\r\n]/.test(value)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Turnstile verification. Skipped entirely without TURNSTILE_SECRET_KEY.
 *
 * Asymmetric on purpose: a REJECTED token is a hard no, an UNVERIFIABLE one
 * (Cloudflare unreachable) fails open — losing a real enquiry during someone
 * else's outage is worse here than letting one spam through.
 */
const verifyTurnstile = async (token: unknown, ip: string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  if (typeof token !== 'string' || token.length === 0) {
    console.warn('[contact] turnstile is configured but no token was sent')
    return false
  }

  try {
    const res = await fetch(TURNSTILE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        ...(ip === 'unknown' ? {} : { remoteip: ip }),
      }),
    })

    if (!res.ok) {
      console.error('[contact] turnstile siteverify returned', res.status, '- failing open')
      return true
    }

    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (data.success !== true) {
      console.warn('[contact] turnstile rejected the token', data['error-codes'])
      return false
    }
    return true
  } catch (err) {
    console.error('[contact] could not reach turnstile - failing open', err)
    return true
  }
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function POST(req: NextRequest) {
  const ip = clientIp(req)

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages. Try again in a little while.' },
      { status: 429 }
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 })
  }

  // --- bot checks ----------------------------------------------------------
  // Both fail silently with a 200. Telling a bot why it was rejected only helps
  // it try again more convincingly.
  const honeypot = payload.honeypot
  if (honeypot && typeof honeypot === 'object') {
    const filled = Object.values(honeypot as Record<string, unknown>).some(
      (v) => typeof v === 'string' && v.trim() !== ''
    )
    if (filled) return NextResponse.json({ ok: true })
  }

  const startedAt = Number(payload.startedAt)
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true })
  }

  // --- validation ----------------------------------------------------------
  const name = clean(payload.name, 100)
  const email = clean(payload.email, 200)
  const company = clean(payload.company, 120)
  const message = clean(payload.message, 5000)

  const errors: Record<string, string> = {}
  if (name.length < 2 || hasNewline(name)) errors.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(email) || hasNewline(email)) errors.email = 'That email address looks wrong.'
  if (message.length < 10) errors.message = 'A little more detail would help.'

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  // --- challenge -----------------------------------------------------------
  // After validation on purpose: tokens are single-use, so a 422 must not spend
  // one and make the visitor re-solve to fix a typo.
  if (!(await verifyTurnstile(payload.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: 'That check did not pass. Please try again.' },
      { status: 403 }
    )
  }

  // --- config --------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.error('[contact] missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL')
    return NextResponse.json(
      { ok: false, error: 'The form is not configured yet. Please email us directly.' },
      { status: 503 }
    )
  }

  // --- attribution ---------------------------------------------------------
  const origin = (payload.origin ?? {}) as Record<string, unknown>
  const referrer = clean(origin.referrer, 120) || 'unknown'
  const landing = clean(origin.landing, 200) || 'unknown'

  // --- send ----------------------------------------------------------------
  const subject = `Website enquiry - ${name}${company ? ` (${company})` : ''}`
  const text = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    company ? `Company: ${company}` : null,
    '',
    message,
    '',
    `Came from: ${referrer}`,
    `Landed on: ${landing}`,
    `- sent from vsource.dev at ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
      <tr><td style="padding:2px 12px 2px 0"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0"><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      ${company ? `<tr><td style="padding:2px 12px 2px 0"><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>` : ''}
    </table>
    <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
    <div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>
    <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
    <table style="font-family:system-ui,sans-serif;font-size:12px;color:#666;line-height:1.5">
      <tr><td style="padding:1px 12px 1px 0">Came from</td><td>${escapeHtml(referrer)}</td></tr>
      <tr><td style="padding:1px 12px 1px 0">Landed on</td><td>${escapeHtml(landing)}</td></tr>
    </table>
  `

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // So a reply goes straight back to the enquirer, not to noreply@.
        reply_to: email,
        subject,
        text,
        html,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('[contact] resend rejected the send', res.status, detail)
      return NextResponse.json(
        { ok: false, error: 'We could not send that just now. Please email us directly.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed', err)
    return NextResponse.json(
      { ok: false, error: 'We could not send that just now. Please email us directly.' },
      { status: 502 }
    )
  }
}

'use client'
import React, { useEffect, useId } from 'react'

interface HoneypotFieldProps {
  onRegisterField: (fieldName: string, value: string | null) => void
}

/**
 * The field name used to be `Math.random()`, which produced one value on the
 * server and a different one on the client — a hydration mismatch on every
 * page carrying the form. useId is unique per instance AND identical on both
 * sides, which is the property that actually matters here.
 *
 * The cost is that the name is stable rather than unpredictable. That only
 * weakens the trap against a bot written specifically for this site; the
 * generic form-fillers this is aimed at fill every field they find. For real
 * per-request randomness, generate the name in a server component and pass it
 * down as a prop.
 *
 * ── AUTOFILL ───────────────────────────────────────────────────────────────
 * `autocomplete="off"` is advisory. Browsers treat it as a hint and password
 * managers ignore it outright — 1Password, LastPass, Bitwarden and Dashlane
 * all walk the form and fill every text input they can see, offscreen or not.
 * That is how a hidden trap ends up full of a real person's details.
 *
 * So there are three defences here, and the attributes are the one that works:
 *
 *   1. The per-vendor opt-out attributes below. These are the actual fix.
 *   2. `aria-hidden` on the wrapper, so the field is outside the accessibility
 *      tree. It was announced to screen readers before this — "Do not fill
 *      this field, edit text" — which both leaks the trap and invites exactly
 *      the mistake that silently binned the message.
 *   3. A visually-hidden clip rather than `left: -9999px`. Same invisibility
 *      without parking content a viewport away, which can drag horizontal
 *      overflow around with it.
 *
 * `tabIndex={-1}` is load-bearing alongside `aria-hidden`: aria-hidden must not
 * contain anything TABBABLE, or it is an a11y violation in its own right
 * (axe: aria-hidden-focus). -1 keeps it reachable programmatically and out of
 * the tab order, which is what that rule asks for.
 *
 * None of this is airtight, and it does not need to be. The server no longer
 * rejects on this signal — see the bot-signals block in
 * app/api/contact/route.ts. A fooled honeypot now flags an email instead of
 * destroying it.
 */
const HoneypotField: React.FC<HoneypotFieldProps> = ({ onRegisterField }) => {
  const fieldName = `extraData_${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  useEffect(() => {
    onRegisterField(fieldName, null)
  }, [fieldName, onRegisterField])

  if (!fieldName) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        margin: -1,
        padding: 0,
        border: 0,
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      }}
    >
      <label htmlFor={fieldName}>Do not fill this field</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        autoComplete="off"
        tabIndex={-1}
        // The per-vendor opt-outs. Unknown attributes are inert, so a manager
        // that does not recognise its own key simply ignores it.
        data-1p-ignore=""
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
        onChange={(e) => {
          onRegisterField(fieldName, e.target.value)
        }}
      />
    </div>
  )
}

export default HoneypotField

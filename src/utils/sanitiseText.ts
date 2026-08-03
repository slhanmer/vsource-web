/**
 * Plain-text sanitisation for free-text fields.
 *
 * WHAT THIS DOES: normalises Unicode, removes characters that make what is
 * *stored* differ from what is *displayed*, unifies line endings, trims, and
 * caps length.
 *
 * WHAT THIS DOES NOT DO: it never touches `<`, `>`, `&`, quotes or apostrophes.
 * Those are ordinary text in a clinical note. HTML safety is an output-encoding
 * concern — React escapes text nodes on render — not a reason to mangle the
 * stored value. Sanitising markup on input corrupts legitimate content
 * (`O'Brien`, `SpO2 < 92%`) and still leaves every other sink unprotected.
 *
 * WHERE THE CONTROL LIVES: the API must apply the same rules before anything
 * reaches the DB. This copy is a UX measure so the character counter and the
 * submitted value agree with what actually gets stored. A caller using `curl`
 * bypasses it entirely.
 *
 * No imports — this is a leaf module, safe to pull into the utils barrel
 * without any module-scope initialisation ordering risk.
 */

/**
 * Line terminators that are not `\n`.
 *
 * U+2028 (line separator) and U+2029 (paragraph separator) are line terminators
 * in JS but sit outside the C0/C1 control ranges, so they survive the control
 * strip below and would render as breaks in a single-line field. Unified here
 * rather than stripped, because they carry the user's intent.
 */
const NEWLINE_VARIANTS = /\r\n|\r|\u2028|\u2029/g

/**
 * C0 and C1 control characters, preserving tab (U+0009) and line feed (U+000A).
 *
 * Carriage return is absent from this set deliberately — it has already been
 * folded into `\n` by the time this runs.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g

/**
 * Bidirectional embeddings, overrides and isolates.
 *
 * These reorder whole runs of text, so what is stored and what is rendered can
 * differ arbitrarily — the "Trojan Source" class (CVE-2021-42574). In a clinical
 * note that is a data-integrity defect with a patient-safety edge, not a display
 * quirk: a stored dosage can be made to render as a different one.
 *
 * Deliberately EXCLUDES the bidi *marks* U+200E (LRM), U+200F (RLM) and U+061C
 * (ALM). Those only influence how adjacent neutral characters — punctuation,
 * brackets — resolve direction. They cannot reorder words and cannot reorder
 * digits within a number, so they can't produce the attack, and they carry real
 * meaning in mixed-script text such as an Arabic or Hebrew name beside Latin.
 * Stripping them would degrade legitimate non-English content for no security gain.
 */
const BIDI_OVERRIDES = /[\u202A-\u202E\u2066-\u2069]/g

/**
 * Zero-width characters that carry no meaning — used to hide payloads, defeat
 * search and de-duplication, and fingerprint copied text.
 *
 * Deliberately EXCLUDES U+200C (ZWNJ) and U+200D (ZWJ). ZWNJ is semantically
 * load-bearing in Persian and Devanagari, where it distinguishes one word from
 * another; ZWJ joins emoji sequences. Stripping either corrupts real content.
 */
const ZERO_WIDTH = /[\u200B\u2060\uFEFF]/g

export type SanitiseTextOptions = {
  /** Keep line breaks (textareas). When false, runs of newlines become one space. */
  allowNewlines?: boolean
  /** Cap in UTF-16 code units, applied last so it reflects what is actually stored. */
  maxLength?: number
}

/**
 * Normalise and strip a plain-text value.
 *
 * Order is load-bearing:
 *  1. NFC first — composition changes length, so any earlier cap would be wrong.
 *  2. Newlines unified before the control strip, so CR is folded rather than deleted.
 *  3. Strips.
 *  4. Newline collapse for single-line fields.
 *  5. Trim.
 *  6. Cap last, so the number reflects the final stored string.
 *
 * NOT for passwords — NFC changes the bytes hashed at registration and would
 * break existing logins. Callers must exempt them.
 *
 * @example
 * sanitiseText('Dose \u202E10mg')                 // 'Dose 10mg'
 * sanitiseText('  note\r\nline  ')                // 'note\nline'
 * sanitiseText('a\nb', { allowNewlines: false })  // 'a b'
 */
export function sanitiseText(input: string, options: SanitiseTextOptions = {}): string {
  const { allowNewlines = true, maxLength } = options

  if (typeof input !== 'string') return ''

  // NFC keeps visually identical strings byte-identical, so comparison,
  // de-duplication and length counting all behave predictably. Matters most for
  // pasted text — macOS and Vietnamese sources commonly produce decomposed forms,
  // where 'Nguyễn' is longer by `.length` than the same name typed directly.
  let out = input.normalize('NFC')

  out = out.replace(NEWLINE_VARIANTS, '\n')
  out = out.replace(CONTROL_CHARS, '')
  out = out.replace(BIDI_OVERRIDES, '')
  out = out.replace(ZERO_WIDTH, '')

  if (!allowNewlines) out = out.replace(/\n+/g, ' ')

  out = out.trim()

  if (typeof maxLength === 'number' && maxLength > 0 && out.length > maxLength) {
    out = out.slice(0, maxLength)

    // A cut between a surrogate pair leaves a lone high surrogate, which is not
    // valid UTF-8 — MySQL will reject or mangle the insert. Drop the orphan.
    const last = out.charCodeAt(out.length - 1)
    if (last >= 0xd800 && last <= 0xdbff) out = out.slice(0, -1)

    // The cut may have landed on whitespace.
    out = out.trimEnd()
  }

  return out
}

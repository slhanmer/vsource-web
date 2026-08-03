/**
 * Applies a Caesar cipher shift over a custom alphabet.
 * Characters not present in the alphabet are passed through unchanged.
 * The default alphabet is printable ASCII (space through `~`, 95 characters).
 *
 * @param input - The string to encode or decode
 * @param shift - Number of positions to shift (positive = forward, negative = reverse)
 * @param alphabet - Optional custom character set; defaults to printable ASCII
 * @returns The shifted string
 */
export function caesarCustom(input: string, shift: number, alphabet?: string) {
  // Default alphabet = printable ASCII (from 32 = space to 126 = ~)
  const chars = alphabet || [...Array(95)].map((_, i) => String.fromCharCode(32 + i)).join('')
  const len = chars.length

  return input
    .split('')
    .map((ch) => {
      const idx = chars.indexOf(ch)
      if (idx === -1) return ch // not in alphabet → leave it unchanged
      const newIdx = (idx + shift + len) % len
      return chars[newIdx]
    })
    .join('')
}

/**
 * Decodes a string encoded with `forwardCaesarDayShift` using today's UTC day-of-month as the shift.
 * The shift changes daily, so encoded values are only valid on the day they were produced.
 *
 * @param input - The encoded string to decode
 * @param alphabet - Optional custom character set (must match the one used when encoding)
 * @returns The decoded string
 */
export function reverseCaesarDayShift(input: string, alphabet?: string) {
  const shift = new Date().getUTCDate()
  return caesarCustom(input, -shift, alphabet)
}

/**
 * Encodes a string using today's UTC day-of-month as the Caesar shift.
 * Pair with `reverseCaesarDayShift` to decode on the same day.
 *
 * @param input - The plaintext string to encode
 * @param alphabet - Optional custom character set
 * @returns The encoded string
 */
export function forwardCaesarDayShift(input: string, alphabet?: string) {
  const shift = new Date().getUTCDate()
  return caesarCustom(input, shift, alphabet)
}

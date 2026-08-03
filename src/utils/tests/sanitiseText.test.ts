import { sanitiseText } from '../sanitiseText'

/**
 * Character-level behaviour table.
 *
 * This is the security claim in one place: what gets removed, what is kept, and
 * why. The API applies the same rules before anything reaches the DB, so this
 * table is the specification both implementations are written against.
 *
 * Exported so the API suite can assert the identical cases. NOTE: copying the
 * file to the other repo makes the cases portable but does NOT enforce sync — a
 * case added here will not fail the API build. Enforcing that needs either a
 * shared internal package (which carries SOUP register overhead) or a CI step
 * that diffs the two copies. Until one of those exists, treat any change to this
 * table as a two-repo change.
 */
export const CHARACTER_CASES: Array<{
  name: string
  char: string
  stripped: boolean
  why: string
}> = [
  // --- removed ---
  { name: 'NUL', char: '\u0000', stripped: true, why: 'C0 control' },
  { name: 'BEL', char: '\u0007', stripped: true, why: 'C0 control' },
  { name: 'VT', char: '\u000B', stripped: true, why: 'C0 control' },
  { name: 'ESC', char: '\u001B', stripped: true, why: 'C0 control' },
  { name: 'DEL', char: '\u007F', stripped: true, why: 'C1 control' },
  { name: 'NEL', char: '\u0085', stripped: true, why: 'C1 control' },
  { name: 'APC', char: '\u009F', stripped: true, why: 'C1 control' },
  { name: 'LRE', char: '\u202A', stripped: true, why: 'bidi embedding — reorders runs' },
  { name: 'RLE', char: '\u202B', stripped: true, why: 'bidi embedding — reorders runs' },
  { name: 'PDF', char: '\u202C', stripped: true, why: 'bidi pop — pairs with embeddings' },
  { name: 'LRO', char: '\u202D', stripped: true, why: 'bidi override — Trojan Source' },
  { name: 'RLO', char: '\u202E', stripped: true, why: 'bidi override — Trojan Source' },
  { name: 'LRI', char: '\u2066', stripped: true, why: 'bidi isolate — reorders runs' },
  { name: 'RLI', char: '\u2067', stripped: true, why: 'bidi isolate — reorders runs' },
  { name: 'FSI', char: '\u2068', stripped: true, why: 'bidi isolate — reorders runs' },
  { name: 'PDI', char: '\u2069', stripped: true, why: 'bidi isolate pop' },
  { name: 'ZWSP', char: '\u200B', stripped: true, why: 'zero-width, no semantic role' },
  { name: 'WORD JOINER', char: '\u2060', stripped: true, why: 'zero-width, no semantic role' },
  { name: 'BOM', char: '\uFEFF', stripped: true, why: 'zero-width, no semantic role' },

  // --- kept ---
  { name: 'TAB', char: '\u0009', stripped: false, why: 'legitimate whitespace' },
  { name: 'LRM', char: '\u200E', stripped: false, why: 'bidi mark — cannot reorder words' },
  { name: 'RLM', char: '\u200F', stripped: false, why: 'bidi mark — cannot reorder words' },
  { name: 'ALM', char: '\u061C', stripped: false, why: 'bidi mark — cannot reorder words' },
  {
    name: 'ZWNJ',
    char: '\u200C',
    stripped: false,
    why: 'word-distinguishing in Persian/Devanagari',
  },
  { name: 'ZWJ', char: '\u200D', stripped: false, why: 'joins emoji sequences' },
  {
    name: 'less-than',
    char: '<',
    stripped: false,
    why: 'ordinary text — escaping is a render concern',
  },
  {
    name: 'ampersand',
    char: '&',
    stripped: false,
    why: 'ordinary text — escaping is a render concern',
  },
  { name: 'apostrophe', char: "'", stripped: false, why: "ordinary text — O'Brien" },
]

describe('sanitiseText', () => {
  describe('character table', () => {
    it.each(CHARACTER_CASES)('$name is $stripped ? removed : kept — $why', ({ char, stripped }) => {
      // Padded so trimming cannot account for the result either way.
      const result = sanitiseText(`a${char}b`)
      expect(result).toBe(stripped ? 'ab' : `a${char}b`)
    })
  })

  describe('markup is not touched', () => {
    it('leaves an HTML payload intact', () => {
      // Escaping is an output concern. Mangling it here would corrupt clinical
      // text such as "SpO2 < 92%" and still leave every non-HTML sink exposed.
      const input = '<script>alert(1)</script> & O\'Brien said "hi"'
      expect(sanitiseText(input)).toBe(input)
    })
  })

  describe('Unicode normalisation', () => {
    it('composes a decomposed sequence to NFC', () => {
      expect(sanitiseText('cafe\u0301')).toBe('caf\u00E9')
    })

    it('shortens the string when composing', () => {
      expect(sanitiseText('cafe\u0301')).toHaveLength(4)
    })

    it('leaves an already-composed string unchanged', () => {
      expect(sanitiseText('caf\u00E9')).toBe('caf\u00E9')
    })

    it('composes stacked Vietnamese diacritics', () => {
      expect(sanitiseText('Nguye\u0302\u0303n')).toBe('Nguy\u1EC5n')
    })
  })

  describe('line endings', () => {
    it('folds CRLF to a single newline', () => {
      expect(sanitiseText('a\r\nb')).toBe('a\nb')
    })

    it('folds a lone CR to a newline', () => {
      expect(sanitiseText('a\rb')).toBe('a\nb')
    })

    it('folds U+2028 line separator to a newline', () => {
      expect(sanitiseText('a\u2028b')).toBe('a\nb')
    })

    it('folds U+2029 paragraph separator to a newline', () => {
      expect(sanitiseText('a\u2029b')).toBe('a\nb')
    })

    it('keeps newlines when allowNewlines is true', () => {
      expect(sanitiseText('a\nb', { allowNewlines: true })).toBe('a\nb')
    })

    it('collapses newlines to a space when allowNewlines is false', () => {
      expect(sanitiseText('a\nb', { allowNewlines: false })).toBe('a b')
    })

    it('collapses a run of newlines to one space', () => {
      expect(sanitiseText('a\n\n\nb', { allowNewlines: false })).toBe('a b')
    })

    it('collapses folded CRLF too', () => {
      expect(sanitiseText('a\r\nb', { allowNewlines: false })).toBe('a b')
    })
  })

  describe('trimming', () => {
    it('removes leading and trailing whitespace', () => {
      expect(sanitiseText('   spaced   ')).toBe('spaced')
    })

    it('returns empty for a whitespace-only value', () => {
      expect(sanitiseText('  \n\t  ')).toBe('')
    })

    it('preserves internal whitespace', () => {
      expect(sanitiseText('a  b')).toBe('a  b')
    })

    // Order: strips run BEFORE trim. U+200B is not whitespace to String.trim(),
    // so trimming first would leave the two spaces stranded behind it.
    it('trims whitespace exposed by a strip', () => {
      expect(sanitiseText('\u200B  hello')).toBe('hello')
    })
  })

  describe('length cap', () => {
    it('truncates an over-length value', () => {
      expect(sanitiseText('a'.repeat(320), { maxLength: 300 })).toHaveLength(300)
    })

    it('leaves a value at exactly the cap alone', () => {
      expect(sanitiseText('a'.repeat(300), { maxLength: 300 })).toHaveLength(300)
    })

    it('leaves a shorter value alone', () => {
      expect(sanitiseText('short', { maxLength: 300 })).toBe('short')
    })

    it('does not cap when maxLength is omitted', () => {
      expect(sanitiseText('a'.repeat(10000))).toHaveLength(10000)
    })

    it('does not cap when maxLength is zero', () => {
      expect(sanitiseText('a'.repeat(50), { maxLength: 0 })).toHaveLength(50)
    })

    // Order: trim runs BEFORE the cap, so padding does not consume the budget.
    it('trims before measuring against the cap', () => {
      expect(sanitiseText(`  ${'a'.repeat(300)}  `, { maxLength: 300 })).toHaveLength(300)
    })

    it('trims whitespace left behind by the cut', () => {
      expect(sanitiseText(`${'a'.repeat(299)} bbb`, { maxLength: 300 })).toHaveLength(299)
    })

    // A cut between a surrogate pair leaves a lone high surrogate — invalid
    // UTF-8, which MySQL rejects or mangles. The orphan is dropped instead.
    it('does not split a surrogate pair', () => {
      expect(sanitiseText('ab\u{1F600}', { maxLength: 3 })).toBe('ab')
    })

    it('keeps a surrogate pair that fits', () => {
      expect(sanitiseText('ab\u{1F600}', { maxLength: 4 })).toBe('ab\u{1F600}')
    })

    // Order: NFC runs BEFORE the cap. Composed, this is 4 code units and fits.
    it('normalises before measuring against the cap', () => {
      expect(sanitiseText('cafe\u0301', { maxLength: 4 })).toBe('caf\u00E9')
    })
  })

  describe('input guards', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['a number', 123],
      ['an object', {}],
    ])('returns empty string for %s', (_label, input) => {
      expect(sanitiseText(input as any)).toBe('')
    })

    it('returns empty string for an empty string', () => {
      expect(sanitiseText('')).toBe('')
    })
  })

  // The FE runs this at blur and the API runs it again before insert, so a
  // second pass must be a no-op. If it is not, a stored value can differ from
  // the one the user was shown.
  describe('idempotence', () => {
    it.each([
      'Dose \u202E10mg',
      '  he\u200Bllo\r\nworld  ',
      'cafe\u0301',
      'ab\u{1F600}cd',
      '\u200Fشלום\u200E ok',
    ])('a second pass changes nothing: %j', (input) => {
      const once = sanitiseText(input)
      expect(sanitiseText(once)).toBe(once)
    })

    it('is idempotent under a cap', () => {
      const once = sanitiseText('a'.repeat(500), { maxLength: 300 })
      expect(sanitiseText(once, { maxLength: 300 })).toBe(once)
    })

    it('is idempotent with newlines collapsed', () => {
      const once = sanitiseText('a\n\nb', { allowNewlines: false })
      expect(sanitiseText(once, { allowNewlines: false })).toBe(once)
    })
  })

  describe('realistic notes', () => {
    it('leaves an ordinary clinical note untouched', () => {
      const note =
        "Patient reports pain in R hallux.\nAdvised NSAIDs; review in 2/52.\nSpO2 < 92% on arrival — O'Brien notified."
      expect(sanitiseText(note, { maxLength: 5000 })).toBe(note)
    })

    it('neutralises a reordering payload without altering the text', () => {
      expect(sanitiseText('Administer \u202E5\u202C mg')).toBe('Administer 5 mg')
    })
  })
})

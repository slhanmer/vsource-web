import {
  BUDGET_MS,
  DELETE_MS,
  HOLD_MS,
  SEQUENCE,
  TYPE_MS,
  WORDS,
  timelineMs,
} from '../headlineTimeline'

/**
 * The headline has no pause control because it stops inside five seconds
 * (WCAG 2.2.2). These tests fail if a new word or a longer hold changes that.
 */
describe('rotating headline timeline', () => {
  it('finishes typing within the 4,500 ms budget', () => {
    // Summed here from the constants, not just trusted from timelineMs().
    let total = 0
    for (let i = 1; i < SEQUENCE.length; i += 1) {
      total += HOLD_MS + SEQUENCE[i - 1].length * DELETE_MS + SEQUENCE[i].length * TYPE_MS
    }
    expect(total).toBe(timelineMs())
    expect(total).toBe(3240)
    expect(total).toBeLessThanOrEqual(BUDGET_MS)
    expect(BUDGET_MS).toBeLessThan(5000)
  })

  it('plays every word once and stops on the first', () => {
    expect(SEQUENCE).toEqual([...WORDS, WORDS[0]])
    expect(SEQUENCE[SEQUENCE.length - 1]).toBe('Software')
  })

  it('holds each word for longer than the longest word takes to type', () => {
    const longest = Math.max(...WORDS.map((word) => word.length))
    expect(HOLD_MS).toBeGreaterThan(longest * TYPE_MS)
  })
})

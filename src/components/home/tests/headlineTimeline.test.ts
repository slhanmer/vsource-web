import {
  BUDGET_MS,
  DELETE_MS,
  HOLD_MS,
  SETTLE_MS,
  TYPE_MS,
  sentenceOf,
  sequenceOf,
  timelineMs,
  typedMs,
} from '../headlineTimeline'

/**
 * The headline has no pause control because it stops inside five seconds
 * (WCAG 2.2.2). These tests fail if a new stream or a longer hold changes that.
 * The words are the visible streams (hide-websites), so the budget is checked
 * for every count the site can show today: three, and two with Websites hidden.
 */
const THREE = ['Software', 'Robotics', 'Websites']
const TWO = ['Software', 'Robotics']

describe('rotating headline timeline', () => {
  it('finishes typing and settles the stage within the 4,500 ms budget, with three streams', () => {
    // Summed here from the constants, not just trusted from timelineMs().
    let typed = 0
    const sequence = sequenceOf(THREE)
    for (let i = 1; i < sequence.length; i += 1) {
      typed += HOLD_MS + sequence[i - 1].length * DELETE_MS + sequence[i].length * TYPE_MS
    }
    expect(typed).toBe(typedMs(THREE))
    expect(typed).toBe(3240)
    const total = typed + SETTLE_MS
    expect(total).toBe(timelineMs(THREE))
    expect(total).toBe(3840)
    expect(total).toBeLessThanOrEqual(BUDGET_MS)
    expect(BUDGET_MS).toBeLessThan(5000)
  })

  it('stays within the budget with two streams', () => {
    expect(typedMs(TWO)).toBe(2160)
    expect(timelineMs(TWO)).toBe(2760)
    expect(timelineMs(TWO)).toBeLessThanOrEqual(BUDGET_MS)
  })

  it('a fourth eight-letter stream would go past the budget', () => {
    expect(timelineMs([...THREE, 'Hardware'])).toBeGreaterThan(BUDGET_MS)
  })

  it('plays every word once and stops on the first, which is Software', () => {
    for (const words of [THREE, TWO]) {
      const sequence = sequenceOf(words)
      expect(sequence).toEqual([...words, words[0]])
      expect(sequence[sequence.length - 1]).toBe('Software')
    }
  })

  it('holds each word for longer than the longest word takes to type', () => {
    const longest = Math.max(...THREE.map((word) => word.length))
    expect(HOLD_MS).toBeGreaterThan(longest * TYPE_MS)
  })

  it('reads the whole sentence for the hidden h1 text', () => {
    expect(sentenceOf(THREE)).toBe('Software, robotics and websites, built to fit.')
    expect(sentenceOf(TWO)).toBe('Software and robotics, built to fit.')
  })
})

/**
 * The rotating headline's timing, on its own so the budget can be tested.
 *
 * The headline plays ONCE and stops, which is how it meets WCAG 2.2.2 without a
 * pause control: 2.2.2 only applies to motion that lasts longer than five
 * seconds. The budget is 4,500 ms from mount to the fold standing still (the last
 * character typed, then the stage settling), which leaves headroom for hydration
 * and the font landing.
 *
 * THE WORDS ARE THE VISIBLE STREAMS (hide-websites, 5 November), in their
 * order, passed in from the page: nothing here knows how many there are. The
 * run is the first word (on screen at mount), each of the others, then the
 * first again, where it stops. With Software, Robotics and Websites:
 *
 *   holds    3 × HOLD_MS                         3 × 600 = 1,800
 *   deletes  (8 + 8 + 8) chars × DELETE_MS       24 × 18 =   432
 *   types    (8 + 8 + 8) chars × TYPE_MS         24 × 42 = 1,008
 *                                                         -------
 *   typed                                                 3,240 ms
 *   settle   the stage into its bands        SETTLE_MS       600
 *                                                         -------
 *   still                                                 3,840 ms
 *
 * With Websites hidden it is two holds, 16 + 16 characters: 2,160 typed, 2,760
 * still.
 *
 * There are no recut beats. The slot is cut once, to the widest word, and
 * never changes width, so a new word is typed straight into it.
 *
 * Each hold outlasts the longest word's typing (all are eight letters,
 * 8 × 42 = 336 ms), so a word is read for longer than it takes to appear.
 *
 * The settle (hero-stage) is part of the motion, so it is in the sum: when the
 * last word lands, the fold's stage crossfades from one big photograph into
 * the stream bands, and nothing moves after that.
 *
 * A fourth eight-letter stream would add 1,080 ms and land at 4,920 with the
 * settle: past the budget, and then it needs the pause button back. The test
 * in tests/headlineTimeline.test.ts fails before that happens.
 */

/** The words in the order they are shown: the full set, then back to the
 *  first, where it stops. */
export function sequenceOf(words: readonly string[]): string[] {
  return words.length > 1 ? [...words, words[0]] : [...words]
}

/** Milliseconds per character typed. */
export const TYPE_MS = 42
/** Backspacing is quicker than typing, as it is on a real keyboard. */
export const DELETE_MS = 18
/** How long a finished word stays up before it is erased. */
export const HOLD_MS = 600

/** The ceiling. Under five seconds, with headroom. */
export const BUDGET_MS = 4500

/** The stage's crossfade into its bands, once the run lands back on the
 *  first word (HeroStage.tsx reads it, so the CSS cannot drift from it). */
export const SETTLE_MS = 600

/** Mount to the final character typed, in milliseconds. */
export function typedMs(words: readonly string[]): number {
  const sequence = sequenceOf(words)
  let total = 0
  for (let i = 1; i < sequence.length; i += 1) {
    total += HOLD_MS
    total += sequence[i - 1].length * DELETE_MS
    total += sequence[i].length * TYPE_MS
  }
  return total
}

/** Mount to the moment the fold is still: the last word typed, then the
 *  settle. This is what the budget is for. */
export function timelineMs(words: readonly string[]): number {
  return typedMs(words) + SETTLE_MS
}

/** The headline as one sentence, for the h1's visually-hidden text:
 *  "Software, robotics and websites, built to fit." */
export function sentenceOf(words: readonly string[]): string {
  const lower = words.map((word, i) => (i === 0 ? word : word.toLowerCase()))
  const list =
    lower.length > 1 ? `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}` : lower[0]
  return `${list}, built to fit.`
}

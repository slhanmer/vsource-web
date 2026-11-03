/**
 * The rotating headline's timing, on its own so the budget can be tested.
 *
 * The headline plays ONCE and stops, which is how it meets WCAG 2.2.2 without a
 * pause control: 2.2.2 only applies to motion that lasts longer than five
 * seconds. The budget is 4,500 ms from mount to the last character typed, which
 * leaves headroom for hydration and the font landing.
 *
 * The run is Software (on screen at mount) → Websites → Robotics → Software:
 *
 *   holds    3 × HOLD_MS                         3 × 600 = 1,800
 *   deletes  (8 + 8 + 8) chars × DELETE_MS       24 × 18 =   432
 *   cuts     3 changes × 2 beats × CUT_MS        6 × 120 =   720
 *   types    (8 + 8 + 8) chars × TYPE_MS         24 × 42 = 1,008
 *                                                         -------
 *                                                         3,960 ms
 *
 * Each hold outlasts the longest word's typing (all three are eight letters,
 * 8 × 42 = 336 ms),
 * so a word is read for longer than it takes to appear.
 *
 * There is no room in this for a fourth word, or for a longer hold. Both push it
 * past five seconds, and then it needs the pause button back. The test in
 * tests/headlineTimeline.test.ts fails before that happens.
 */

export const WORDS = ['Software', 'Websites', 'Robotics'] as const

/** The words in the order they are shown: the full set, then back to the first,
 *  where it stops. */
export const SEQUENCE = [...WORDS, WORDS[0]] as const

/** Milliseconds per character typed. */
export const TYPE_MS = 42
/** Backspacing is quicker than typing, as it is on a real keyboard. */
export const DELETE_MS = 18
/** The beat where the slot is being recut and nothing is being written. Runs
 *  twice per change: before the new word is set, and before it is typed. */
export const CUT_MS = 120
/** How long a finished word stays up before it is erased. */
export const HOLD_MS = 600

/** The ceiling. Under five seconds, with headroom. */
export const BUDGET_MS = 4500

/** Mount to the final character typed, in milliseconds. */
export function timelineMs(): number {
  let total = 0
  for (let i = 1; i < SEQUENCE.length; i += 1) {
    total += HOLD_MS
    total += SEQUENCE[i - 1].length * DELETE_MS
    total += 2 * CUT_MS
    total += SEQUENCE[i].length * TYPE_MS
  }
  return total
}

/**
 * What stays of the streams in code.
 *
 * The streams themselves — names, doors, rows, stream pages, photographs — are
 * in Payload now (the `streams` collection; see CLAUDE.md, CMS). Two things
 * are not, on purpose:
 *
 * STREAM_COMMON — DUPLICATE CONTENT, DELIBERATE DESIGN. Hosting and ongoing
 * support are the same offer whichever stream you arrive through, so they are
 * NOT repeated as paragraphs on three pages (three near-identical pages is how
 * a site competes with itself). They are one short shared list, rendered on
 * all three. It stays in code because "hosted on hardware we own, in
 * Australia" is a claim, and a bad edit to a claim is a factual problem rather
 * than bad copy.
 *
 * StreamId — the landing pages (landings.ts, also in code) name the stream they
 * belong under. The stream marks are drawn in code too (StreamMark).
 */
export type StreamId = 'software' | 'robotics' | 'websites'

/**
 * True of all three streams, so it is written once and shown on each.
 *
 * Short by design: a shared *list* on three pages is a fact stated three times,
 * which is fine. Shared *paragraphs* on three pages are three pages competing
 * for the same search result, which is not.
 */
export const STREAM_COMMON = {
  heading: 'Whichever one you arrive through',
  items: [
    'Hosted on hardware we own, in Australia, with no licence fee that grows every year',
    'The people who scope the work are the people who write it — there is no account manager',
    'Maintained and extended after launch, by the person who already knows your system',
    'Documentation written as we build rather than reconstructed afterwards',
  ],
}

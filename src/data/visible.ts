/**
 * Which streams are on the site (hide-websites, 5 November).
 *
 * Pure, and on its own, so it can be tested without Payload: getStreams()
 * runs every stream document through this before anything renders, and every
 * page reads getStreams(). A stream with `hidden` ticked in /admin is dropped
 * here and nowhere else.
 */
export function visibleOnly<T extends { hidden?: boolean | null }>(docs: T[]): T[] {
  return docs.filter((doc) => !doc.hidden)
}

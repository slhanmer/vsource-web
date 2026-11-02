/**
 * The photographs that are not portraits — from the 2 November shoot.
 *
 * Two slots, each of which renders NOTHING while it is unset, so with both
 * `undefined` the site is exactly what it was before this file existed. Setting
 * one is the entire change:
 *
 *   - `group`   — the team together. Full width under the /team page head.
 *   - `working` — people at a PC. In the home page's "why we work this way"
 *                 section, beside the copy on wide screens, above it on narrow.
 *
 * Same rules as the portraits (see crew.ts): the file goes under /public, the
 * source is greyscale, and the duotone and the recessed edge are CSS layers
 * over it. `width` and `height` are the file's real pixel size — they reserve
 * the box before the image loads.
 *
 * `alt` is written from the actual photograph once it exists, by someone who
 * has looked at it. Not before, and not as a guess at what it will show.
 */
export interface Photo {
  src: string
  alt: string
  width: number
  height: number
}

export const PHOTOS: { group?: Photo; working?: Photo } = {
  group: undefined,
  working: undefined,
}

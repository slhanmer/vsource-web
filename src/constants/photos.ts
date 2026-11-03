/**
 * The photographs that are not portraits.
 *
 *   - `streams` — one pair per stream: `door` fills the door on the home page
 *                 fold, `step` sits beside the stream's band further down.
 *                 Required, so a stream with no photograph fails the type
 *                 check rather than rendering a hole.
 *   - `working` — people at work, in the home page's "why we work this way"
 *                 section: beside the copy on wide screens, above it on narrow.
 *   - `group`   — the team together. Full width under the /team page head.
 *                 Renders nothing while unset.
 *
 * ⚠ STOCK UNTIL THE SHOOT. The stream photos and `working` are stand-ins from
 * Unsplash, in `public/photos/stock/`, each with its `credit` so it can be
 * found and swapped. The Unsplash License needs no attribution; the credit is
 * kept for us, not rendered. None of the people in them is on the team, and
 * no `alt` may say they are. `working` is replaced by the shoot's "at the PC"
 * photographs.
 *
 * Same rules as the portraits (see crew.ts): the file goes under /public, in
 * colour, with no tone layer, and the recessed edge is drawn over it in CSS.
 * `width` and `height` are the file's real pixel size — they reserve the box
 * before the image loads.
 *
 * `alt` is written from the actual photograph, by someone who has looked at
 * it. Not before, and not as a guess at what it will show.
 */
import type { Stream } from './streams'

export interface Photo {
  src: string
  alt: string
  width: number
  height: number
  /** Where a stock photograph came from, so it can be found and swapped. */
  credit?: { name: string; url: string }
}

export const PHOTOS: {
  group?: Photo
  working: Photo
  streams: Record<Stream['id'], { door: Photo; step: Photo }>
} = {
  group: undefined,
  working: {
    src: '/photos/stock/working.jpg',
    alt: 'Three people working on laptops at a long wooden table in a timber-lined room, one with his chin on his hand, reading his screen.',
    width: 2000,
    height: 1334,
    credit: { name: 'Annie Spratt', url: 'https://unsplash.com/photos/dWYU3i-mqEo' },
  },
  streams: {
    software: {
      door: {
        src: '/photos/stock/software-door.jpg',
        alt: 'Two women at a wooden table covered in printed sheets, one leaning in to point at a page while the other writes on it.',
        width: 1502,
        height: 2000,
        credit: { name: 'Yegor Makarenko', url: 'https://unsplash.com/photos/z1hePtraqbo' },
      },
      step: {
        src: '/photos/stock/software-step.jpg',
        alt: 'Two women in blue at a desk by a bookshelf, one pointing at a shared laptop while the other writes in an open notebook.',
        width: 1333,
        height: 2000,
        credit: { name: 'Cabri Caldwell', url: 'https://unsplash.com/photos/6jg8KPfEOtU' },
      },
    },
    websites: {
      door: {
        src: '/photos/stock/websites-door.jpg',
        alt: 'A café counter in daylight: a customer in a flannel shirt talks with a staff member in a striped top, under a hand-lettered drinks menu on the wall.',
        width: 2000,
        height: 1333,
        credit: { name: 'Toa Heftiba', url: 'https://unsplash.com/photos/Oyf1-w0lxbE' },
      },
      step: {
        src: '/photos/stock/websites-step.jpg',
        alt: 'A restaurant kitchen pass mid-service: a cook in a blue apron lifts a pan of mussels over the steel bench, with squeeze bottles and plates lined up beside it.',
        width: 2000,
        height: 1331,
        credit: { name: 'Stella He', url: 'https://unsplash.com/photos/hM6MSq__M0Q' },
      },
    },
    robotics: {
      door: {
        src: '/photos/stock/robotics-door.jpg',
        alt: 'An older man’s hands at a worn wooden bench, working a metal plate held down in a jig, with hand tools and a lamp around him.',
        width: 2000,
        height: 1333,
        credit: { name: 'Hasan Mrad', url: 'https://unsplash.com/photos/9Foi-h8zmIU' },
      },
      step: {
        src: '/photos/stock/robotics-step.jpg',
        alt: 'Hands twisting red wires together at a paint-marked workbench, beside wire strippers, a battery and a printed wiring guide.',
        width: 2000,
        height: 1331,
        credit: { name: 'Eric Stoynov', url: 'https://unsplash.com/photos/y25LI38cd9w' },
      },
    },
  },
}

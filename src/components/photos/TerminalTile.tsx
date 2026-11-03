import './styles/terminalTile.scss'

/**
 * The portrait for someone who has none. Tom will never have a photograph, so
 * his tile has to look like a decision rather than an image that failed to
 * load: a small terminal answering `whoami` with his name.
 *
 * It fills whatever portrait box it is put in, so it takes that box's 4:5
 * shape, edge and radius on the home row and on /team alike, and its type is
 * sized from the box's width.
 *
 * The face and colours are the header readout's (LOC / STATUS), from the
 * theme's own tokens. The cursor blinks four times, four seconds in all, then
 * stays solid: a blink that ran past five seconds would fall under WCAG 2.2.2
 * and need a pause control. Under reduced motion it does not blink at all.
 *
 * Decorative and aria-hidden. The name and role are in the text beside it.
 */
export default function TerminalTile({ name }: { name: string }) {
  const login = name.split(' ')[0].toLowerCase()

  return (
    <span className="term-tile" aria-hidden="true">
      <span className="term-tile__screen">
        <span className="term-tile__line term-tile__line--cmd">$ whoami</span>
        <span className="term-tile__line term-tile__line--out">
          {login}
          <span className="term-tile__cursor" />
        </span>
      </span>
    </span>
  )
}

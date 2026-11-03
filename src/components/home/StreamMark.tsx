/**
 * The three stream marks.
 *
 * Line art rather than photography, because there is no honest photograph of
 * "custom software" and a stock one would undo the point of the page. Each mark
 * says something specific about its stream: a system with one custom-cut piece,
 * a stack of viewports, a linkage with a tolerance callout.
 *
 * Colour comes from CSS classes, never from fill/stroke attributes, so the
 * marks follow the theme. The neon cyan is an accent on dark and decoration
 * only on light (see global.scss), so `--brand-highlight` is doing the swap for
 * us — on light it resolves to the teal, which is safe on a pale ground.
 *
 * `aria-hidden` throughout: the heading beside each mark already names the
 * stream, so announcing the drawing would only repeat it.
 */

interface Props {
  id: string
  className?: string
}

/** A system of parts with one piece cut to fit the gap. */
function SoftwareMark() {
  return (
    <svg className="mark" viewBox="0 0 260 180" aria-hidden="true">
      <g className="mark__base" fill="none" strokeWidth="1.6">
        <rect className="mark__d" pathLength={100} x="18" y="24" width="96" height="60" rx="3" />
        <rect className="mark__d" pathLength={100} x="18" y="98" width="96" height="60" rx="3" />
        <rect className="mark__d" pathLength={100} x="150" y="61" width="92" height="60" rx="3" />
        <path className="mark__d" pathLength={100} d="M114 54 L132 54 L132 91 L150 91" />
        <path className="mark__d" pathLength={100} d="M114 128 L132 128 L132 91" />
      </g>
      <g className="mark__hi" fill="none" strokeWidth="2">
        <path
          className="mark__d"
          pathLength={100}
          d="M186 61 L206 61 L206 74 L220 74 L220 92 L206 92 L206 121 L186 121 Z"
        />
      </g>
      <g className="mark__dots" pathLength={100}>
        <circle className="mark__dot" pathLength={100} cx="66" cy="54" r="3" />
        <circle className="mark__dot" pathLength={100} cx="66" cy="128" r="3" />
        <circle className="mark__dot mark__dot--hi" pathLength={100} cx="196" cy="91" r="3.5" />
      </g>
    </svg>
  )
}

/** One page, and the breakpoints behind it. */
function WebsitesMark() {
  return (
    <svg className="mark" viewBox="0 0 260 180" aria-hidden="true">
      <g className="mark__base" fill="none" strokeWidth="1.6">
        <g className="mark__layer3">
          <rect
            className="mark__d"
            pathLength={100}
            x="48"
            y="18"
            width="180"
            height="112"
            rx="3"
          />
        </g>
        <g className="mark__layer2">
          <rect
            className="mark__d"
            pathLength={100}
            x="36"
            y="30"
            width="180"
            height="112"
            rx="3"
          />
        </g>
        <g>
          <rect
            className="mark__d"
            pathLength={100}
            x="24"
            y="42"
            width="180"
            height="112"
            rx="3"
          />
          <line className="mark__d" pathLength={100} x1="24" y1="62" x2="204" y2="62" />
          <circle className="mark__dot" pathLength={100} cx="36" cy="52" r="2.4" />
          <circle className="mark__dot" pathLength={100} cx="45" cy="52" r="2.4" />
        </g>
      </g>
      <g className="mark__hi" fill="none" strokeWidth="2">
        <line className="mark__d" pathLength={100} x1="40" y1="82" x2="124" y2="82" />
        <line
          className="mark__d mark__d--faint"
          pathLength={100}
          x1="40"
          y1="100"
          x2="160"
          y2="100"
          strokeWidth="1.4"
        />
        <line
          className="mark__d mark__d--faint"
          pathLength={100}
          x1="40"
          y1="114"
          x2="140"
          y2="114"
          strokeWidth="1.4"
        />
        <rect className="mark__d" pathLength={100} x="40" y="128" width="52" height="16" rx="2" />
      </g>
    </svg>
  )
}

/** A mechanism, and the tolerance it has to hold. */
function RoboticsMark() {
  return (
    <svg className="mark" viewBox="0 0 260 180" aria-hidden="true">
      <g className="mark__base" fill="none" strokeWidth="1.6">
        <circle className="mark__d" pathLength={100} cx="66" cy="70" r="34" />
        <circle className="mark__d" pathLength={100} cx="66" cy="70" r="7" />
        <circle className="mark__d" pathLength={100} cx="188" cy="96" r="22" />
        <circle className="mark__d" pathLength={100} cx="188" cy="96" r="5" />
        <path
          className="mark__d mark__spoke"
          pathLength={100}
          d="M66 36 L66 22 M100 70 L114 70 M66 104 L66 118 M32 70 L18 70"
        />
        <path className="mark__d" pathLength={100} d="M88 92 L170 112" />
      </g>
      <g className="mark__hi" fill="none" strokeWidth="1.6">
        <path
          className="mark__d"
          pathLength={100}
          d="M18 146 L18 158 M242 146 L242 158 M18 152 L242 152"
        />
        <path
          className="mark__d"
          pathLength={100}
          d="M24 148 L18 152 L24 156 M236 148 L242 152 L236 156"
        />
      </g>
      <text className="mark__t" x="130" y="144" textAnchor="middle">
        ± 0.05
      </text>
    </svg>
  )
}

export default function StreamMark({ id, className = '' }: Props) {
  let mark = null

  if (id === 'software') mark = <SoftwareMark />
  else if (id === 'websites') mark = <WebsitesMark />
  else if (id === 'robotics') mark = <RoboticsMark />
  else return null

  return <div className={`markwrap ${className}`.trim()}>{mark}</div>
}

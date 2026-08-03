/**
 * Props for the Spacer layout utility.
 *
 * @property size - Spacing amount in `rem` units
 * @property horizontal - When `true`, inserts horizontal space (width) instead of vertical (height).
 *   Default: `false` (vertical spacer)
 */
interface SpacerDivProps {
  size: number
  horizontal?: boolean
}

const SpacerDiv: React.FC<SpacerDivProps> = ({ size = 1, horizontal = false }) => {
  return (
    <div
      style={{
        height: horizontal ? '100%' : `${size}rem`,
        width: horizontal ? `${size}rem` : '100%',
        flexShrink: 0,
      }}
      className="spacer-div"
    />
  )
}

export default SpacerDiv

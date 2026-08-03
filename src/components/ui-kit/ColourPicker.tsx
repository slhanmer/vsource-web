'use client'

import { HexColorPicker } from 'react-colorful'
import './styles/colourPicker.scss'

/**
 * Props for the ColourPicker component.
 *
 * @property value - Current hex colour string (e.g. `'#FF5733'`)
 * @property onChange - Called with the new hex string whenever the user adjusts the picker
 */
interface ColorPickerProps {
  value: string
  className?: string
  onChange: (value: string) => void
}

export const ColourPicker: React.FC<ColorPickerProps> = ({ value, className, onChange }) => {
  return (
    <div className={`color-picker ${className}`}>
      <HexColorPicker color={value} onChange={onChange} className="hex-colour-picker" />
    </div>
  )
}

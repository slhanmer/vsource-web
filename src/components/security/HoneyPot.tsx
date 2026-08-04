'use client'
import React, { useEffect, useId } from 'react'

interface HoneypotFieldProps {
  onRegisterField: (fieldName: string, value: string | null) => void
}

/**
 * The field name used to be `Math.random()`, which produced one value on the
 * server and a different one on the client — a hydration mismatch on every
 * page carrying the form. useId is unique per instance AND identical on both
 * sides, which is the property that actually matters here.
 *
 * The cost is that the name is stable rather than unpredictable. That only
 * weakens the trap against a bot written specifically for this site; the
 * generic form-fillers this is aimed at fill every field they find. For real
 * per-request randomness, generate the name in a server component and pass it
 * down as a prop.
 */
const HoneypotField: React.FC<HoneypotFieldProps> = ({ onRegisterField }) => {
  const fieldName = `extraData_${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  useEffect(() => {
    onRegisterField(fieldName, null)
  }, [fieldName, onRegisterField])

  if (!fieldName) return null

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 'auto' }}>
      <label htmlFor={fieldName}>Do not fill this field</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        autoComplete="off"
        tabIndex={-1}
        onChange={(e) => {
          onRegisterField(fieldName, e.target.value)
        }}
      />
    </div>
  )
}

export default HoneypotField

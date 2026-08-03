'use client'
import React, { useEffect, useState } from 'react'

interface HoneypotFieldProps {
  onRegisterField: (fieldName: string, value: string | null) => void
}

const generateRandomName = () => {
  // Randomly generate a field name to prevent hard-coded bots from detecting it
  return `extraData_${Math.random().toString(36).substring(2, 10)}`
}

const HoneypotField: React.FC<HoneypotFieldProps> = ({ onRegisterField }) => {
  const [fieldName] = useState(() => generateRandomName())

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

import React, { useState } from 'react'

/**
 * Props for the EditableText inline edit component.
 *
 * @property value - Current text content
 * @property onChange - Called with the new value when the user saves (Enter or blur).
 *   Not called if the value is unchanged.
 * @property as - HTML element to render when not in edit mode (default: `'p'`)
 * @property placeholder - Grey placeholder text shown when `value` is empty (default: `'Click to edit'`)
 */
type EditableTextProps = {
  as?: 'p' | 'div' | 'h1' | 'h2' | 'h3'
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}

export const EditableText: React.FC<EditableTextProps> = ({
  as: Component = 'p',
  value,
  onChange,
  placeholder = 'Click to edit',
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    setEditing(false)
    if (draft !== value) {
      onChange(draft)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setDraft(value) // reset to original
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') handleCancel()
        }}
      />
    )
  }

  return (
    <Component onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
      {value || <span style={{ color: '#999' }}>{placeholder}</span>}
    </Component>
  )
}

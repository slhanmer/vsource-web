'use client'
import React, { useState } from 'react'
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import './styles/dragDropColumns.scss'

const DraggableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`drag-item ${isDragging ? 'dragging' : ''}`}
    >
      <span>{id}</span>
      <span>⋮⋮</span>
    </div>
  )
}

const DroppableColumn = ({ id, title, items }: { id: string; title: string; items: string[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className={`drag-column ${isOver ? 'is-over' : ''}`} data-column={id}>
      <h4 className="column-title">{title}</h4>
      <div className="roles-list">
        {items.map((item) => (
          <DraggableItem key={item} id={item} />
        ))}
      </div>
    </div>
  )
}

/**
 * Props for the DragDropColumns two-column drag-and-drop component.
 *
 * @property col1title - Heading for the left column
 * @property col2title - Heading for the right column
 * @property col1Content - Initial items in the left column
 * @property col2Content - Initial items in the right column
 * @property onChange - Called with `(col1Items, col2Items)` after each cross-column drop
 */
interface DragDropColumnsProps {
  col1title: string
  col2title: string
  col1Content: string[]
  col2Content: string[]
  onChange?: (col1: string[], col2: string[]) => void
}

export const DragDropColumns: React.FC<DragDropColumnsProps> = ({
  col1title,
  col2title,
  col1Content,
  col2Content,
  onChange,
}) => {
  const [col1, setCol1] = useState(col1Content)
  const [col2, setCol2] = useState(col2Content)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const sourceList = col1.includes(activeId) ? 'left' : col2.includes(activeId) ? 'right' : null
    const targetList =
      over.id === 'left-column' ? 'left' : over.id === 'right-column' ? 'right' : null

    if (!sourceList || !targetList || sourceList === targetList) return

    let newCol1 = col1
    let newCol2 = col2

    if (sourceList === 'right' && targetList === 'left') {
      newCol2 = col2.filter((r) => r !== activeId)
      newCol1 = [...col1, activeId]
      setCol1(newCol1)
      setCol2(newCol2)
    } else if (sourceList === 'left' && targetList === 'right') {
      newCol1 = col1.filter((r) => r !== activeId)
      newCol2 = [...col2, activeId]
      setCol1(newCol1)
      setCol2(newCol2)
    }

    onChange?.(newCol1, newCol2)
  }

  return (
    <div className="drag-columns-container">
      <DndContext onDragEnd={handleDragEnd}>
        <DroppableColumn id="left-column" title={col1title} items={col1} />
        <DroppableColumn id="right-column" title={col2title} items={col2} />
      </DndContext>
    </div>
  )
}

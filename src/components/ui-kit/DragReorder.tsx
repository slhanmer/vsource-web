import React, { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { restrictToParentBounds } from '@utils'
import { CSS } from '@dnd-kit/utilities'
import { DragIndicator } from './DragIndicator'
import { getCssVar } from '@utils'

import './styles/dragReorder.scss'

/**
 * A single draggable item in the DragReorder list.
 *
 * @property id - Unique identifier used by dnd-kit as the sortable key
 * @property content - Display text for the item row
 */
export interface DragItem {
  id: string
  content: string
}

const SortableItem = ({
  item,
  index,
  animateHint,
  activeId,
  readOnly,
  isFirstItem,
  isLastItem,
  editingTarget,
  onItemChange,
}: {
  item: DragItem
  index: number
  animateHint?: boolean
  activeId: string | null
  readOnly: boolean
  isFirstItem?: boolean
  isLastItem?: boolean
  editingTarget?: string | null
  onItemChange?: (id: string, content: string) => void
}) => {
  const isEditing = editingTarget === item.id
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: readOnly,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderColor: isDragging ? getCssVar('--highlight') : '#d0d0d0',
    color: isDragging ? getCssVar('--highlight') : '#000',
    boxShadow: isDragging
      ? '0 0 2px rgba(149, 92, 206, 0.15), 0 0 6px rgba(149, 92, 206, 0.15)'
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
    touchAction: 'none',
    opacity: activeId === item.id ? 0 : 1,
  }

  const className = `reorder-item${
    animateHint && index === 0
      ? ' drag-hint-down'
      : animateHint && index === 1
        ? ' drag-hint-up'
        : ''
  }`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...(!isEditing ? listeners : {})}
    >
      <div className="item-container" data-focus-key={`seq_${item.id}`}>
        {isEditing ? (
          <textarea
            className="drag-reorder-inline-edit"
            value={item.content}
            autoFocus
            onChange={(e) => onItemChange?.(item.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span>{item.content}</span>
        )}
        <DragIndicator first={isFirstItem} last={isLastItem} />
      </div>
    </div>
  )
}

/**
 * Props for the DragReorder sortable list component.
 *
 * @property items - Array of items to render in order
 * @property onChange - Called with the reordered array after a successful drag-and-drop
 * @property animation - Play a brief up/down hint animation on mount to indicate draggability (default: `false`)
 * @property readOnly - Disables drag handles so items cannot be reordered (default: `false`)
 * @property editingTarget - `id` of the item whose content should render as an inline textarea.
 *   When set, dragging is suspended for that item and `onItemChange` receives edits.
 * @property onItemChange - Called with `(id, newContent)` when the inline editor changes a value
 */
interface DragReorderProps {
  items: DragItem[]
  onChange: (items: DragItem[]) => void
  animation?: boolean
  readOnly?: boolean
  editingTarget?: string | null
  onItemChange?: (id: string, content: string) => void
}

export const DragReorder: React.FC<DragReorderProps> = ({
  items,
  onChange,
  animation = false,
  readOnly = false,
  editingTarget,
  onItemChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))
  const [animateHint, setAnimateHint] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeItem = items.find((i) => i.id === activeId) || null
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!animation) return
    const timeout = setTimeout(() => setAnimateHint(false), 1000)
    return () => clearTimeout(timeout)
  }, [animation])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(items, oldIndex, newIndex)

    onChange(newOrder)
  }

  return (
    <div className="DnD-container" ref={containerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentBounds, restrictToFirstScrollableAncestor]}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="drag-reorder-list">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                animateHint={animateHint && animation}
                activeId={activeId}
                readOnly={readOnly}
                isFirstItem={index === 0}
                isLastItem={index === items.length - 1}
                editingTarget={editingTarget}
                onItemChange={onItemChange}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeItem && (
            <div className="reorder-item dragging-overlay">
              <div className="item-container">
                <span>{activeItem.content}</span>
                <DragIndicator />
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

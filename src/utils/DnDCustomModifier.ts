import { Modifier } from '@dnd-kit/core'

/**
 * A dnd-kit `Modifier` that constrains a dragged item within its container's vertical bounds.
 * Horizontal movement uses a `tanh`-based soft limit to prevent snapping during horizontal drift.
 *
 * Reads the container from dnd-kit's own `containerNodeRect` rather than taking a node —
 * passing `ref.current` in from render is a render-phase ref read.
 *
 * @example
 * <DndContext modifiers={[restrictToParentBounds]}>
 */
export const restrictToParentBounds: Modifier = ({
  transform,
  activeNodeRect,
  containerNodeRect,
}) => {
  if (!containerNodeRect || !activeNodeRect) return transform

  // Y should not exceed the bottom of the container (minus the item height)
  const maxY = containerNodeRect.height - activeNodeRect.height

  // Let them drag up as far as they want, but stop them going too far down
  const clampedY = Math.min(transform.y, maxY)

  // Soft horizontal constraint — to stop snap back
  const softX = 50 * Math.tanh(transform.x / 50)

  return {
    ...transform,
    x: softX,
    y: clampedY,
  }
}

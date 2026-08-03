export type SortDirection = 'asc' | 'desc'

export type TableColumn<Row> = {
  /** Stable key — also used as the grid area / sort field. */
  key: string
  /** Header label. */
  header: React.ReactNode
  /** Grid track sizing for this column (e.g. '1fr', '120px', 'minmax(80px, 1fr)'). */
  width?: string
  /** Whether this column can be sorted. */
  sortable?: boolean
  /** Cell renderer. Receives the row; returns any node (text, button, progress bar, etc.). */
  cell: (row: Row) => React.ReactNode
  /** Optional comparator for sorting; falls back to string compare on the rendered value. */
  sortAccessor?: (row: Row) => string | number
  /** Horizontal alignment of the cell content. */
  align?: 'left' | 'center' | 'right'
}

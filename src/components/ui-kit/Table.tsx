import React, { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import type { TableColumn, SortDirection } from '@types'

import './styles/table.scss'

interface TableProps<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  /** Unique key per row. */
  rowKey: (row: Row) => string
  /** Empty-state message shown when there are no rows. */
  emptyMessage?: React.ReactNode
  /** Fixed height for the scrollable body (e.g. '162px'). Omit to grow with content. */
  bodyHeight?: string
  /** Optional row click handler. */
  onRowClick?: (row: Row) => void
  /** Key of the currently selected row (for the selected band). */
  selectedRowKey?: string
  /** Optional per-row class hook (e.g. status tinting). */
  rowClassName?: (row: Row) => string
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No results found',
  bodyHeight,
  onRowClick,
  selectedRowKey,
  rowClassName,
}: TableProps<Row>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDirection } | null>(null)

  const gridTemplate = useMemo(() => columns.map((c) => c.width ?? '1fr').join(' '), [columns])

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const accessor = col.sortAccessor ?? ((row: Row) => String(col.cell(row) ?? ''))
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (av < bv) return -1 * factor
      if (av > bv) return 1 * factor
      return 0
    })
  }, [rows, sort, columns])

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return null // third click clears
    })
  }

  const sortIcon = (key: string) => {
    if (!sort || sort.key !== key) return faSort
    return sort.dir === 'asc' ? faSortUp : faSortDown
  }

  const isEmpty = sortedRows.length === 0

  return (
    <div className="data-table" role="table" aria-rowcount={rows.length}>
      {/* Header */}
      <div className="data-table__header" role="row" style={{ gridTemplateColumns: gridTemplate }}>
        {columns.map((col) => {
          const sortable = col.sortable
          const active = sort?.key === col.key
          return (
            <div
              key={col.key}
              className={`data-table__th data-table__th--${col.align ?? 'left'}${
                sortable ? ' data-table__th--sortable' : ''
              }`}
              role="columnheader"
              aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
              onClick={sortable ? () => toggleSort(col.key) : undefined}
            >
              <span className="data-table__th-label">{col.header}</span>
              {sortable && (
                <FontAwesomeIcon
                  icon={sortIcon(col.key)}
                  className={`data-table__sort-icon${
                    active ? ' data-table__sort-icon--active' : ''
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Body */}
      <div
        className="data-table__body"
        role="rowgroup"
        style={bodyHeight ? { height: bodyHeight } : undefined}
      >
        {isEmpty ? (
          <div className="data-table__empty" role="row">
            <div role="cell" className="data-table__empty-cell">
              {emptyMessage}
            </div>
          </div>
        ) : (
          sortedRows.map((row) => {
            const key = rowKey(row)
            const selected = selectedRowKey === key
            const extra = rowClassName?.(row) ?? ''
            return (
              <div
                key={key}
                className={`data-table__row${selected ? ' data-table__row--selected' : ''}${
                  onRowClick ? ' data-table__row--clickable' : ''
                }${extra ? ` ${extra}` : ''}`}
                role="row"
                aria-selected={selected || undefined}
                style={{ gridTemplateColumns: gridTemplate }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`data-table__td data-table__td--${col.align ?? 'left'}`}
                    role="cell"
                  >
                    {col.cell(row)}
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

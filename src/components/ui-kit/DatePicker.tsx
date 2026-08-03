import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import Button from './Button'
import Spacer from './Spacer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import 'react-day-picker/style.css'
import './styles/datePicker.scss'

const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString()

const getDateRange = (start: Date, end: Date) => {
  const result: Date[] = []
  const cur = new Date(start)
  const dir = start <= end ? 1 : -1

  while (true) {
    result.push(new Date(cur))
    if (isSameDay(cur, end)) break
    cur.setDate(cur.getDate() + dir)
  }

  return result
}

function formatDDMMYYYY(date: Date) {
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

type PickerMode = 'single' | 'range' | 'recurring'

/**
 * Props for the DatePicker multi-month calendar component.
 *
 * @property value - Controlled array of selected `Date` objects
 * @property onChange - Called with the updated array whenever the selection changes.
 *   An empty array is passed when the selection is cleared.
 */
interface DatePickerProps {
  value?: Date[]
  onChange?: (days: Date[]) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [selectedDays, setSelectedDays] = useState<Date[]>(value || [])
  const [anchorDay, setAnchorDay] = useState<Date | null>(null)
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() - 1, 1)
  })
  const [mode, setMode] = useState<PickerMode>('range')

  const isActiveMode = (currentMode: PickerMode) => {
    return currentMode === mode ? 'active' : ''
  }

  const changeMode = (newMode: PickerMode) => {
    setMode(newMode)
    setSelectedDays([])
    setAnchorDay(null)

    onChange?.([])
  }

  function CustomMonth(props: any) {
    // v10 passes displayIndex alongside calendarMonth; neither belongs on the
    // DOM node, so strip both before spreading.
    const { calendarMonth, displayIndex: _displayIndex, children, className, ...rest } = props

    // The actual Date object for the month
    const monthDate: Date | undefined = calendarMonth?.date

    const today = new Date()

    const isCurrent =
      monthDate &&
      today.getFullYear() === monthDate.getFullYear() &&
      today.getMonth() === monthDate.getMonth()

    const finalClassName = isCurrent ? `${className} current-month` : className

    return (
      <div className={finalClassName} {...rest}>
        {children}
      </div>
    )
  }

  const goPrevMonth = () => {
    setStartMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }

  const goNextMonth = () => {
    setStartMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  }

  // Sync external value → internal state. Adjusted during render rather than in
  // an effect so the calendar never paints a stale selection.
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    if (value) setSelectedDays(value)
  }

  const updateDays = (days: Date[]) => {
    setSelectedDays(days)
    onChange?.(days)
  }

  const handleDayClick = (day: Date) => {
    if (mode === 'single') {
      const exists = selectedDays.some((d) => isSameDay(d, day))

      if (exists) {
        // remove if already selected
        const updated = selectedDays.filter((d) => !isSameDay(d, day))
        setSelectedDays(updated)
        onChange?.(updated)
      } else {
        // add as independent date
        const updated = [...selectedDays, day].sort((a, b) => a.getTime() - b.getTime())
        setSelectedDays(updated)
        onChange?.(updated)
      }
      return
    }

    if (mode === 'range') {
      if (!anchorDay) {
        setAnchorDay(day)
        setSelectedDays([day])
        return
      }

      const range = getDateRange(anchorDay, day).sort((a, b) => a.getTime() - b.getTime())
      setSelectedDays(range)
      onChange?.(range)
      setAnchorDay(null)
      return
    }

    if (mode === 'recurring') {
      console.log('TODO: recurring logic')
    }
  }

  const resetAll = () => {
    updateDays([])
    setAnchorDay(null)
  }

  const shownDays = anchorDay ? [anchorDay] : selectedDays

  const startDate = selectedDays[0] ? formatDDMMYYYY(selectedDays[0]) : ''
  const finishDate =
    selectedDays.length > 1 ? formatDDMMYYYY(selectedDays[selectedDays.length - 1]) : ''

  const rangeStart = selectedDays[0]
  const rangeEnd = selectedDays[selectedDays.length - 1]
  const isRange = selectedDays.length > 1

  const isSelecting = mode === 'range' && anchorDay !== null

  const modifiers = !isSelecting
    ? {
        range_start: rangeStart ? (date: Date) => isSameDay(date, rangeStart) : undefined,
        range_end: rangeEnd ? (date: Date) => isSameDay(date, rangeEnd) : undefined,
        range_middle: isRange ? (date: Date) => date > rangeStart! && date < rangeEnd! : undefined,
      }
    : {} // <-- disable modifiers while selecting

  return (
    <div className="date-picker-container">
      <div className="flex-container spread">
        <div className="date-display">
          <h4>
            Start Date: <span>{startDate === '' ? 'No date selected' : startDate}</span>
          </h4>
          <h4>
            Finish Date: <span>{finishDate === '' ? 'No date selected' : finishDate}</span>
          </h4>
        </div>
        <Button
          variant="filter"
          label="Clear Selection"
          handleClick={resetAll}
          style={{ margin: 0 }}
        />
      </div>
      <Spacer size={1} />

      <div className="flex-container spread">
        <Button
          variant="icon-only"
          aria-label="Previous month"
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
          handleClick={goPrevMonth}
        />
        <Button
          className={isActiveMode('single')}
          variant="text-only"
          normalCase
          label="Individual"
          handleClick={() => changeMode('single')}
        />
        <Button
          className={isActiveMode('range')}
          variant="text-only"
          normalCase
          label="Range"
          handleClick={() => changeMode('range')}
        />
        <Button
          className={isActiveMode('recurring')}
          variant="text-only"
          normalCase
          label="Recurring"
          handleClick={() => changeMode('recurring')}
          disabled
        />
        <Button
          variant="icon-only"
          aria-label="Next month"
          icon={<FontAwesomeIcon icon={faChevronRight} />}
          handleClick={goNextMonth}
        />
      </div>
      <div className="selected-dates-list">
        {selectedDays.length > 0 ? (
          mode === 'range' ? (
            <p>
              From {startDate} to {finishDate}
            </p>
          ) : (
            <div className="day-display-container">
              {selectedDays.map((d, i) => (
                <p key={i}>{formatDDMMYYYY(d)}</p>
              ))}
            </div>
          )
        ) : (
          <p>No dates selected.</p>
        )}
      </div>

      <DayPicker
        onSelect={() => {}}
        modifiers={mode === 'range' ? modifiers : {}}
        modifiersClassNames={
          !isSelecting
            ? {
                range_start: 'range-start',
                range_end: 'range-end',
                range_middle: 'range-middle',
              }
            : {}
        }
        month={startMonth}
        numberOfMonths={12}
        components={{ Month: CustomMonth }}
        mode="multiple"
        hideNavigation={true}
        selected={shownDays}
        onDayClick={handleDayClick}
        {...({} as any)}
      />
    </div>
  )
}

/**
 * Converts an ISO date string to the display format expected by `DateInputMask`
 * based on the question type code.
 *
 * Question type codes:
 * - 301/304/307 → `YYYY` (year only)
 * - 302/305/308 → `MM-YYYY` (month and year)
 * - 303/306/309 → `DD-MM-YYYY` (full date)
 *
 * @param isoDate - ISO date string (e.g. `'2024-06-15T00:00:00Z'`)
 * @param qType - Numeric question type code
 * @returns Formatted date string, or `''` on invalid input
 */
export const formatDateForInput = (isoDate: string, qType: number): string => {
  if (!isoDate) return ''

  const date = new Date(isoDate)

  if (isNaN(date.getTime())) {
    console.warn(`Invalid date provided: ${isoDate}`)
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  console.log(`${day}-${month}-${year}`)

  switch (qType) {
    case 301: // Today Year
    case 304: // DOB Year
    case 307: // Empty Year
      return `${year}`

    case 302: // Today Month and Year
    case 305: // DOB Month and Year
    case 308: // Empty Month and Year
      return `${month}-${year}`

    case 303: // Today Full Date
    case 306: // DOB Full Date
    case 309: // Empty Full Date
      return `${day}-${month}-${year}`

    default:
      return `${day}-${month}-${year}`
  }
}

/**
 * Converts a `DD-MM-YYYY` date string to SQL `YYYY-MM-DD` format.
 * Passes through strings already in SQL format unchanged.
 *
 * @param date - Date string in `DD-MM-YYYY` or `YYYY-MM-DD` format
 * @returns SQL date string, or `''` on invalid input
 */
export function ddmmyyyyToSql(date: string): string {
  if (!date) return ''

  // already SQL → return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  // expect DD-MM-YYYY
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    console.warn('ddmmyyyyToSql received invalid date:', date)
    return ''
  }

  const [dd, mm, yyyy] = date.split('-')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Extracts the date portion (`YYYY-MM-DD`) from an ISO 8601 datetime string.
 *
 * @param iso - Full ISO datetime string (e.g. `'2024-06-15T10:30:00Z'`)
 * @returns SQL date string (`YYYY-MM-DD`), or `''` on invalid input
 */
export function isoToSqlDate(iso: string): string {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

/**
 * Converts a SQL `YYYY-MM-DD` date string to `DD-MM-YYYY` display format.
 * Passes through strings already in `DD-MM-YYYY` format unchanged.
 *
 * @param date - Date string in `YYYY-MM-DD` or `DD-MM-YYYY` format
 * @returns Display date string (`DD-MM-YYYY`), or `''` on invalid input
 */
export function sqlToDdmmyyyy(date: string): string {
  if (!date) return ''

  // already DD-MM-YYYY → return as-is
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return date
  }

  // expect YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.warn('sqlToDdmmyyyy received non-sql date:', date)
    return ''
  }

  const [yyyy, mm, dd] = date.split('-')
  return `${dd}-${mm}-${yyyy}`
}

/**
 * Splits a SQL datetime string into separate `DD-MM-YYYY` date and `HH:mm` time strings.
 * Treats the value as local time (strips timezone before parsing).
 *
 * @param isoDateTime - SQL datetime string (e.g. `'2024-06-15 10:30:00'`)
 * @returns Object with `date` (`DD-MM-YYYY`) and `time` (`HH:mm`); both `''` on invalid input
 */
export function splitSqlDateTime(isoDateTime?: string | null): { date: string; time: string } {
  if (!isoDateTime) return { date: '', time: '' }

  const local = isoDateTime.slice(0, 16) // strip timezone, treat as local
  const date = new Date(local)

  if (isNaN(date.getTime())) {
    console.warn(`Invalid datetime provided: ${isoDateTime}`)
    return { date: '', time: '' }
  }

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return {
    date: `${dd}-${mm}-${yyyy}`,
    time: `${hh}:${min}`,
  }
}
/**
 * Combines separate date (`YYYY-MM-DD`) and time (`HH:mm`) strings into a SQL datetime.
 *
 * @param date - Date string in `YYYY-MM-DD` format
 * @param time - Time string in `HH:mm` format
 * @returns SQL datetime string (`'YYYY-MM-DD HH:mm:00'`), or `null` if either input is empty
 */
export const combineDateTime = (date: string, time: string) => {
  if (!date || !time) return null

  // date is YYYY-MM-DD
  // time is HH:mm (local)
  return `${date} ${time}:00`
}

/**
 * Strips the time portion from an ISO datetime string (anything after `T`).
 * Returns the value unchanged if no `T` is present.
 *
 * @param val - ISO datetime string or plain date string
 * @returns Date-only string (`YYYY-MM-DD`)
 */
export function stripTimeFromDate(val: string): string {
  if (val && val.includes('T')) {
    return val.split('T')[0]
  }
  return val
}

/**
 * Formats a date as a human-readable Australian long-form string with an ordinal suffix.
 *
 * @param input - ISO date string or `Date` object
 * @returns e.g. `'15th June 2024'`, or `'—'` for missing/invalid input
 *
 * @example
 * formatDate('2024-06-15') // → '15th June 2024'
 * formatDate('2024-06-01') // → '1st June 2024'
 */
export const formatDate = (input?: string | Date): string => {
  if (!input) return '—'

  const date = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return '—'

  const day = date.getDate()
  const month = date.toLocaleString('en-AU', { month: 'long' })
  const year = date.getFullYear()

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'

  return `${day}${suffix} ${month} ${year}`
}

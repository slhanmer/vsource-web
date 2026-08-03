/**
 * Converts a half-hour slot index to an `HH:mm` time string.
 * Each unit represents 30 minutes, so `0` → `'00:00'`, `1` → `'00:30'`, `2` → `'01:00'`, etc.
 * Used to convert legacy numeric time representations from the class scheduling system.
 *
 * @param time - Numeric half-hour slot index (0–47 for a 24-hour day)
 * @returns Time string in `HH:mm` format (e.g. `'09:30'`)
 */
export function convertTimeToHour(time: number | string): string {
  const timeHour = Math.floor(Number(time) / 2)
  const timeMin = Number(time) % 2 ? '30' : '00'
  const hourStr = timeHour < 10 ? `0${timeHour}` : `${timeHour}`
  return `${hourStr}:${timeMin}`
}
